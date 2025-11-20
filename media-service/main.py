from fastapi import FastAPI, Response

import asyncio

from src.messaging.rabbitmq_consumer import RabbitMQConsumer

from src.api import main_router

from contextlib import asynccontextmanager

from src.middleware.monitoring import metrics_middleware

from src.data.repositories.base_async import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    loop = asyncio.get_running_loop()
    consumer = RabbitMQConsumer()
    connect_to_queue_task = loop.create_task(consumer.connect(loop))
    connect_to_queue_task
    run_db_migrations_tast = loop.create_task(init_db())
    await run_db_migrations_tast
    yield
    await consumer.close()

app = FastAPI(lifespan=lifespan)

app.middleware('http')(metrics_middleware)

app.include_router(main_router, prefix='/api')


def main():
    pass


if __name__ == '__main__':
    main()
