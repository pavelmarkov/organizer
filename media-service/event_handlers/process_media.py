
import asyncio
from media.process import VideoProcessor
import time
from data.repositories.media_async import MediaRepositoryAsync
from aio_pika.abc import AbstractIncomingMessage

from pydantic import BaseModel, Field


class DirectoryEntityModel(BaseModel):
    directory_id: str = Field(alias='directoryId')
    path: str = Field(alias='path')


class DirectoryMessageModel(BaseModel):
    directory: list[DirectoryEntityModel]


class ProcessMediaMessageBody(BaseModel):
    id: str
    pattern: str
    data: DirectoryMessageModel


def parseDirectoryMessageBody(message: str) -> ProcessMediaMessageBody:
    return ProcessMediaMessageBody.model_validate_json(message)


def process_video(processor: VideoProcessor):
    processor.prepare()
    processor.process_video_file()


async def on_process_media_message_received(
    incoming_message: AbstractIncomingMessage
):
    if incoming_message.redelivered:
        print(f" [x] Message redelivered {incoming_message.message_id}")

    parsedMessage = parseDirectoryMessageBody(incoming_message.body.decode())

    print('\n')
    print(f" [x] Received: ")
    print(f" [x] Pattern: {parsedMessage.pattern}; Id: {parsedMessage.id};")

    directory_id = parsedMessage.data.directory[0].directory_id
    path = parsedMessage.data.directory[0].path

    print(f" [x] Path {path}")

    media_repository = MediaRepositoryAsync()

    media = await media_repository.get_madia_by_directory_id(directory_id)

    if media:
        print('media exists, skipping')
        await incoming_message.ack()
        print('incoming_message.ack()')
        return

    start_time = time.process_time()
    videoProcessor = VideoProcessor(path)
    await asyncio.to_thread(process_video, videoProcessor)

    elapsed_time = time.process_time() - start_time
    print('total time processing video: ', elapsed_time)
    if (elapsed_time > 60):
        print('processing time too large')

    info = await videoProcessor.get_media_info()

    await media_repository.upsert_many([{
        'directory_id': directory_id,
        'preview_path': videoProcessor.full_preview_path,
        'info': info
    }])

    print('sending ack, delivery tag: ', incoming_message.delivery_tag)
    await incoming_message.ack()
    print('ack send')
    return
