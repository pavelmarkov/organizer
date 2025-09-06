from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    save_to_path: str = "./processed_media"
    max_files_in_folder: int = 250


def get_settings():
    return Settings()
