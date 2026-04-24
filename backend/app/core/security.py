import uuid

from fastapi import Depends
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User


async def get_user_db(session: AsyncSession = Depends(get_db)):
    yield SQLAlchemyUserDatabase(session, User)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.secret_key
    verification_token_secret = settings.secret_key

    async def on_after_register(self, user: User, request=None):
        # Populate the referral code for the new user. Retry on the tiny chance
        # of a UNIQUE collision (alphabet^6 = ~1B).
        from app.models.referral import generate_referral_code
        from app.services.referrals import consume_referral_code

        for _ in range(5):
            try:
                user.referral_code = generate_referral_code()
                await self.user_db.update(user, {"referral_code": user.referral_code})
                break
            except Exception as exc:
                msg = str(exc).lower()
                if "unique" in msg or "duplicate" in msg:
                    continue
                import logging
                logging.getLogger(__name__).exception(
                    "Failed to assign referral_code to %s", user.email
                )
                break

        # If the registration request came with ?ref=XXX, create the Referral
        # record and grant the referee +1 bonus credit. Failures are swallowed
        # so a bad code never blocks signup.
        if request is not None:
            ref_code = request.query_params.get("ref")
            if ref_code:
                try:
                    await consume_referral_code(user, ref_code)
                except Exception:
                    import logging
                    logging.getLogger(__name__).exception(
                        "Failed to consume referral code %s for %s",
                        ref_code,
                        user.email,
                    )

        from app.services.email_service import send_welcome_email
        send_welcome_email(user.email)
        # Trigger the verification email flow so the user can activate their account
        # before consuming credit-costing endpoints (required by current_verified_user).
        try:
            await self.request_verify(user, request)
        except Exception:
            import logging
            logging.getLogger(__name__).exception(
                "Failed to request verification for user %s", user.email
            )

    async def on_after_forgot_password(self, user: User, token: str, request=None):
        from app.services.email_service import send_reset_password_email
        send_reset_password_email(user.email, token)

    async def on_after_reset_password(self, user: User, request=None):
        from app.services.email_service import send_password_changed_email
        send_password_changed_email(user.email)

    async def on_after_request_verify(self, user: User, token: str, request=None):
        from app.services.email_service import send_verification_email
        send_verification_email(user.email, token)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


# JWT auth via httpOnly cookie.
# Requests are same-origin in both environments: in prod the browser hits
# cvmodifier.com and Vercel rewrites /api/* to Railway (the browser never sees
# the Railway hostname); in dev the frontend calls localhost:8000 directly
# but we only need to survive the Lax same-site default. So SameSite=Lax is
# correct everywhere, and dropping SameSite=None also means Safari ITP and
# Chrome iOS no longer treat the cookie as third-party.
# CSRF is mitigated separately by the X-Requested-With header check in
# main.py (enforced via our locked-down CORS allow_origin_regex).
_is_prod = not settings.debug

cookie_transport = CookieTransport(
    cookie_name="cv_modifier_auth",
    cookie_max_age=60 * 60 * 24,  # 24h
    cookie_secure=_is_prod,
    cookie_httponly=True,
    cookie_samesite="lax",
    cookie_domain=None,
)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.secret_key, lifetime_seconds=3600 * 24)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)
current_verified_user = fastapi_users.current_user(active=True, verified=True)
