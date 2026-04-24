import logging

from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

logger = logging.getLogger(__name__)

# SQLite (dev + tests in-memory) n'accepte pas pool_size/max_overflow/pool_recycle.
# On applique ces réglages uniquement pour PostgreSQL/Neon en prod.
_is_postgres = "postgres" in settings.database_url
_engine_kwargs: dict = dict(echo=settings.debug)
if _is_postgres:
    # Neon ferme les connexions inactives après quelques minutes. pool_pre_ping
    # envoie un SELECT 1 avant checkout pour jeter une connexion morte au
    # lieu de la donner au requêtant. pool_recycle force la recréation après
    # 30 min, en filet de sécurité.
    _engine_kwargs.update(
        pool_pre_ping=True,
        pool_recycle=1800,
        pool_size=5,
        max_overflow=10,
    )

engine = create_async_engine(settings.database_url, **_engine_kwargs)
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
    # Referral program (Phase 13). Added as NULL to keep migration atomic —
    # the startup backfill below populates values for pre-existing users.
    ("users", "referral_code", "referral_code VARCHAR(10)"),
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


def _backfill_referral_codes(sync_conn) -> None:
    """Give every existing user a referral_code. Run once on startup.

    Idempotent: rows that already have a code are skipped. Uses retry on the
    tiny chance of collision (alphabet^6 = ~1B combos).
    """
    try:
        cols = _existing_columns(sync_conn, "users")
        if "referral_code" not in cols:
            return
        result = sync_conn.execute(
            text("SELECT id FROM users WHERE referral_code IS NULL")
        )
        rows = result.fetchall()
        if not rows:
            return
        from app.models.referral import generate_referral_code

        for (user_id,) in rows:
            for _ in range(5):
                code = generate_referral_code()
                try:
                    sync_conn.execute(
                        text(
                            "UPDATE users SET referral_code = :c WHERE id = :u"
                        ),
                        {"c": code, "u": user_id},
                    )
                    break
                except Exception as exc:
                    msg = str(exc).lower()
                    if "unique" in msg or "duplicate" in msg:
                        continue
                    raise
        logger.info("Backfilled referral_code for %d users", len(rows))
    except Exception:  # pragma: no cover - defensive, startup must not block
        logger.exception("Referral code backfill failed (ignored)")


async def create_tables():
    # Import all models so Base.metadata knows about them
    import app.models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_apply_column_migrations)
        await conn.run_sync(_backfill_referral_codes)
