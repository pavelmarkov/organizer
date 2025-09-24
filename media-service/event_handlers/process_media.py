
import json
from pika.adapters.blocking_connection import BlockingConnection, BlockingChannel
from pika.spec import BasicProperties, Basic
from media.process import VideoProcessor
import time
from data.data_storage import MediaRepository
from aio_pika.abc import AbstractIncomingMessage


async def on_process_media_message_received(
    incoming_message: AbstractIncomingMessage
):
    """
    Callback function executed when a message is received.
    """

    message = json.loads(incoming_message.body.decode())

    print('\n')
    print(f" [x] Received {message}")

    print(f" [x] Properties {message}")
    print(message['data'])
    print(message['data']['directory'])

    directory_id = message['data']['directory'][0]['directoryId']
    path = message['data']['directory'][0]['path']

    media_repository = MediaRepository()

    media = media_repository.get_madia_by_directory_id(directory_id)
    print('MEDIA: ', media)

    if media:
        print('media exists, skipping')
        await incoming_message.ack()
        return

    start_time = time.process_time()
    videoProcessor = VideoProcessor(path)
    videoProcessor.prepare()

    videoProcessor.process_video_file()
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

    print('sending ack')
    print('delivery tag: ', incoming_message.delivery_tag)
    await incoming_message.ack()
    print('ack send')
    return
