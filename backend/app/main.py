from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.router import api_router
from app.config import settings
from app.core.limiter import limiter
from app.database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Fail-closed on weak/default secret — prevents prod from starting with CHANGE-ME.
    if (
        settings.secret_key == "CHANGE-ME-IN-PRODUCTION"
        or len(settings.secret_key) < 32
    ):
        raise RuntimeError(
            "SECRET_KEY manquante ou trop courte. "
            "Définissez SECRET_KEY (≥32 caractères) dans les variables d'environnement."
        )
    # Startup: create tables (dev only, use Alembic in prod)
    await create_tables()
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

# CORS
origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://cv-modifier(-[a-z0-9]+)*-0xcsshs-projects\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(api_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
