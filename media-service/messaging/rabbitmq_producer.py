import pika
from config.rabbitmq import get_settings

class RabbitMQProducer():
    def __init__(self):
        self.config = get_settings()
        self.connection = None
        self.channel = None
        self._should_reconnect = False
        self._consuming = False


    def send_message(self, message):
        if not self.connection:
            self.connect()
        # Publish a message
        self.channel.basic_publish(exchange='',
                                routing_key=self.config.queue,
                                body=message)
        print(" [x] Sent RabbitMQ message!'")

    async def connect(self):
        """Establish connection to RabbitMQ"""
        try:
          connection_parameters = pika.ConnectionParameters(
            host=self.config.host,
            port=self.config.port
          )
          connection = pika.BlockingConnection(
            connection_parameters
          )

          channel = connection.channel()

          channel.queue_declare(queue=self.config.queue)
          print(' [*] Waiting for messages. To exit press CTRL+C')

          channel.start_consuming()
        except pika.exceptions.AMQPConnectionError as e:
            print(f"Error connecting to RabbitMQ: {e}")
        except KeyboardInterrupt:
            print("Consumer stopped by user.")
        finally:
            if 'connection' in locals() and connection.is_open:
                connection.close()

    async def close(self):
        """Close the connection"""
        if self.connection and self.connection.is_open:
            if self._consuming:
                self.channel.stop_consuming()
            self.connection.close()
        self._consuming = False

    async def reconnect(self):
        """Reconnection logic"""
        await self.close()
        await self.connect()