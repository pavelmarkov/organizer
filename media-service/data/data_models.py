from typing import List
from typing import Optional
from sqlalchemy import String, create_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
import sqlalchemy as sa

from uuid import uuid4, UUID


class Base(DeclarativeBase):
    pass


class Media(Base):
    __tablename__ = "media"
    media_id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    directory_id: Mapped[UUID] = mapped_column(primary_key=True)
    preview_path: Mapped[Optional[str]]

    def __repr__(self) -> str:
        return f"Media(media_id={self.media_id!r}, directory_id={self.directory_id!r}, preview_path={self.preview_path!r})"
