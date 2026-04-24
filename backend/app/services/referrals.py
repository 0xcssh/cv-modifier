"""Referral program business logic.

Two flows:
1. At signup via `?ref=CODE`: create a `Referral` row linking referee→referrer,
   grant the referee +1 bonus credit (on top of the default 3).
2. After the referee's first successful generation: grant the referrer +3
   credits. Idempotent via `referrer_reward_granted_at`.
"""

from __future__ import annotations

import logging
import uuid

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session
from app.models import CreditTransaction, Referral, User

logger = logging.getLogger(__name__)

REFEREE_SIGNUP_BONUS = 1   # credits added to the referee at signup
REFERRER_REWARD = 3        # credits added to the referrer on referee's first gen


async def consume_referral_code(referee: User, ref_code: str) -> None:
    """Called from UserManager.on_after_register when signup URL has ?ref=XXX.

    - Resolves the code to a referrer.
    - Blocks self-referral.
    - Creates a `Referral` row.
    - Grants +REFEREE_SIGNUP_BONUS credits to the referee.

    All failures are logged + swallowed by the caller so a bad code never
    blocks signup.
    """
    code = ref_code.strip().upper()
    if not code:
        return

    async with async_session() as db:
        result = await db.execute(
            select(User).where(User.referral_code == code)
        )
        referrer = result.scalar_one_or_none()
        if referrer is None:
            logger.info("Referral code %s: unknown, ignoring", code)
            return
        if referrer.id == referee.id:
            # Self-referral blocked (shouldn't happen — the referee just got
            # their code in the same request — but defense in depth).
            logger.info("Referral code %s: self-referral blocked", code)
            return

        # UNIQUE(referee_id) guarantees one-referral-per-referee. If the row
        # already exists (shouldn't, brand-new user) we bail out.
        existing = await db.execute(
            select(Referral).where(Referral.referee_id == referee.id)
        )
        if existing.scalar_one_or_none() is not None:
            return

        referral = Referral(
            referrer_id=referrer.id,
            referee_id=referee.id,
            code_used=code,
        )
        db.add(referral)

        # Grant the referee bonus atomically.
        await db.execute(
            update(User)
            .where(User.id == referee.id)
            .values(credits=User.credits + REFEREE_SIGNUP_BONUS)
        )
        db.add(
            CreditTransaction(
                user_id=referee.id,
                amount=REFEREE_SIGNUP_BONUS,
                reason="referral_signup_bonus",
            )
        )
        referral.referee_bonus_granted_at = _now()

        await db.commit()
        logger.info(
            "Referral %s consumed: referrer=%s referee=%s",
            code,
            referrer.id,
            referee.id,
        )


async def maybe_grant_referrer_reward(
    db: AsyncSession, referee_user_id: uuid.UUID
) -> None:
    """Called at the end of a successful generation pipeline.

    Idempotent — `referrer_reward_granted_at IS NULL` is the gate.
    Requires referee to be `is_verified`; in practice they must be because
    POST /generations requires a verified user, but we double-check.
    """
    result = await db.execute(
        select(Referral).where(
            Referral.referee_id == referee_user_id,
            Referral.referrer_reward_granted_at.is_(None),
        )
    )
    referral = result.scalar_one_or_none()
    if referral is None:
        return

    referee = await db.get(User, referee_user_id)
    if referee is None or not referee.is_verified:
        logger.info(
            "Referral reward skipped (referee not verified) referee=%s",
            referee_user_id,
        )
        return

    # Atomic: set granted timestamp first; if two concurrent generations race,
    # only one UPDATE will observe a NULL and do the credit bump.
    claim = await db.execute(
        update(Referral)
        .where(
            Referral.id == referral.id,
            Referral.referrer_reward_granted_at.is_(None),
        )
        .values(referrer_reward_granted_at=_now())
        .returning(Referral.id)
    )
    if claim.first() is None:
        return  # already granted by a concurrent request

    await db.execute(
        update(User)
        .where(User.id == referral.referrer_id)
        .values(credits=User.credits + REFERRER_REWARD)
    )
    db.add(
        CreditTransaction(
            user_id=referral.referrer_id,
            amount=REFERRER_REWARD,
            reason="referral_reward",
        )
    )
    await db.commit()
    logger.info(
        "Referrer reward granted: referrer=%s referee=%s +%d credits",
        referral.referrer_id,
        referee_user_id,
        REFERRER_REWARD,
    )

    # Best-effort notification email for the referrer.
    try:
        referrer = await db.get(User, referral.referrer_id)
        if referrer is not None:
            from app.services.email_service import send_referral_reward_email
            send_referral_reward_email(referrer.email, REFERRER_REWARD)
    except Exception:
        logger.exception(
            "Failed to send referral_reward email for referrer=%s",
            referral.referrer_id,
        )


async def get_referral_stats(db: AsyncSession, user_id: uuid.UUID) -> dict:
    """Aggregate counts for the /api/referrals/me dashboard card."""
    result = await db.execute(
        select(Referral).where(Referral.referrer_id == user_id)
    )
    rows = result.scalars().all()
    total = len(rows)
    rewarded = sum(1 for r in rows if r.referrer_reward_granted_at is not None)
    pending = total - rewarded
    return {
        "total_referred": total,
        "pending": pending,
        "rewarded": rewarded,
        "credits_earned": rewarded * REFERRER_REWARD,
    }


def _now():
    from datetime import datetime, timezone
    return datetime.now(timezone.utc)
