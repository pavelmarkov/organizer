from datetime import datetime
from typing import Annotated, List, Optional

from fastapi import APIRouter, Response, Header

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from src.clips.services.service import ClipsService


from src.clips.schemas import PatchClipsEntityDto, DeleteClipsEntityDto

router = APIRouter(prefix="/clips", tags=["Clips"])


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
