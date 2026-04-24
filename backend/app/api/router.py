from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.profiles import router as profiles_router
from app.api.generations import router as generations_router
from app.api.billing import router as billing_router
from app.api.referrals import router as referrals_router

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(profiles_router)
api_router.include_router(generations_router)
api_router.include_router(billing_router)
api_router.include_router(referrals_router)
