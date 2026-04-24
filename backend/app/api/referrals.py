from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security import current_active_user
from app.database import get_db
from app.models import User
from app.models.referral import generate_referral_code
from app.schemas.referral import ReferralInfo, ReferralStats
from app.services.referrals import (
    REFEREE_SIGNUP_BONUS,
    REFERRER_REWARD,
    get_referral_stats,
)

router = APIRouter(prefix="/referrals", tags=["referrals"])


@router.get("/me", response_model=ReferralInfo)
async def get_my_referral_info(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the current user's referral code + share URL + aggregate stats.

    The code is lazily generated if missing (handles legacy users who were
    created before the backfill ran, though the startup backfill covers them).
    """
    if not user.referral_code:
        for _ in range(5):
            try:
                user.referral_code = generate_referral_code()
                db.add(user)
                await db.commit()
                break
            except Exception as exc:
                await db.rollback()
                if "unique" in str(exc).lower() or "duplicate" in str(exc).lower():
                    continue
                raise HTTPException(500, "Impossible de générer un code de parrainage.")

    stats = await get_referral_stats(db, user.id)
    base_url = settings.frontend_url.rstrip("/")
    share_url = f"{base_url}/register?ref={user.referral_code}"

    return ReferralInfo(
        code=user.referral_code,
        share_url=share_url,
        reward_referrer=REFERRER_REWARD,
        reward_referee=REFEREE_SIGNUP_BONUS,
        stats=ReferralStats(**stats),
    )
