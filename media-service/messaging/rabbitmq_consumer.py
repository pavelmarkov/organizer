import aio_pika
from config.rabbitmq import get_settings
from event_handlers.process_media import on_process_media_message_received
from aio_pika import connect_robust


class RabbitMQConsumer():
    def __init__(self):
        self.config = get_settings()
        self._connection = None
        self._channel = None
        self._should_reconnect = False
        self._consuming = False

    async def connect(self, loop):
        """Establish connection to RabbitMQ"""
        try:
            self._connection = await connect_robust(
                host=self.config.host,
                port=self.config.port,
                login='guest',
                password='guest',
                loop=loop,
            )

            self._channel = await self._connection.channel()
            queue = await self._channel.declare_queue(self.config.queue, durable=False)
            self._consuming = True
            await queue.consume(callback=on_process_media_message_received, no_ack=False)

        except aio_pika.exceptions.AMQPConnectionError as e:
            print(f"Error connecting to RabbitMQ: {e}")
        except KeyboardInterrupt:
            print("Consumer stopped by user.")
        # finally:
        #     if 'connection' in locals() and self._connection.is_open:
        #         self._connection.close()

    async def close(self):
        """Close the connection"""
        if self._connection and not self._connection.closed:
            if self._consuming:
                self._channel.close()
            self._connection.close()
        self._consuming = False

    async def reconnect(self):
        """Reconnection logic"""
        await self.close()
        await self.connect()
