from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    save_to_path: str = "./processed_media"


def get_settings():
    return Settings()
