from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    app_name: str = "CV Modifier"
    debug: bool = False
    secret_key: str = "CHANGE-ME-IN-PRODUCTION"
    frontend_url: str = "http://localhost:3000"
    cors_origins: str = "http://localhost:3000"  # comma-separated list

    # Database
    database_url: str = "sqlite+aiosqlite:///./cv_modifier.db"

    # Anthropic
    anthropic_api_key: str = ""
    # Default = Sonnet 4.6 : output streaming ~2x plus rapide que Haiku 4.5
    # pour ~3x le coût/MTok output (passe de ~1.1¢ à ~3.3¢ par génération sur
    # le bloc IA, marge brute reste ~86 % sur Pro worst-case).
    claude_model: str = "claude-sonnet-4-6"
    # Output réel observé : ~1700 tokens pour le CV-only, ~600 pour la lettre.
    # 2200 laisse une marge confortable sans réserver trop de buffer.
    max_tokens: int = 2200
    # Split CV / lettre en 2 appels parallèles. Lance les deux via
    # asyncio.gather → wall time = max(cv, lettre) au lieu de cv+lettre.
    # Toggle off (AI_PARALLEL_SPLIT=false) si on observe des incohérences
    # entre les bullets CV et le contenu de la lettre.
    ai_parallel_split: bool = True

    # Storage
    storage_backend: str = "local"  # "local" or "s3"
    storage_local_dir: str = "./storage"

    # S3 / Cloudflare R2 (only if storage_backend="s3")
    s3_bucket: str = ""
    s3_endpoint_url: str = ""
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_region: str = "auto"

    # Credits
    signup_credits: int = 3
    cost_per_generation: float = 0.08

    # Email (Resend) — EMAIL_FROM must be a verified Resend sender for the cvmodifier.com domain
    resend_api_key: str = ""
    email_from: str = "CV Modifier <hello@cvmodifier.com>"

    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_starter: str = ""  # price_...
    stripe_price_pro: str = ""
    stripe_price_pack_10: str = ""
    stripe_price_pack_30: str = ""
    stripe_checkout_success_url: str = ""  # e.g. https://cvmodifier.com/dashboard/upgrade?success=true
    stripe_checkout_cancel_url: str = ""  # e.g. https://cvmodifier.com/dashboard/upgrade?cancel=true

    # Sentry (error monitoring). Leave sentry_dsn empty to disable.
    sentry_dsn: str = ""
    sentry_environment: str = ""  # e.g. "production", "development"
    sentry_traces_sample_rate: float = 0.1  # 10% perf sampling

    # PDF layout
    page_width: int = 210
    page_height: int = 297
    left_col_width: int = 65
    right_col_width: int = 135
    margin: int = 10
    left_col_color: tuple[int, int, int] = (44, 62, 80)

    @property
    def base_dir(self) -> Path:
        return Path(__file__).parent

    @property
    def fonts_dir(self) -> Path:
        return self.base_dir / "assets" / "fonts"

    @property
    def storage_path(self) -> Path:
        return Path(self.storage_local_dir)


settings = Settings()
