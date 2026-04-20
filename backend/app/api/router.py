from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.profiles import router as profiles_router
from app.api.generations import router as generations_router

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(profiles_router)
api_router.include_router(generations_router)
