from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.router import api_router
from app.config import settings
from app.core.limiter import limiter
from app.database import create_tables

# Sentry init must run before `app = FastAPI(...)` so the integrations can
# wrap FastAPI/Starlette's ASGI lifecycle correctly. No-op when DSN is empty.
if settings.sentry_dsn:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.sentry_environment
        or ("production" if not settings.debug else "development"),
        traces_sample_rate=settings.sentry_traces_sample_rate,
        send_default_pii=False,  # RGPD: don't send email/IP by default
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
    )

# Methods that should be CSRF-checked. Safe methods (GET/HEAD/OPTIONS/TRACE)
# are skipped since they are not supposed to mutate state and CORS preflight
# (OPTIONS) must be allowed through.
_CSRF_PROTECTED_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
# Endpoints exempt from the X-Requested-With requirement. We keep the list
# intentionally tiny — only the liveness probe. All auth flows (login,
# register, forgot/reset password) go through our own fetch()-based frontend
# which attaches the header, and no legitimate third party should be posting
# to them with user cookies attached.
_CSRF_EXEMPT_PATHS = {"/health"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    import logging as _logging
    _log = _logging.getLogger("app.startup")
    _log.info("Startup: checking SECRET_KEY")
    if (
        settings.secret_key == "CHANGE-ME-IN-PRODUCTION"
        or len(settings.secret_key) < 32
    ):
        raise RuntimeError(
            "SECRET_KEY manquante ou trop courte. "
            "Définissez SECRET_KEY (≥32 caractères) dans les variables d'environnement."
        )
    _log.info("Startup: running create_tables()")
    await create_tables()
    _log.info("Startup: complete, accepting traffic")
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CSRF protection: since cookies are SameSite=None in prod (required for
# cross-origin Vercel <-> Railway), we rely on a custom-header check to
# block CSRF. A cross-site attacker cannot set a custom header on a
# cross-origin request without a CORS preflight, and our CORS regex only
# whitelists our own Vercel origins, so malicious preflights are rejected.
#
# NOTE on middleware ordering: Starlette applies middleware in reverse order
# of add_middleware() calls — the LAST added wraps the OUTERMOST. We want
# CORS to be the OUTERMOST (handles preflight OPTIONS before anything else),
# so CORS must be added AFTER the CSRF middleware below.
@app.middleware("http")
async def csrf_protect(request: Request, call_next):
    if (
        request.method in _CSRF_PROTECTED_METHODS
        and request.url.path not in _CSRF_EXEMPT_PATHS
    ):
        if request.headers.get("x-requested-with", "").lower() != "xmlhttprequest":
            return JSONResponse(
                status_code=403,
                content={
                    "detail": "CSRF protection: missing X-Requested-With header"
                },
            )
    return await call_next(request)


# CORS (added LAST so it wraps the CSRF middleware — preflight OPTIONS never
# reach the CSRF check).
origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://(cv-modifier(-[a-z0-9]+)*-0xcsshs-projects\.vercel\.app|(www\.)?cvmodifier\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(api_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
