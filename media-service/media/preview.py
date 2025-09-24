from media.process import VideoProcessor
from data.data_storage import MediaRepository


class Preview():
    unique_name = None
    preview_path = None

    def __init__(self, directory_id: str, path: str):

        media_repository = MediaRepository()
        media = media_repository.get_madia_by_directory_id(directory_id)
        print(media)
        if media:
            self.preview_path = media.preview_path
            self.unique_name = media.info['unique_name']
            return

        file = VideoProcessor(path)
        file.prepare()

        self.preview_path = file.findExisting(
            file.save_to_path, file.unique_name
        )
        self.unique_name = file.unique_name
