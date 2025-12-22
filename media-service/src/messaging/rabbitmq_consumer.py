import aio_pika
from src.config.rabbitmq import get_settings
from src.event_handlers.process_media import on_process_media_message_received
from src.event_handlers.generate_memories import on_generate_memories_message_received
from aio_pika import connect_robust
import asyncio


class RabbitMQConsumer():
    def __init__(self):
        self.config = get_settings()
        self._connection = None
        self._channel = None
        self._should_reconnect = False
        self._consuming = False
        self._retry_count = 0

    async def connect(self, loop):
        """Establish connection to RabbitMQ"""
        try:
            print(
                f"Connecting to Rabbit MQ: host: {self.config.host}; port: {self.config.port}"
            )
            self._connection = await connect_robust(
                host=self.config.host,
                port=self.config.port,
                login='guest',
                password='guest',
                loop=loop,
            )

            self._channel = await self._connection.channel()
            await self._channel.set_qos(prefetch_count=1, prefetch_size=0)

            media_queue = await self._channel.declare_queue(self.config.media_queue, durable=False, arguments={
                "x-max-length": 1_000_000
            })
            memories_queue = await self._channel.declare_queue(self.config.memories_queue, durable=False, arguments={
                "x-max-length": 1_000_000
            })

            self._consuming = True
            self._retry_count = 0

            await media_queue.consume(callback=on_process_media_message_received, no_ack=False)
            await memories_queue.consume(callback=on_generate_memories_message_received, no_ack=False)

        except KeyboardInterrupt:
            print("Consumer stopped by user.")
        except aio_pika.exceptions.AMQPConnectionError as e:
            print(f"Error connecting to RabbitMQ: {e}")
            self._retry_count += 1
            # if (self._retry_count > 3):
            #     return
            print(f"Trying to reconnect to RabbitMQ: {self._retry_count}")
            await asyncio.sleep(5)
            await self.reconnect(loop)
        # finally:
        #     await self._connection.close()

    async def close(self):
        """Close the connection"""
        if self._connection and not self._connection.closed:
            if self._consuming:
                self._channel.close()
            self._connection.close()
        self._consuming = False

    async def reconnect(self, loop):
        """Reconnection logic"""
        await self.close()
        await self.connect(loop)
