from fastapi import APIRouter
from api.media import router as media_router
from api.metrics import router as metrics_router

main_router = APIRouter()

main_router.include_router(media_router)
main_router.include_router(metrics_router)
