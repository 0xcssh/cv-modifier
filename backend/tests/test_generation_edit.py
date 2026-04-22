"""Tests for PATCH /generations/{id} — the edit endpoint."""
from __future__ import annotations

import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.models import Generation
from tests.conftest import set_current_user


API = "/api/generations"


def _valid_adapted(**overrides):
    base = {
        "nom_entreprise": "ACME Corp",
        "titre_poste": "Senior Python Dev",
        "resume_professionnel": "Seasoned backend engineer.",
        "competences": ["Python", "FastAPI"],
        "atouts": ["Rigueur"],
        "experiences": [
            {
                "title": "Dev",
                "company": "Old Corp",
                "location": "Paris",
                "dates": "2020-2024",
                "bullets": ["Built stuff"],
            }
        ],
        "lettre_motivation": "Madame, Monsieur...",
    }
    base.update(overrides)
    return base


def _install_pdf_and_storage_mocks():
    """Context that no-ops PDF generation and storage writes.

    Returns the list of active patchers so the caller can stop() them.
    """
    # Patch the symbols AS IMPORTED in the generations module (not the source).
    import app.api.generations as gens_module

    patchers = [
        patch.object(gens_module, "generate_cv_pdf", return_value=b"%PDF-fake-cv"),
        patch.object(
            gens_module, "generate_cover_letter_pdf", return_value=b"%PDF-fake-letter"
        ),
    ]

    fake_storage = AsyncMock()
    fake_storage.put = AsyncMock(return_value=None)
    fake_storage.get = AsyncMock(return_value=b"photo-bytes")
    fake_storage.delete = AsyncMock(return_value=None)
    fake_storage.presigned_get_url = AsyncMock(return_value=None)
    patchers.append(patch.object(gens_module, "get_storage", return_value=fake_storage))

    for p in patchers:
        p.start()
    return patchers


def _stop_patchers(patchers):
    for p in patchers:
        p.stop()


@pytest.mark.asyncio
async def test_patch_completed_generation_updates_data_and_syncs_title(
    app_client, db_session, make_user, make_profile
):
    user = await make_user()
    await make_profile(user)

    gen = Generation(
        user_id=user.id,
        job_text="offer",
        status="completed",
        job_title="Old title",
        company_name="Old Co",
        adapted_data=_valid_adapted(titre_poste="Old title", nom_entreprise="Old Co"),
        profile_snapshot={"full_name": "Jane Doe"},
        cv_pdf_path="generations/old/cv.pdf",
        cover_letter_pdf_path="generations/old/letter.pdf",
    )
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    set_current_user(user)

    new_adapted = _valid_adapted(
        titre_poste="Shiny New Title", nom_entreprise="Shiny Co"
    )

    patchers = _install_pdf_and_storage_mocks()
    try:
        r = await app_client.patch(
            f"{API}/{gen.id}", json={"adapted_data": new_adapted}
        )
    finally:
        _stop_patchers(patchers)

    assert r.status_code == 200, r.text
    body = r.json()
    assert body["adapted_data"]["titre_poste"] == "Shiny New Title"

    # Row was updated in DB.
    await db_session.refresh(gen)
    assert gen.job_title == "Shiny New Title"
    assert gen.company_name == "Shiny Co"
    assert gen.adapted_data["competences"] == ["Python", "FastAPI"]


@pytest.mark.asyncio
async def test_patch_non_completed_generation_returns_400(
    app_client, db_session, make_user, make_profile
):
    user = await make_user()
    await make_profile(user)

    gen = Generation(
        user_id=user.id,
        job_text="offer",
        status="pending",  # not completed
        adapted_data=None,
        profile_snapshot={"full_name": "Jane"},
    )
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    set_current_user(user)

    patchers = _install_pdf_and_storage_mocks()
    try:
        r = await app_client.patch(
            f"{API}/{gen.id}", json={"adapted_data": _valid_adapted()}
        )
    finally:
        _stop_patchers(patchers)

    assert r.status_code == 400
    assert "terminées" in r.json()["detail"]


@pytest.mark.asyncio
async def test_patch_other_users_generation_returns_404(
    app_client, db_session, make_user, make_profile
):
    user_a = await make_user()
    user_b = await make_user()
    await make_profile(user_b)

    gen = Generation(
        user_id=user_a.id,
        job_text="offer",
        status="completed",
        adapted_data=_valid_adapted(),
        profile_snapshot={"full_name": "A"},
    )
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    # Authenticated as B, try to PATCH A's gen.
    set_current_user(user_b)

    patchers = _install_pdf_and_storage_mocks()
    try:
        r = await app_client.patch(
            f"{API}/{gen.id}", json={"adapted_data": _valid_adapted()}
        )
    finally:
        _stop_patchers(patchers)

    assert r.status_code == 404

    # And A's data is unchanged.
    await db_session.refresh(gen)
    assert gen.adapted_data["titre_poste"] == "Senior Python Dev"


@pytest.mark.asyncio
async def test_patch_missing_profile_snapshot_returns_400(
    app_client, db_session, make_user, make_profile
):
    user = await make_user()
    await make_profile(user)

    gen = Generation(
        user_id=user.id,
        job_text="offer",
        status="completed",
        adapted_data=_valid_adapted(),
        profile_snapshot=None,  # missing
    )
    db_session.add(gen)
    await db_session.commit()
    await db_session.refresh(gen)

    set_current_user(user)

    patchers = _install_pdf_and_storage_mocks()
    try:
        r = await app_client.patch(
            f"{API}/{gen.id}", json={"adapted_data": _valid_adapted()}
        )
    finally:
        _stop_patchers(patchers)

    assert r.status_code == 400
    assert "snapshot" in r.json()["detail"].lower()
