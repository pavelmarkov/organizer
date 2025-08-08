from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    path: str = "./processed_media"


def get_settings():
    return Settings()
