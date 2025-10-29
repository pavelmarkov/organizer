
import asyncio
import json
from media.process import VideoProcessor
import time
from data.repositories.media import MediaRepository
from aio_pika.abc import AbstractIncomingMessage


def blocking_io():
    print(f"start blocking_io at {time.strftime('%X')}")
    # Note that time.sleep() can be replaced with any blocking
    # IO-bound operation, such as file operations.
    time.sleep(5)
    print(f"blocking_io complete at {time.strftime('%X')}")


def process_video(processor: VideoProcessor):
    processor.prepare()
    processor.process_video_file()


async def on_process_media_message_received(
    incoming_message: AbstractIncomingMessage
):
    """
    Callback function executed when a message is received.
    """

    if incoming_message.redelivered:
        print(f" [x] Message redelivered {incoming_message.message_id}")

    message = json.loads(incoming_message.body.decode())

    directory_id = message['data']['directory'][0]['directoryId']
    path = message['data']['directory'][0]['path']

    print('\n')
    print(f" [x] Received: ")
    print(f" [x] Pattern: {message['pattern']}; Id: {message['id']};")
    print(f" [x] Path {path}")

    media_repository = MediaRepository()

    media = media_repository.get_madia_by_directory_id(directory_id)
    # blocking_io()
    # await asyncio.to_thread(blocking_io)

    if media:
        print('media exists, skipping')
        await incoming_message.ack()
        # await asyncio.sleep(2)
        print('incoming_message.ack()')
        # blocking_io()
        return

    start_time = time.process_time()
    videoProcessor = VideoProcessor(path)
    await asyncio.to_thread(process_video, videoProcessor)

    # async with asyncio.TaskGroup() as tg:
    #     task1 = tg.create_task(videoProcessor.prepare())
    #     task2 = tg.create_task(videoProcessor.process_video_file())
    #     await asyncio.sleep(1)

    elapsed_time = time.process_time() - start_time
    print('total time processing video: ', elapsed_time)
    if (elapsed_time > 60):
        print('processing time too large')

    info = videoProcessor.get_media_info()
    media_repository.insert_many([{
        'directory_id': directory_id,
        'preview_path': videoProcessor.full_preview_path,
        'info': info
    }])

    print('sending ack, delivery tag: ', incoming_message.delivery_tag)
    await incoming_message.ack()
    print('ack send')
    return
