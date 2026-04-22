import logging

from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

logger = logging.getLogger(__name__)

engine = create_async_engine(settings.database_url, echo=settings.debug)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


# Lightweight column additions for tables that already exist. No Alembic.
# Each entry: (table_name, column_name, "<column SQL including name, type, default>")
_COLUMN_MIGRATIONS: list[tuple[str, str, str]] = [
    ("profiles", "cv_template", "cv_template VARCHAR(20) DEFAULT 'classic'"),
    # Stripe billing columns (added after Phase 4)
    ("users", "stripe_customer_id", "stripe_customer_id VARCHAR(80)"),
    ("users", "stripe_subscription_id", "stripe_subscription_id VARCHAR(80)"),
    (
        "users",
        "subscription_current_period_end",
        "subscription_current_period_end TIMESTAMP WITH TIME ZONE",
    ),
    (
        "credit_transactions",
        "stripe_event_id",
        "stripe_event_id VARCHAR(80)",
    ),
]


def _existing_columns(sync_conn, table: str) -> set[str]:
    try:
        return {c["name"] for c in inspect(sync_conn).get_columns(table)}
    except Exception:
        return set()


def _apply_column_migrations(sync_conn) -> None:
    for table, column, ddl in _COLUMN_MIGRATIONS:
        cols = _existing_columns(sync_conn, table)
        if not cols or column in cols:
            continue
        try:
            sync_conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {ddl}"))
            logger.info("Added column %s.%s", table, column)
        except Exception as exc:  # pragma: no cover - idempotent safety net
            msg = str(exc).lower()
            if "duplicate" in msg or "already exists" in msg:
                return
            logger.warning("Could not add column %s.%s: %s", table, column, exc)


async def create_tables():
    # Import all models so Base.metadata knows about them
    import app.models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_apply_column_migrations)
