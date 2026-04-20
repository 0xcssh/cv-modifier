from fastapi import APIRouter, Depends

from app.core.security import auth_backend, current_active_user, fastapi_users
from app.models.user import User
from app.schemas.auth import UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])

router.include_router(fastapi_users.get_auth_router(auth_backend))
router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))
router.include_router(fastapi_users.get_reset_password_router())
router.include_router(fastapi_users.get_verify_router(UserRead))


@router.get("/me", response_model=UserRead)
async def get_me(user: User = Depends(current_active_user)):
    return user
