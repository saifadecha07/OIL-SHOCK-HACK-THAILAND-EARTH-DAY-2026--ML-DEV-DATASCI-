from functools import lru_cache
from typing import Any

from pydantic import AnyHttpUrl, Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "SHOCKWAVE Backend"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False
    allow_mock_model: bool = Field(True, alias="ALLOW_MOCK_MODEL")

    postgres_server: str = Field("localhost", alias="POSTGRES_SERVER")
    postgres_port: int = Field(5432, alias="POSTGRES_PORT")
    postgres_user: str = Field("postgres", alias="POSTGRES_USER")
    postgres_password: str = Field("postgres", alias="POSTGRES_PASSWORD")
    postgres_db: str = Field("shockwave", alias="POSTGRES_DB")

    backend_cors_origins: list[AnyHttpUrl] | list[str] = Field(
        default_factory=list,
        alias="BACKEND_CORS_ORIGINS",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        populate_by_name=True,
    )

    @computed_field
    @property
    def sqlalchemy_database_uri(self) -> str:
        return (
            "postgresql+asyncpg://"
            f"{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_server}:{self.postgres_port}/{self.postgres_db}"
        )

    @computed_field
    @property
    def safe_cors_origins(self) -> list[str]:
        return [str(origin) for origin in self.backend_cors_origins if str(origin).strip() != "*"]

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: Any,
        env_settings: Any,
        dotenv_settings: Any,
        file_secret_settings: Any,
    ) -> tuple[Any, ...]:
        return init_settings, env_settings, dotenv_settings, file_secret_settings


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
