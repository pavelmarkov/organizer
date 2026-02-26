from fastapi import APIRouter
from src.media.router import router as media_router
from src.metrics.router import router as metrics_router
from src.clips.router import router as clips_router
from src.stream.router import router as stream_router

main_router = APIRouter(prefix='/v1')

main_router.include_router(media_router)
main_router.include_router(metrics_router)
main_router.include_router(clips_router)
main_router.include_router(stream_router)
