from fastapi import APIRouter
from src.api.media import router as media_router
from src.api.metrics import router as metrics_router

main_router = APIRouter(prefix='/v1')

main_router.include_router(media_router)
main_router.include_router(metrics_router)
