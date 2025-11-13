
import asyncio
from media.process import VideoProcessor
import time
from data.repositories.media_async import MediaRepositoryAsync
from aio_pika.abc import AbstractIncomingMessage

from pydantic import BaseModel, Field

from logger.log import logger

from prometheus_client import Histogram

custom_buckets = (0.125, 0.225,
                  0.325, 0.525,
                  1.125, 1.525,
                  2.125, 2.525,
                  3.125, 3.525,
                  float("inf"))
MEDIA_PROCESSING_DURATION_SECONDS = Histogram(
    'media_processing_duration_seconds',
    'Time spent procession media',
    buckets=custom_buckets
)


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
        logger.info(f"Message redelivered {incoming_message.message_id}")

    parsedMessage = parseDirectoryMessageBody(incoming_message.body.decode())

    logger.info(f"Pattern: {parsedMessage.pattern}; Id: {parsedMessage.id};")

    directory_id = parsedMessage.data.directory[0].directory_id
    path = parsedMessage.data.directory[0].path

    logger.info(f"Path {path}; directoryId: {directory_id}")

    media_repository = MediaRepositoryAsync()

    media = await media_repository.get_madia_by_directory_id(directory_id)

    if media:
        logger.info('Media exists, skipping')
        await incoming_message.ack()
        return

    start_time = time.process_time()
    videoProcessor = VideoProcessor(path)
    await asyncio.to_thread(process_video, videoProcessor)

    elapsed_time = time.process_time() - start_time
    logger.info(f"total time processing video: {elapsed_time};")
    MEDIA_PROCESSING_DURATION_SECONDS.observe(elapsed_time)

    info = await videoProcessor.get_media_info()

    await media_repository.upsert_many([{
        'directory_id': directory_id,
        'preview_path': videoProcessor.full_preview_path,
        'info': info
    }])

    logger.info(f"sending ack, delivery tag: {incoming_message.delivery_tag}")
    await incoming_message.ack()
    return
