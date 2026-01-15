
import asyncio
import time
from src.data.repositories.media_async import MediaRepositoryAsync
from aio_pika.abc import AbstractIncomingMessage

from src.logger.log import logger

from src.dtos.memories_generator import GenerateMemoriesMessageBodyDto

from src.media.memories_generator import MemoriesGenerator


def parse_message_body(message: str) -> GenerateMemoriesMessageBodyDto:
    return GenerateMemoriesMessageBodyDto.model_validate_json(message)


def generate_video(memories_generator: MemoriesGenerator):
    memories_generator.prepare()
    memories_generator.get_summary_video()


async def on_generate_memories_message_received(
    incoming_message: AbstractIncomingMessage
):
    if incoming_message.redelivered:
        logger.debug(f"Message redelivered {incoming_message.message_id}")

    parsed_message = parse_message_body(incoming_message.body.decode())

    logger.debug(
        f"Pattern: {parsed_message.pattern}; Id: {parsed_message.id};"
    )

    directory_guids = parsed_message.data.directory_guids
    paths = parsed_message.data.paths
    memory_guid = parsed_message.data.memory_guid

    logger.info(
        f"Processing media with guids={directory_guids};")

    media_repository = MediaRepositoryAsync()

    for directory_guid in directory_guids:
        media = await media_repository.get_madia_by_directory_id(directory_guid)
        print(media)

    start_time = time.process_time()
    memories_generator = MemoriesGenerator(memory_guid, paths)
    await asyncio.to_thread(generate_video, memories_generator)
    elapsed_time = time.process_time() - start_time
    logger.info(f"Total time generating media: {elapsed_time};")

    await incoming_message.ack()
    return
