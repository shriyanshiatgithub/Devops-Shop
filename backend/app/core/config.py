from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://ecom_user:ecom_pass@localhost:5432/ecom_db"
    REDIS_URL: str = "redis://localhost:6379"
    SECRET_KEY: str = "changeme-use-a-real-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
