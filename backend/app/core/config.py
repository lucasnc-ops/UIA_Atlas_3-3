from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RECAPTCHA_SECRET_KEY: str

    # Email
    SMTP_HOST: str
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str = "Atlas 3+3"

    # Admin
    ADMIN_EMAIL: str

    # Frontend
    FRONTEND_URL: str

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"
    # Optional: Regex pattern for allowed origins (e.g., for Vercel preview deployments)
    # Example: r"https://.*\.vercel\.app"
    CORS_ORIGIN_REGEX: str = ""

    # Environment
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()