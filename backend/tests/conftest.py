"""Shared test fixtures.

Key things this conftest does:
  - Sets SECRET_KEY and DATABASE_URL BEFORE any `app.*` import so the
    fail-closed check in main.py's lifespan passes and the app's engine
    is bound to an in-memory SQLite shared across every connection.
  - Creates a single shared StaticPool sqlite+aiosqlite engine so multiple
    async sessions (including the background pipeline's own session maker)
    see the same data.
  - Overrides `current_active_user` and `current_verified_user` FastAPI-Users
    dependencies so tests don't need real JWT cookies. We pick "the user we
    want" per-test via a small registry.
  - Provides an httpx AsyncClient pre-configured with ASGI transport and
    the X-Requested-With header the CSRF middleware requires.
"""
from __future__ import annotations

import os
import uuid
from typing import AsyncIterator

# These MUST be set before importing any `app.*` module.
os.environ.setdefault("SECRET_KEY", "a" * 64)
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("STORAGE_BACKEND", "local")
os.environ.setdefault("ANTHROPIC_API_KEY", "test-key")
os.environ.setdefault("DEBUG", "false")

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool


# --- Shared in-memory engine ------------------------------------------------
# StaticPool + :memory: so every connection sees the same DB.
_TEST_ENGINE = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
_TEST_SESSION = async_sessionmaker(
    _TEST_ENGINE, class_=AsyncSession, expire_on_commit=False
)

# Patch the app's engine/session-maker so the background pipeline (which uses
# `app.database.async_session` directly) also talks to the same in-memory DB.
import app.database as app_database  # noqa: E402

app_database.engine = _TEST_ENGINE
app_database.async_session = _TEST_SESSION


async def _override_get_db() -> AsyncIterator[AsyncSession]:
    async with _TEST_SESSION() as session:
        yield session


app_database.get_db = _override_get_db  # keep the name pointing at the override


# --- User registry for auth dependency overrides ---------------------------
# Tests set `current_test_user["user"]` to the User row they want the
# auth deps to return. Supports distinct "active" vs "verified" slots for
# edge cases (not needed yet — both return the same test user).
current_test_user: dict[str, object] = {"user": None}


def _get_current_user_override():
    user = current_test_user.get("user")
    if user is None:
        # Raise a clear error if a test forgot to set a user.
        raise RuntimeError(
            "No test user set. Call `set_current_user(user)` in your test."
        )
    return user


# --- FastAPI app with overrides --------------------------------------------
from app.main import app  # noqa: E402
from app.database import Base, get_db  # noqa: E402
from app.core.security import current_active_user, current_verified_user  # noqa: E402


app.dependency_overrides[get_db] = _override_get_db
app.dependency_overrides[current_active_user] = _get_current_user_override
app.dependency_overrides[current_verified_user] = _get_current_user_override


# --- Fixtures ---------------------------------------------------------------
@pytest_asyncio.fixture(autouse=True)
async def _setup_db():
    """Create tables before each test, drop after. Also clears the user registry."""
    import app.models  # noqa: F401 — register models

    async with _TEST_ENGINE.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    current_test_user["user"] = None
    yield
    current_test_user["user"] = None

    async with _TEST_ENGINE.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session() -> AsyncIterator[AsyncSession]:
    """An async session bound to the shared test engine."""
    async with _TEST_SESSION() as session:
        yield session


@pytest_asyncio.fixture
async def app_client() -> AsyncIterator[AsyncClient]:
    """HTTPX client pointed at the FastAPI app, with the CSRF header preset."""
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url="http://testserver",
        headers={"X-Requested-With": "XMLHttpRequest"},
    ) as client:
        yield client


def set_current_user(user) -> None:
    """Helper for tests: set the current authenticated user."""
    current_test_user["user"] = user


@pytest_asyncio.fixture
async def make_user(db_session: AsyncSession):
    """Factory fixture that creates User rows directly in DB.

    Usage:
        user = await make_user(credits=3, is_verified=True)
    """
    from app.models import User

    created: list[User] = []

    async def _make(
        *,
        email: str | None = None,
        credits: int = 3,
        is_active: bool = True,
        is_verified: bool = True,
        is_superuser: bool = False,
    ) -> User:
        user = User(
            id=uuid.uuid4(),
            email=email or f"user-{uuid.uuid4().hex[:8]}@test.local",
            hashed_password="not-a-real-hash",
            is_active=is_active,
            is_verified=is_verified,
            is_superuser=is_superuser,
            credits=credits,
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        created.append(user)
        return user

    return _make


@pytest_asyncio.fixture
async def make_profile(db_session: AsyncSession):
    """Factory fixture that attaches a minimal Profile to a user."""
    from app.models import Profile

    async def _make(user, full_name: str = "Jane Doe", **kwargs) -> Profile:
        profile = Profile(
            user_id=user.id,
            full_name=full_name,
            email=kwargs.pop("email", None) or user.email,
            **kwargs,
        )
        db_session.add(profile)
        await db_session.commit()
        await db_session.refresh(profile)
        return profile

    return _make
