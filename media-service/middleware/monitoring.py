from prometheus_client import Summary
from fastapi import Request
import time

REQUEST_DURATION = Summary(
    'request_duration_in_seconds', 'Time spent procession request'
)


async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    REQUEST_DURATION.observe(duration)
    return response
