"""Tests for the referral program (Phase 13).

Covers:
- Code generation uniqueness + alphabet.
- `consume_referral_code`: valid code, self-referral, unknown code, double-referee.
- `maybe_grant_referrer_reward`: happy path, idempotency, unverified guard.
- `GET /api/referrals/me`: returns code + share URL + stats.
"""
from __future__ import annotations

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CreditTransaction, Referral, User, generate_referral_code
from app.services.referrals import (
    REFEREE_SIGNUP_BONUS,
    REFERRER_REWARD,
    consume_referral_code,
    maybe_grant_referrer_reward,
)


# --- Helpers ---------------------------------------------------------------
async def _assign_code(db: AsyncSession, user: User, code: str) -> None:
    user.referral_code = code
    db.add(user)
    await db.commit()


# --- generate_referral_code ------------------------------------------------
def test_referral_code_format():
    code = generate_referral_code()
    assert len(code) == 6
    # No lookalike chars.
    for c in code:
        assert c not in "01OIl"
        assert c.isalnum() and c == c.upper()


def test_referral_codes_are_distinct():
    codes = {generate_referral_code() for _ in range(2000)}
    # Birthday paradox at 2k draws on 32^6 space is negligible — expect 2000.
    assert len(codes) > 1990


# --- consume_referral_code -------------------------------------------------
@pytest.mark.asyncio
async def test_consume_valid_referral_grants_bonus_and_creates_row(
    db_session: AsyncSession, make_user
):
    referrer = await make_user(credits=3)
    await _assign_code(db_session, referrer, "AAAAAA")
    referee = await make_user(credits=3)

    await consume_referral_code(referee, "AAAAAA")

    # Referee credits bumped.
    await db_session.refresh(referee)
    assert referee.credits == 3 + REFEREE_SIGNUP_BONUS

    # Referral row created, linked both ways, bonus timestamp set.
    rows = (await db_session.execute(select(Referral))).scalars().all()
    assert len(rows) == 1
    r = rows[0]
    assert r.referrer_id == referrer.id
    assert r.referee_id == referee.id
    assert r.code_used == "AAAAAA"
    assert r.referee_bonus_granted_at is not None
    assert r.referrer_reward_granted_at is None

    # CreditTransaction logged.
    txs = (
        await db_session.execute(
            select(CreditTransaction).where(
                CreditTransaction.user_id == referee.id
            )
        )
    ).scalars().all()
    assert any(t.reason == "referral_signup_bonus" and t.amount == REFEREE_SIGNUP_BONUS for t in txs)


@pytest.mark.asyncio
async def test_consume_is_case_insensitive(db_session: AsyncSession, make_user):
    referrer = await make_user()
    await _assign_code(db_session, referrer, "BBBBBB")
    referee = await make_user()

    await consume_referral_code(referee, "  bbbbbb  ")

    rows = (await db_session.execute(select(Referral))).scalars().all()
    assert len(rows) == 1


@pytest.mark.asyncio
async def test_consume_unknown_code_is_noop(db_session: AsyncSession, make_user):
    referee = await make_user(credits=3)
    await consume_referral_code(referee, "ZZZZZZ")

    await db_session.refresh(referee)
    assert referee.credits == 3
    rows = (await db_session.execute(select(Referral))).scalars().all()
    assert rows == []


@pytest.mark.asyncio
async def test_consume_self_referral_blocked(db_session: AsyncSession, make_user):
    user = await make_user(credits=3)
    await _assign_code(db_session, user, "CCCCCC")

    await consume_referral_code(user, "CCCCCC")

    await db_session.refresh(user)
    assert user.credits == 3
    rows = (await db_session.execute(select(Referral))).scalars().all()
    assert rows == []


@pytest.mark.asyncio
async def test_consume_empty_code_is_noop(db_session: AsyncSession, make_user):
    referee = await make_user(credits=3)
    await consume_referral_code(referee, "   ")
    await db_session.refresh(referee)
    assert referee.credits == 3


@pytest.mark.asyncio
async def test_consume_is_one_per_referee(db_session: AsyncSession, make_user):
    referrer_a = await make_user()
    referrer_b = await make_user()
    await _assign_code(db_session, referrer_a, "DDDDDD")
    await _assign_code(db_session, referrer_b, "EEEEEE")
    referee = await make_user(credits=3)

    await consume_referral_code(referee, "DDDDDD")
    # Second attempt with a different valid code — must be ignored (UNIQUE(referee_id)).
    await consume_referral_code(referee, "EEEEEE")

    await db_session.refresh(referee)
    # Only one bonus credit applied.
    assert referee.credits == 3 + REFEREE_SIGNUP_BONUS
    rows = (await db_session.execute(select(Referral))).scalars().all()
    assert len(rows) == 1
    assert rows[0].referrer_id == referrer_a.id


# --- maybe_grant_referrer_reward -------------------------------------------
@pytest.mark.asyncio
async def test_referrer_reward_granted_on_verified_referee(
    db_session: AsyncSession, make_user
):
    referrer = await make_user(credits=5)
    await _assign_code(db_session, referrer, "FFFFFF")
    referee = await make_user(credits=3, is_verified=True)
    await consume_referral_code(referee, "FFFFFF")

    # Simulate "referee just completed first generation" → pipeline calls us.
    await maybe_grant_referrer_reward(db_session, referee.id)

    await db_session.refresh(referrer)
    assert referrer.credits == 5 + REFERRER_REWARD

    rows = (await db_session.execute(select(Referral))).scalars().all()
    assert rows[0].referrer_reward_granted_at is not None


@pytest.mark.asyncio
async def test_referrer_reward_is_idempotent(db_session: AsyncSession, make_user):
    referrer = await make_user(credits=5)
    await _assign_code(db_session, referrer, "GGGGGG")
    referee = await make_user(credits=3, is_verified=True)
    await consume_referral_code(referee, "GGGGGG")

    await maybe_grant_referrer_reward(db_session, referee.id)
    await maybe_grant_referrer_reward(db_session, referee.id)
    await maybe_grant_referrer_reward(db_session, referee.id)

    await db_session.refresh(referrer)
    assert referrer.credits == 5 + REFERRER_REWARD  # only once

    tx_count = len(
        (
            await db_session.execute(
                select(CreditTransaction).where(
                    CreditTransaction.user_id == referrer.id,
                    CreditTransaction.reason == "referral_reward",
                )
            )
        )
        .scalars()
        .all()
    )
    assert tx_count == 1


@pytest.mark.asyncio
async def test_referrer_reward_skipped_if_referee_not_verified(
    db_session: AsyncSession, make_user
):
    referrer = await make_user(credits=5)
    await _assign_code(db_session, referrer, "HHHHHH")
    referee = await make_user(credits=3, is_verified=False)
    await consume_referral_code(referee, "HHHHHH")

    await maybe_grant_referrer_reward(db_session, referee.id)

    await db_session.refresh(referrer)
    assert referrer.credits == 5  # unchanged


@pytest.mark.asyncio
async def test_referrer_reward_noop_if_no_referral(
    db_session: AsyncSession, make_user
):
    orphan = await make_user(is_verified=True)
    # No referral for this user — should do nothing and not raise.
    await maybe_grant_referrer_reward(db_session, orphan.id)


# --- GET /api/referrals/me -------------------------------------------------
@pytest.mark.asyncio
async def test_get_referral_info_returns_code_and_stats(
    app_client, db_session: AsyncSession, make_user
):
    from tests.conftest import set_current_user

    referrer = await make_user(credits=5)
    await _assign_code(db_session, referrer, "IIIIII")
    set_current_user(referrer)

    # Add 2 referees, 1 rewarded, 1 pending.
    referee_a = await make_user(is_verified=True)
    referee_b = await make_user(is_verified=True)
    await consume_referral_code(referee_a, "IIIIII")
    await consume_referral_code(referee_b, "IIIIII")
    await maybe_grant_referrer_reward(db_session, referee_a.id)
    # referee_b stays pending.

    resp = await app_client.get("/api/referrals/me")
    assert resp.status_code == 200
    body = resp.json()
    assert body["code"] == "IIIIII"
    assert body["share_url"].endswith("/register?ref=IIIIII")
    assert body["reward_referrer"] == REFERRER_REWARD
    assert body["reward_referee"] == REFEREE_SIGNUP_BONUS
    assert body["stats"]["total_referred"] == 2
    assert body["stats"]["rewarded"] == 1
    assert body["stats"]["pending"] == 1
    assert body["stats"]["credits_earned"] == REFERRER_REWARD
