
from fastapi import Request
import time

from src.metrics.common import REQUEST_DURATION


async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    REQUEST_DURATION.observe(duration)
    return response
