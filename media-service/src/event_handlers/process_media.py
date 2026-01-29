
import asyncio
from src.services.media.process import VideoProcessor
import time
from src.data.repositories.media_async import MediaRepositoryAsync
from aio_pika.abc import AbstractIncomingMessage

from src.logger.log import logger

from src.dtos.media_processing import ProcessMediaMessageBodyDto
from src.dtos.media_entity import UpsertMediaEntityDto

from src.metrics import MEDIA_PROCESSING_DURATION_SECONDS


def parseDirectoryMessageBody(message: str) -> ProcessMediaMessageBodyDto:
    return ProcessMediaMessageBodyDto.model_validate_json(message)


def process_video(processor: VideoProcessor):
    processor.prepare()
    processor.process_video_file()


async def on_process_media_message_received(
    incoming_message: AbstractIncomingMessage
):
    if incoming_message.redelivered:
        logger.debug(f"Message redelivered {incoming_message.message_id}")

    parsedMessage = parseDirectoryMessageBody(incoming_message.body.decode())

    logger.debug(f"Pattern: {parsedMessage.pattern}; Id: {parsedMessage.id};")

    directory_id = parsedMessage.data.directory[0].directory_id
    path = parsedMessage.data.directory[0].path

    logger.info(
        f"Processing media with path={path}; directoryId={directory_id}")

    media_repository = MediaRepositoryAsync()

    media = await media_repository.get_madia_by_directory_id(directory_id)

    if media:
        logger.debug('Media exists, skipping')
        await incoming_message.ack()
        return

    start_time = time.process_time()
    videoProcessor = VideoProcessor(path)
    await asyncio.to_thread(process_video, videoProcessor)

    elapsed_time = time.process_time() - start_time
    logger.info(f"Total time processing media: {elapsed_time};")
    MEDIA_PROCESSING_DURATION_SECONDS.observe(elapsed_time)

    info = videoProcessor.get_media_info()

    new_media = UpsertMediaEntityDto(
        directory_id=directory_id,
        preview_path=videoProcessor.full_preview_path,
        info=info,
    )
    await media_repository.upsert_many([new_media])

    logger.debug(
        f"Processing media finished, delivery tag: {incoming_message.delivery_tag}"
    )
    await incoming_message.ack()
    return
