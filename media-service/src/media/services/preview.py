import os

from fastapi import UploadFile

from src.media.repository import MediaRepositoryAsync
from src.media.schemas import UpsertMediaEntityDto
from src.media.utils.alloc_subfolder import alloc_subfolder
from src.config import get_settings

from src.logger.log import logger


def is_image(full_path: str):
    return full_path.endswith('.jpg') \
        or full_path.endswith('.jpeg') \
        or full_path.endswith('.png') \
        or full_path.endswith('.heic')


class Preview():
    directory_id: str
    path: str
    unique_name = None
    preview_path = None

    def __init__(self, directory_id: str, path: str):
        config = get_settings()
        self.save_to_path = config.save_to_path
        self.max_files_in_folder = config.max_files_in_folder
        self.directory_id = directory_id
        self.path = path

    async def get_preview(self):
        media_repository = MediaRepositoryAsync()
        media = await media_repository.get_madia_by_directory_id(self.directory_id)
        if media:
            self.preview_path = media.preview_path
            if media.info is not None:
                self.unique_name = media.info['unique_name']
            return

        if is_image(self.path):
            self.preview_path = self.path
            return

        self.preview_path = None
        self.unique_name = None

    async def add_preview(self, uploaded_file: UploadFile):
        media_repository = MediaRepositoryAsync()
        messages = []

        media = await media_repository.get_madia_by_directory_id(self.directory_id)
        if media:
            os.remove(media.preview_path)
            messages.append(f'Removed file {media.preview_path}')
            await media_repository.remove_by_directory_id(self.directory_id)
            messages.append(f'Removed row {media.media_id}')

        subfolder = alloc_subfolder(
            self.save_to_path, self.max_files_in_folder)

        _, file_extension = os.path.splitext(uploaded_file.filename)
        new_file_name = f"{self.directory_id}{file_extension}"
        full_preview_path = os.path.join(
            self.save_to_path, subfolder, new_file_name
        )

        with open(full_preview_path, "wb+") as file_object:
            file_object.write(uploaded_file.file.read())

        new_media = UpsertMediaEntityDto(
            directory_id=self.directory_id,
            preview_path=full_preview_path,
            info=None,
        )
        await media_repository.upsert_many([new_media])

        for message in messages:
            logger.info(message)
