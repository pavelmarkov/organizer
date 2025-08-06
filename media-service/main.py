from fastapi import FastAPI
import asyncio
from event_handler import send_message, on_message_received
from messaging.rabbitmq_consumer import RabbitMQConsumer

app = FastAPI()

@app.get("/")
def read_root():
    send_message()
    return {"message": "Hello, World!"}

async def main():
    consumer = RabbitMQConsumer()
    await consumer.connect()

if __name__ == '__main__':
    asyncio.run(main())