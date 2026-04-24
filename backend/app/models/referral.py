import secrets
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


# Alphabet without lookalikes (0/O, 1/I/l) so codes are readable over the phone.
_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
_CODE_LEN = 6


def generate_referral_code() -> str:
    """Short, readable code. Collisions handled by the DB UNIQUE + retry."""
    return "".join(secrets.choice(_CODE_ALPHABET) for _ in range(_CODE_LEN))


class Referral(Base):
    """Tracks one "referee signed up via referrer" event.

    A referee may appear only once (UNIQUE constraint). Rewards are granted
    idempotently via the `*_granted_at` timestamps — NULL means not yet granted.
    """

    __tablename__ = "referrals"
    __table_args__ = (UniqueConstraint("referee_id", name="uq_referrals_referee"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    referrer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    referee_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    code_used: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    # Referee bonus (+1 credit) granted at signup.
    referee_bonus_granted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    # Referrer reward (+3 credits) granted after referee's first successful generation.
    referrer_reward_granted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
