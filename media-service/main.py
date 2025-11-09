from fastapi import FastAPI, Response

import asyncio

from fastapi.responses import PlainTextResponse
from prometheus_client import REGISTRY, generate_latest

from messaging.rabbitmq_consumer import RabbitMQConsumer

from api import main_router

from contextlib import asynccontextmanager

from middleware.monitoring import metrics_middleware

from data.repositories.base_async import init_db


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


@app.get('/metrics', response_class=PlainTextResponse)
async def get_metrics():
    metrics_data = generate_latest(REGISTRY)
    return Response(content=metrics_data, media_type='text/plain')

app.include_router(main_router)


def main():
    pass


if __name__ == '__main__':
    main()
