from datetime import datetime
import random
import os
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Response, Header

from fastapi.responses import FileResponse, JSONResponse

from src.services.media.preview import Preview
from src.services.media.info import MediaInfo

from src.dtos.memories_generator import GenerateMemoriesDto

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
