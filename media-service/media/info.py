from media.process import VideoProcessor
from data.repositories.media import MediaRepository


class MediaInfo():
    info = None

    def __init__(self, directory_id: str, path: str):

        media_repository = MediaRepository()
        media = media_repository.get_madia_by_directory_id(directory_id)

        if media:
            self.info = media.info
            return

        file = VideoProcessor(path)
        file.prepare()

        self.info = file.get_media_info()
