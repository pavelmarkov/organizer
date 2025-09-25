import json
from data.data_storage import DataStorage
import os

import uvicorn
from fastapi import FastAPI, Response
from fastapi.responses import FileResponse, JSONResponse

import asyncio

from messaging.rabbitmq_consumer import RabbitMQConsumer
# from messaging.rabbitmq_producer import RabbitMQProducer

from media.preview import Preview
from media.info import MediaInfo


from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await asyncio.sleep(3)
    loop = asyncio.get_running_loop()
    consumer = RabbitMQConsumer()
    task = loop.create_task(consumer.connect(loop))
    await task
    yield
    await consumer.close()

app = FastAPI(lifespan=lifespan)

# @app.get("/")
# async def read_root():
#     producer = RabbitMQProducer()
#     producer.send_message()
#     return {"message": "Hello, World!"}


@app.get(
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

    if not preview.preview_path:
        return Response("File not found!")

    if os.path.exists(preview.preview_path):
        return FileResponse(
            preview.preview_path,
            media_type="image/jpeg",
            filename=preview.unique_name
        )

    return Response("File not found!")


@app.get(
    "/info",
    response_class=JSONResponse
)
async def get_info(
    directory_id: str,
    path_to_file: str
):
    media = MediaInfo(directory_id, path_to_file)

    if not media.info:
        return JSONResponse({"error": True})

    return JSONResponse({"info": media.info})


def main():

    # uvicorn.run(app)

    db = DataStorage()
    db.run_migrations()


if __name__ == '__main__':
    main()
