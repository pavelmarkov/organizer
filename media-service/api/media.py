
import json
import os

from fastapi import APIRouter

from fastapi import Response
from fastapi.responses import FileResponse, JSONResponse

from media.preview import Preview
from media.info import MediaInfo

from messaging.rabbitmq_producer import RabbitMQProducer

router = APIRouter()


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
        return Response("File not found!")

    if os.path.exists(preview.preview_path):
        return FileResponse(
            preview.preview_path,
            media_type="image/jpeg",
            filename=preview.unique_name
        )

    return Response("File not found!")


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

    return JSONResponse({"info": media.info})


@router.get("/")
async def read_root():
    producer = RabbitMQProducer()
    producer.send_message()
    return {"message": "Hello, World!"}
