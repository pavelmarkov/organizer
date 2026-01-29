import os

CHUNK_SIZE = 149 * 1024 * 1024


class Stream():
    info = None
    directory_id: str
    file_path: str

    def __init__(self, directory_id: str, file_path: str):

        self.directory_id = directory_id
        self.file_path = file_path

    async def get_chunk(self, range: str):
        start, end = range.replace("bytes=", "").split("-")
        start = int(start)
        end = int(end) if end else start + CHUNK_SIZE
        file_size_bytes = os.path.getsize(self.file_path)
        if end >= file_size_bytes:
            end = file_size_bytes
        with open(self.file_path, "rb") as video:
            video.seek(start)
            data = video.read(end - start)
            filesize = str(file_size_bytes)
        return start, end, filesize, data
