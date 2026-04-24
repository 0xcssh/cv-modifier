from pydantic import BaseModel


class ReferralStats(BaseModel):
    total_referred: int
    pending: int
    rewarded: int
    credits_earned: int


class ReferralInfo(BaseModel):
    code: str
    share_url: str
    reward_referrer: int
    reward_referee: int
    stats: ReferralStats
