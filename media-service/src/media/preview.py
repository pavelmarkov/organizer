from src.media.process import VideoProcessor
from src.data.repositories.media_async import MediaRepositoryAsync


class Preview():
    directory_id: str
    path: str
    unique_name = None
    preview_path = None

    def __init__(self, directory_id: str, path: str):
        self.directory_id = directory_id
        self.path = path

    async def get_preview(self):
        media_repository = MediaRepositoryAsync()
        media = await media_repository.get_madia_by_directory_id(self.directory_id)
        if media:
            self.preview_path = media.preview_path
            self.unique_name = media.info['unique_name']
            return

        file = VideoProcessor(self.path)
        file.prepare()

        self.preview_path = None
        self.unique_name = file.unique_name
