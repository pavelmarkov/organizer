from datetime import datetime
from typing import Annotated, List, Optional

from fastapi import APIRouter, Response, Header

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from src.services.stream.stream_service import Stream
from src.services.clips.memories_generator import MemoriesGenerator

from src.dtos.memories_generator import GenerateMemoriesDto

from src.services.clips.clips_service import ClipsService

from src.data.models.clips import Clips

from src.dtos.clips_entity import PatchClipsEntityDto, DeleteClipsEntityDto

router = APIRouter(prefix="/clips", tags=["Clips"])


@router.get("/stream")
async def video_endpoint(
    path_to_file: str,
    directory_id: Optional[str],
    range: str = Header(None)
):
    print(path_to_file)

    stream = Stream(None, path_to_file)
    start, end, filesize, data = await stream.get_chunk(range)
    print(start, end, filesize)

    print(start, end, filesize)

    headers = {
        'Content-Range': f'bytes {str(start)}-{str(end - 1)}/{filesize}',
        'Content-Length': f'{end - start}',
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4'
    }
    return Response(data, status_code=206, headers=headers, media_type="video/mp4")


@router.get("/")
async def video_endpoint(
    memory_id: str,
) -> Response:
    clips = ClipsService()
    sources = await clips.get_sources_by_memory_id(memory_id)
    print(sources)
    return JSONResponse(jsonable_encoder(sources))


@router.delete("/")
async def video_endpoint(
    memory_id: str | None = None,
    body: DeleteClipsEntityDto | None = None,
) -> List[str]:
    # return JSONResponse([])
    clips = ClipsService()
    messages = []
    if memory_id:
        messages = await clips.remove_by_memory_id(memory_id)
    if body:
        messages = await clips.remove(body.clip_ids)
    return JSONResponse(messages)


@router.patch("/")
async def video_endpoint(
    clips: List[PatchClipsEntityDto],
) -> List[PatchClipsEntityDto]:
    messages = []
    clips_service = ClipsService()
    await clips_service.patch(clips)
    print('messages: ', clips)
    return JSONResponse(messages)
