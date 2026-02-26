from src.media.repository import MediaRepositoryAsync


class MediaInfo():
    info = None
    directory_id: str
    path: str

    def __init__(self, directory_id: str, path: str):

        self.directory_id = directory_id
        self.path = path

    async def get_info(self):
        media_repository = MediaRepositoryAsync()
        media = await media_repository.get_madia_by_directory_id(self.directory_id)

        if media:
            self.info = media.info
            return

        self.info = {}
