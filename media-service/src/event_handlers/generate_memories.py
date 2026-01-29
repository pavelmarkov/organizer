
import asyncio
import time
from typing import List
from src.data.repositories.media_async import MediaRepositoryAsync
from aio_pika.abc import AbstractIncomingMessage

from src.logger.log import logger

from src.dtos.memories_generator import GenerateMemoriesMessageBodyDto

from src.services.clips.memories_generator import MemoriesGenerator

from src.dtos.clips_entity import ClipsInfo, UpsertClipsEntityDto

from src.data.repositories.clips import ClipsRepository


def parse_message_body(message: str) -> GenerateMemoriesMessageBodyDto:
    return GenerateMemoriesMessageBodyDto.model_validate_json(message)


def generate_video(memories_generator: MemoriesGenerator) -> List[UpsertClipsEntityDto]:
    memories_generator.prepare()
    return memories_generator.generate_memories()


async def on_generate_memories_message_received(
    incoming_message: AbstractIncomingMessage
):
    if incoming_message.redelivered:
        logger.debug(f"Message redelivered {incoming_message.message_id}")

    parsed_message = parse_message_body(incoming_message.body.decode())

    logger.debug(
        f"Pattern: {parsed_message.pattern}; Id: {parsed_message.id};"
    )
    logger.info(f"Processing media;")

    start_time = time.process_time()
    memories_generator = MemoriesGenerator(parsed_message.data)
    generated_clips = await asyncio.to_thread(generate_video, memories_generator)

    clips_repository = ClipsRepository()
    await clips_repository.upsert_many(generated_clips)

    elapsed_time = time.process_time() - start_time
    logger.info(f"Total time generating media: {elapsed_time};")

    await incoming_message.ack()
    return
