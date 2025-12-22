from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    save_to_path: str = "../processed_media"
    memories_path: str = "./memories"
    max_files_in_folder: int = 250


def get_settings():
    return Settings()
