from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Literal

class Settings(BaseSettings):
    # App
    APP_NAME: str = "OMNI Risk Intelligence Engine"
    APP_VERSION: str = "1.0.0"
    ENV: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://omni:omni@localhost:5432/omni_risk"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10

    # Auth
    SECRET_KEY: str = "change-in-production-32-char-min"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8
    ALGORITHM: str = "HS256"

    # HFER-720 Model
    MODEL_ENSEMBLE_ML_WEIGHT: float = 0.6
    MODEL_ENSEMBLE_CLASSICAL_WEIGHT: float = 0.4
    MODEL_CONFIDENCE_THRESHOLD: float = 0.65

    # External APIs
    KOERI_API_URL: str = "http://udim.koeri.boun.edu.tr"
    MGM_API_URL: str = "https://api.mgm.gov.tr"
    AFAD_API_URL: str = "https://deprem.afad.gov.tr/api/v2"

    # Risk Classification Thresholds
    RISK_CRITICAL_THRESHOLD: int = 40
    RISK_HIGH_THRESHOLD: int = 60
    RISK_MEDIUM_THRESHOLD: int = 75
    RISK_RESILIENT_THRESHOLD: int = 90

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
