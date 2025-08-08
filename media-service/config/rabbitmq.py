from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    host: str = "localhost"
    port: int = 5672
    user: str = "guest"
    password: str = "guest"
    queue: str = "media_queue"


def get_settings():
    return Settings()
