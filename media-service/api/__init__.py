from fastapi import APIRouter
from api.media import router as media_router

main_router = APIRouter()

main_router.include_router(media_router)
