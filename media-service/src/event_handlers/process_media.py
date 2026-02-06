
import asyncio

from src.services.media.process import VideoProcessor
import time
from src.data.repositories.media_async import MediaRepositoryAsync
from aio_pika.abc import AbstractIncomingMessage
from pamqp.commands import Basic

from src.logger.log import logger

from src.dtos.media_processing import ProcessMediaMessageBodyDto, ProcessMediaResponseDataDto, ProcessMediaResponseDto
from src.dtos.media_entity import UpsertMediaEntityDto

from src.metrics import MEDIA_PROCESSING_DURATION_SECONDS


def parseDirectoryMessageBody(message: str) -> ProcessMediaMessageBodyDto:
    return ProcessMediaMessageBodyDto.model_validate_json(message)


def process_video(processor: VideoProcessor):
    processor.prepare()
    if processor.has_errors():
        return None
    processor.process_video_file()
    if processor.has_errors():
        return None
    return processor.get_media_info()


async def on_process_media_message_received(
    incoming_message: AbstractIncomingMessage
):
    if incoming_message.redelivered:
        logger.debug(f"Message redelivered {incoming_message.message_id}")

    parsedMessage = parseDirectoryMessageBody(incoming_message.body.decode())

    logger.debug(f"Pattern: {parsedMessage.pattern}; Id: {parsedMessage.id};")

    directory_id = parsedMessage.data.directories[0].directory_id
    path = parsedMessage.data.directories[0].path

    logger.info(
        f"Processing media with path={path}; directoryId={directory_id}")

    media_repository = MediaRepositoryAsync()

    media = await media_repository.get_madia_by_directory_id(directory_id)

    processing_media_info = ProcessMediaResponseDataDto(
        directory_id=directory_id,
        path=path,
        info=None,
        errors=[],
    )

    if media:
        logger.debug('Media exists, skipping')
        processing_media_info.info = media.info
        processing_media_result = ProcessMediaResponseDto(
            directories=[processing_media_info.model_dump()],
        )
        await send_response_message(incoming_message, processing_media_result)
        await incoming_message.ack()
        return

    start_time = time.process_time()
    videoProcessor = VideoProcessor(path)
    processing_media_info.info = await asyncio.to_thread(process_video, videoProcessor)

    processing_media_info.errors = videoProcessor.errors

    processing_media_result = ProcessMediaResponseDto(
        directories=[processing_media_info],
    )

    elapsed_time = time.process_time() - start_time
    logger.info(f"Total time processing media: {elapsed_time};")
    MEDIA_PROCESSING_DURATION_SECONDS.observe(elapsed_time)

    new_media = UpsertMediaEntityDto(
        directory_id=directory_id,
        preview_path=videoProcessor.full_preview_path,
        info=processing_media_info.info,
    )
    await media_repository.upsert_many([new_media])

    logger.debug(
        f"Processing media finished, delivery tag: {incoming_message.delivery_tag}"
    )

    processing_media_result = ProcessMediaResponseDto(
        directories=[processing_media_info],
    )
    await send_response_message(incoming_message, processing_media_result)
    await incoming_message.ack()
    return


async def send_response_message(
    incoming_message: AbstractIncomingMessage,
    response_data: ProcessMediaResponseDto,
):
    await incoming_message.channel.basic_publish(
        exchange=incoming_message.exchange,
        routing_key=incoming_message.reply_to,
        properties=Basic.Properties(
            correlation_id=incoming_message.correlation_id
        ),
        body=response_data.model_dump_json(
            by_alias=True).encode("utf-8")
    )
