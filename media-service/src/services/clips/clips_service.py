
import os
from typing import List
import uuid
from src.data.models.clips import Clips
from src.data.repositories.clips import ClipsRepository
from src.config.files import get_settings
from src.dtos.clips_entity import PatchClipsEntityDto, ClipsFilterSchema


class ClipsService():

    def __init__(self):
        config = get_settings()
        self.memories_path = config.memories_path

    async def get_sources_by_memory_id(self, memory_id: str) -> List[Clips]:
        clips_repository = ClipsRepository()
        filter = ClipsFilterSchema(
            memory_id=memory_id).model_dump(include={'memory_id'})
        clips = await clips_repository.find(filter)
        return clips

    async def patch(self, clips: List[PatchClipsEntityDto]):
        clips_repository = ClipsRepository()
        for clip in clips:
            clip_id = clip.id
            update_values = clip.model_dump()
            await clips_repository.update({'id': clip_id}, update_values)

    async def remove(self, clip_ids: List[str]) -> List[Clips]:
        removed_clips: List[Clips] = []
        for clip_id in clip_ids:
            removed_clip = await self.remove_by_clip_id(clip_id)
            removed_clips.append(removed_clip)

    async def remove_by_clip_id(self, clip_id: str) -> Clips:

        clips_repository = ClipsRepository()
        filter = ClipsFilterSchema(id=clip_id).model_dump(include={'id'})
        clips = await clips_repository.find(filter)

        if len(clips) < 1:
            return []

        clip = clips[0]

        messages = []

        os.remove(clip.path)
        messages.append(f'Removed file {clip.path}')

        await clips_repository.remove(filter)
        messages.append(f'Removed row {clip.id}')

        return clip

    async def remove_by_memory_id(self, memory_id: str) -> List[str]:
        clips_repository = ClipsRepository()
        filter = ClipsFilterSchema(
            memory_id=memory_id).model_dump(include={'memory_id'})
        await clips_repository.remove(filter)

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
