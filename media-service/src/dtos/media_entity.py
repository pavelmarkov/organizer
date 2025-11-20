

import uuid
from pydantic import BaseModel, field_validator


class MediaInfo(BaseModel):
    duration_in_seconds: int
    minutes: int
    seconds: int
    width: int
    height: int
    codec_name: str
    unique_name: str
    size: int


class UpsertMediaEntityDto(BaseModel):
    directory_id: uuid.UUID
    preview_path: str
    info: MediaInfo

    @field_validator('directory_id', mode='before')
    @classmethod
    def directory_id_to_guid(cls, v: str) -> str:
        return uuid.UUID(v)
