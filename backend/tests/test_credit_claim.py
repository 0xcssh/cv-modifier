"""Tests for the atomic credit claim in POST /generations and the refund path."""
from __future__ import annotations

import asyncio
import uuid
from unittest.mock import AsyncMock, patch

import pytest
from sqlalchemy import select

from app.models import CreditTransaction, Generation, User
from tests.conftest import _TEST_SESSION, set_current_user


API = "/api/generations"


async def _count_generations(user_id) -> int:
    """Count generations using a fresh session (bypasses identity-map caching)."""
    async with _TEST_SESSION() as s:
        res = await s.execute(select(Generation).where(Generation.user_id == user_id))
        return len(res.scalars().all())


async def _refresh_credits(user_id) -> int:
    """Fetch credits via a brand-new session so we see writes from other sessions."""
    async with _TEST_SESSION() as s:
        res = await s.execute(select(User).where(User.id == user_id))
        return res.scalar_one().credits


@pytest.fixture(autouse=True)
def _mute_background_pipeline():
    """By default, make the background generation pipeline a no-op in credit tests.

    The endpoint spawns a `BackgroundTask(run_generation_pipeline, ...)`. Starlette
    runs background tasks BEFORE the response is returned when used with
    httpx ASGITransport (it blocks until they finish), so if we don't stub it out
    the test will try to hit the real Claude API.

    Individual tests that need to exercise the pipeline's failure/refund path
    should `patch.stopall()` or patch at a different level.
    """
    from app.api import generations as gens_module

    async def _noop(*args, **kwargs):
        return None

    with patch.object(gens_module, "run_generation_pipeline", _noop):
        yield


@pytest.mark.asyncio
async def test_single_post_decrements_credits_and_creates_generation(
    app_client, db_session, make_user, make_profile
):
    user = await make_user(credits=3)
    await make_profile(user)
    set_current_user(user)

    r = await app_client.post(
        API, json={"job_text": "offer text about python backend dev"}
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "pending"

    # Credits decremented
    assert await _refresh_credits(user.id) == 2
    # One generation row
    assert await _count_generations(user.id) == 1


@pytest.mark.asyncio
async def test_zero_credits_returns_402_and_no_generation_row(
    app_client, db_session, make_user, make_profile
):
    user = await make_user(credits=0)
    await make_profile(user)
    set_current_user(user)

    r = await app_client.post(API, json={"job_text": "offer text"})
    assert r.status_code == 402
    assert "Crédits insuffisants" in r.json()["detail"]

    # No generation row was created
    assert await _count_generations(user.id) == 0
    # Credits still 0
    assert await _refresh_credits(user.id) == 0


@pytest.mark.asyncio
async def test_concurrent_posts_only_one_succeeds_when_one_credit(
    app_client, db_session, make_user, make_profile
):
    user = await make_user(credits=1)
    await make_profile(user)
    set_current_user(user)

    # Fire 5 concurrent requests with only 1 credit available.
    payload = {"job_text": "offer text"}
    results = await asyncio.gather(
        *[app_client.post(API, json=payload) for _ in range(5)]
    )

    statuses = [r.status_code for r in results]
    successes = [r for r in results if r.status_code == 201]
    failures = [r for r in results if r.status_code == 402]

    # Exactly one 201, the rest 402.
    assert len(successes) == 1, f"Expected 1 success; got statuses={statuses}"
    assert len(failures) == 4, f"Expected 4 failures; got statuses={statuses}"

    # Final credit count should be exactly 0 — never negative.
    final = await _refresh_credits(user.id)
    assert final == 0, f"Expected credits=0 after race, got {final}"

    # Exactly one generation row created.
    assert await _count_generations(user.id) == 1


@pytest.mark.asyncio
async def test_pipeline_refunds_credit_on_failure(
    db_session, make_user, make_profile
):
    """Simulate the background pipeline failing and verify credit is refunded +
    a CreditTransaction(amount=+1, reason='generation_refund') row exists."""
    user = await make_user(credits=2)
    # Manually claim the credit (mirrors what the endpoint does synchronously).
    user.credits -= 1
    await db_session.commit()
    await db_session.refresh(user)
    assert user.credits == 1

    await make_profile(user)

    # Insert a generation row in "pending" state.
    gen = Generation(
        user_id=user.id,
        job_text="some job offer",
        status="pending",
    )
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    # Patch generate_adapted_cv to raise, so the pipeline hits the except branch
    # (which is where the refund logic lives).
    from app.services import pipeline as pipeline_module

    boom = AsyncMock(side_effect=RuntimeError("claude exploded"))

    with patch.object(pipeline_module, "generate_adapted_cv", boom):
        await pipeline_module.run_generation_pipeline(
            generation_id=gen.id,
            user_id=user.id,
            job_url=None,
            job_text="some job offer",
        )

    # Assert via a fresh session — the pipeline commits in its OWN session, and
    # SQLAlchemy's identity map would otherwise return the stale cached object.
    async with _TEST_SESSION() as fresh:
        user_db = (
            await fresh.execute(select(User).where(User.id == user.id))
        ).scalar_one()
        assert user_db.credits == 2, "credit should have been refunded (1 -> 2)"

        gen_db = await fresh.get(Generation, gen.id)
        assert gen_db.status == "failed"
        assert gen_db.error_message  # non-empty sanitized message

        # A refund ledger entry should exist.
        txs = (
            await fresh.execute(
                select(CreditTransaction).where(CreditTransaction.user_id == user.id)
            )
        ).scalars().all()
        refunds = [t for t in txs if t.reason == "generation_refund" and t.amount == +1]
        assert len(refunds) == 1, (
            f"expected 1 refund transaction, got {[(t.reason, t.amount) for t in txs]}"
        )
        assert refunds[0].generation_id == gen.id
