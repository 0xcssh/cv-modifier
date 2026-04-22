"""IDOR tests — users must not be able to reach/modify another user's resources."""
from __future__ import annotations

import uuid

import pytest

from app.models import Generation, Profile
from tests.conftest import set_current_user


API = "/api/generations"


@pytest.mark.asyncio
async def test_user_b_cannot_get_user_a_generation(
    app_client, db_session, make_user
):
    user_a = await make_user()
    user_b = await make_user()

    # Create a generation belonging to A directly in the DB.
    gen = Generation(
        user_id=user_a.id,
        job_text="offer",
        status="completed",
        adapted_data={"titre_poste": "Dev"},
    )
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    # Authenticate as B and try to fetch A's generation.
    set_current_user(user_b)
    r = await app_client.get(f"{API}/{gen.id}")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_user_b_cannot_patch_user_a_generation(
    app_client, db_session, make_user
):
    user_a = await make_user()
    user_b = await make_user()

    gen = Generation(
        user_id=user_a.id,
        job_text="offer",
        status="completed",
        adapted_data={
            "nom_entreprise": "ACME",
            "titre_poste": "Dev",
            "resume_professionnel": "r",
            "competences": [],
            "atouts": [],
            "experiences": [],
            "lettre_motivation": "hello",
        },
        profile_snapshot={"full_name": "A"},
    )
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    set_current_user(user_b)
    r = await app_client.patch(
        f"{API}/{gen.id}",
        json={
            "adapted_data": {
                "nom_entreprise": "Pwned",
                "titre_poste": "Hacker",
                "resume_professionnel": "x",
                "competences": [],
                "atouts": [],
                "experiences": [],
                "lettre_motivation": "y",
            }
        },
    )
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_user_b_cannot_delete_user_a_generation(
    app_client, db_session, make_user
):
    user_a = await make_user()
    user_b = await make_user()

    gen = Generation(user_id=user_a.id, job_text="offer", status="completed")
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    set_current_user(user_b)
    r = await app_client.delete(f"{API}/{gen.id}")
    assert r.status_code == 404

    # Confirm the row still exists.
    still_there = await db_session.get(Generation, gen.id)
    assert still_there is not None


@pytest.mark.asyncio
async def test_user_b_cannot_see_user_a_profile(
    app_client, db_session, make_user, make_profile
):
    user_a = await make_user()
    user_b = await make_user()  # B has no profile of their own
    await make_profile(user_a, full_name="Alice A")

    # When B authenticates and hits GET /profile, they must get their OWN
    # profile — which doesn't exist → 404. A's profile must NOT leak.
    set_current_user(user_b)
    r = await app_client.get("/api/profile")
    assert r.status_code == 404

    # And if B has their own profile, it must be B's name, not A's.
    await make_profile(user_b, full_name="Bob B")
    r = await app_client.get("/api/profile")
    assert r.status_code == 200
    assert r.json()["full_name"] == "Bob B"


@pytest.mark.asyncio
async def test_random_uuid_returns_404_not_leaking_existence(
    app_client, db_session, make_user
):
    user_a = await make_user()
    user_b = await make_user()

    gen = Generation(user_id=user_a.id, job_text="offer", status="completed")
    db_session.add(gen)
    await db_session.commit()

    set_current_user(user_b)

    # Existing gen owned by A: 404.
    r1 = await app_client.get(f"{API}/{gen.id}")
    # Random non-existent UUID: 404.
    r2 = await app_client.get(f"{API}/{uuid.uuid4()}")

    assert r1.status_code == 404
    assert r2.status_code == 404
    # The two responses must be indistinguishable (no info leak).
    assert r1.json() == r2.json()
