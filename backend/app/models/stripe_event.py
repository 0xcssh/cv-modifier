from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class StripeEvent(Base):
    """Stores processed Stripe webhook event IDs for idempotency.

    Stripe retries webhooks for up to 3 days on non-2xx responses, so we
    record every event we've successfully processed and short-circuit on
    repeats.
    """

    __tablename__ = "stripe_events"

    event_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    type: Mapped[str] = mapped_column(String(80))
    processed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
