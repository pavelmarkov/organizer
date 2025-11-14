
from fastapi.responses import PlainTextResponse
from prometheus_client import REGISTRY, generate_latest

from fastapi import APIRouter, Response
router = APIRouter()


@router.get('/metrics', response_class=PlainTextResponse)
async def get_metrics():
    metrics_data = generate_latest(REGISTRY)
    return Response(content=metrics_data, media_type='text/plain')
