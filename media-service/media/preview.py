from media.process import VideoProcessor


class Preview():
    file = None
    preview_path = None

    def __init__(self, path):
        self.file = VideoProcessor(path)
        self.file.prepare()
        self.preview_path = self.file.findExisting(
            self.file.save_to_path, self.file.unique_name
        )
