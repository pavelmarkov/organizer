from datetime import datetime
import random
import os
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Response, Header

from fastapi.responses import FileResponse, JSONResponse

from src.media.preview import Preview
from src.media.info import MediaInfo
from src.media.stream import Stream
from src.media.memories_generator import MemoriesGenerator

from src.messaging.rabbitmq_producer import RabbitMQProducer

from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/media", tags=["Media"])


@router.get(
    "/preview",
    responses={
        200: {
            "content": {"image/png": {}}
        }
    },
    response_class=FileResponse
)
async def get_image(
    directory_id: str,
    path_to_file: str
):
    preview = Preview(directory_id, path_to_file)
    await preview.get_preview()

    if not preview.preview_path:
        raise HTTPException(status_code=404, detail="File not found!")

    if os.path.exists(preview.preview_path):
        return FileResponse(
            preview.preview_path,
            media_type="image/jpeg",
            filename=preview.unique_name
        )

    raise HTTPException(status_code=404, detail="File not found!")


@router.get(
    "/info",
    response_class=JSONResponse
)
async def get_info(
    directory_id: str,
    path_to_file: str
):
    media = MediaInfo(directory_id, path_to_file)
    await media.get_info()

    if not media.info:
        return JSONResponse({"error": True})

    return JSONResponse({"info": jsonable_encoder(media.info)})


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


@router.get("/sources")
async def video_endpoint() -> List[str]:
    memories = MemoriesGenerator([])
    sources = memories.get_memory_sources()
    return JSONResponse(sources)
