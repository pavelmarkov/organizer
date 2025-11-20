from typing import Optional
from sqlalchemy import Column, func
from sqlalchemy.types import JSON, UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from uuid import uuid4, UUID as pUUID
from src.data.models.base import Base


class Media(Base):
    __tablename__ = "media"
    media_id = Column(UUID, primary_key=True, default=uuid4,
                      server_default=func.gen_random_uuid())
    # Mapped[UUID] = mapped_column(
    #     primary_key=True, default=uuid4, server_default=func.gen_random_uuid())
    directory_id: Mapped[pUUID] = mapped_column(unique=True, nullable=False)
    preview_path: Mapped[Optional[str]]
    info: Mapped[Optional[JSON]] = mapped_column(type_=JSON)

    def __repr__(self) -> str:
        return f"Media(media_id={self.media_id!r}, directory_id={self.directory_id!r}, preview_path={self.preview_path!r})"
