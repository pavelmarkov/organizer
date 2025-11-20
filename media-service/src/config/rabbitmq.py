from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    host: str = Field(alias="RABBIT_MQ_HOST", default="localhost")
    port: int = 5672
    user: str = "guest"
    password: str = "guest"
    queue: str = "media_queue"


def get_settings():
    return Settings()
