
import os
from typing import List
from src.data.models.clips import Clips
from src.data.repositories.clips import ClipsRepository
from src.config.files import get_settings


class ClipsService():

    def __init__(self):
        config = get_settings()
        self.memories_path = config.memories_path

    async def get_sources_by_memory_id(self, memory_id: str) -> List[Clips]:
        clips_repository = ClipsRepository()
        clips = await clips_repository.get_clips_by_memory_id(memory_id)
        return clips

    async def remove_by_memory_id(self, memory_id: str) -> List[str]:
        clips_repository = ClipsRepository()
        await clips_repository.remove_by_memory_id(memory_id)

        messages = []
        dir_path = os.path.join(self.memories_path, memory_id)
        print('dir_path: ', dir_path)

        if not os.path.isdir(dir_path):
            messages.append("Nothing to delete")
            return messages

        for entry in os.listdir(dir_path):
            os.remove(os.path.join(dir_path, entry))
            messages.append(f'Removed file {entry}')

        os.rmdir(dir_path)
        messages.append(f'Removed folder {dir_path}')

        return messages
