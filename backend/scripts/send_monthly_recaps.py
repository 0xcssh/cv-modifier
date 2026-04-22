"""Send monthly recap emails to all active users with generations in the past month.

Run manually or via a scheduler (Railway cron, GitHub Actions, external trigger):
    cd backend && python scripts/send_monthly_recaps.py

Computes the window as the previous calendar month (not a rolling 30 days), so running
it multiple times in the same month is safe-ish (users will receive duplicate emails —
wire it to a monthly cron).
"""
import asyncio
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import select  # noqa: E402

from app.database import async_session  # noqa: E402
from app.models import Generation, User  # noqa: E402
from app.services.email_service import send_monthly_recap_email  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("monthly_recap")


FRENCH_MONTHS = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
]


def _previous_month_bounds(today: datetime) -> tuple[datetime, datetime, str]:
    """Return (start, end, label) for the calendar month before `today` (UTC)."""
    first_of_this_month = today.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0, tzinfo=timezone.utc
    )
    last_of_prev_month = first_of_this_month.replace(second=0, microsecond=0)
    prev_month = last_of_prev_month.month - 1 or 12
    prev_year = last_of_prev_month.year if last_of_prev_month.month > 1 else last_of_prev_month.year - 1
    start = last_of_prev_month.replace(year=prev_year, month=prev_month, day=1)
    label = f"{FRENCH_MONTHS[prev_month - 1]} {prev_year}"
    return start, first_of_this_month, label


async def main() -> None:
    start, end, label = _previous_month_bounds(datetime.now(tz=timezone.utc))
    logger.info("Window: %s → %s (%s)", start.isoformat(), end.isoformat(), label)

    async with async_session() as db:
        users = (await db.execute(select(User).where(User.is_active == True))).scalars().all()  # noqa: E712
        sent = 0
        skipped = 0
        for user in users:
            gens = (
                await db.execute(
                    select(Generation).where(
                        Generation.user_id == user.id,
                        Generation.created_at >= start,
                        Generation.created_at < end,
                        Generation.status == "completed",
                    )
                )
            ).scalars().all()

            if not gens:
                skipped += 1
                continue

            companies = [g.company_name for g in gens if g.company_name]
            # Dedup while preserving order
            seen = set()
            unique_companies = [c for c in companies if not (c in seen or seen.add(c))]

            try:
                send_monthly_recap_email(user.email, label, len(gens), unique_companies)
                sent += 1
            except Exception:
                logger.exception("Failed to send recap to %s", user.email)

        logger.info("Done: sent=%d skipped=%d total_users=%d", sent, skipped, len(users))


if __name__ == "__main__":
    asyncio.run(main())
