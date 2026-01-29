from typing import Optional
from sqlalchemy import Column, String, func
from sqlalchemy.types import JSON, UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from uuid import uuid4, UUID as pUUID
from src.data.models.base import Base


class Clips(Base):
    __tablename__ = "clips"
    id = Column(UUID, primary_key=True, default=uuid4,
                server_default=func.gen_random_uuid())
    name = Column(String(255))
    path: Mapped[Optional[str]]
    directory_id: Mapped[pUUID] = mapped_column()
    memory_id: Mapped[pUUID] = mapped_column()
    info: Mapped[Optional[JSON]] = mapped_column(type_=JSON)

    def __repr__(self) -> str:
        return f"Clip(id={self.id!r}, directory_id={self.directory_id!r}, memory_id={self.directory_id!r})"
