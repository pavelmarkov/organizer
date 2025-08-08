from fastapi import FastAPI
import asyncio
from messaging.rabbitmq_consumer import RabbitMQConsumer
from messaging.rabbitmq_producer import RabbitMQProducer

app = FastAPI()


@app.get("/")
def read_root():
    producer = RabbitMQProducer()
    producer.send_message()
    return {"message": "Hello, World!"}


async def main():
    consumer = RabbitMQConsumer()
    await consumer.connect()

if __name__ == '__main__':
    asyncio.run(main())
