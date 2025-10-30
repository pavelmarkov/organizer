from fastapi import FastAPI

import asyncio

from messaging.rabbitmq_consumer import RabbitMQConsumer

from api import main_router

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await asyncio.sleep(3)
    loop = asyncio.get_running_loop()
    consumer = RabbitMQConsumer()
    task = loop.create_task(consumer.connect(loop))
    await task
    yield
    await consumer.close()

app = FastAPI(lifespan=lifespan)

app.include_router(main_router)


def main():
    pass


if __name__ == '__main__':
    main()
