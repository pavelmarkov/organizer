from data.data_storage import DataStorage
import os

import uvicorn
from fastapi import FastAPI, Response
from fastapi.responses import FileResponse
from urllib.parse import unquote

import asyncio

from messaging.rabbitmq_consumer import RabbitMQConsumer
from messaging.rabbitmq_producer import RabbitMQProducer

from media.preview import Preview

app = FastAPI()


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
async def get_image(path_to_file: str):
    print('path: ', path_to_file)
    preview = Preview(path_to_file)
    print(preview.file)
    print('preview: ', preview.preview_path)
    if os.path.exists(preview.preview_path):
        print('exists')
        return FileResponse(
            preview.preview_path,
            media_type="image/jpeg",
            filename=preview.file.unique_name
        )
    print('not exists')
    return Response("File not found!")


async def main():
    consumer = RabbitMQConsumer()
    await consumer.connect()

    db = DataStorage()
    media = db.get_madia()
    print(media)


if __name__ == '__main__':
    asyncio.run(main())
    uvicorn.run(app)
