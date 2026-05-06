from datetime import datetime
import os
from typing import Optional

from fastapi import APIRouter, HTTPException, Response, Header

from src.stream.service import Stream

router = APIRouter(prefix="/stream", tags=["Stream"])


@router.get("/")
async def video_endpoint(
    path_to_file: str,
    directory_id: Optional[str],
    range: str = Header(None)
):
    print(path_to_file)

    if not os.path.isfile(path_to_file):
        raise HTTPException(status_code=404, detail="Item not found")

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
