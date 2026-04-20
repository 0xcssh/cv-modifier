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

    # Database
    database_url: str = "sqlite+aiosqlite:///./cv_modifier.db"

    # Anthropic
    anthropic_api_key: str = ""
    claude_model: str = "claude-sonnet-4-20250514"
    max_tokens: int = 6000

    # Storage
    storage_backend: str = "local"  # "local" or "s3"
    storage_local_dir: str = "./storage"

    # Credits
    signup_credits: int = 3
    cost_per_generation: float = 0.08

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
