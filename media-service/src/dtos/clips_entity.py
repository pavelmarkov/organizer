

import uuid
from pydantic import BaseModel, field_validator


class ClipsInfo(BaseModel):
    duration_in_seconds: int
    start_time_in_seconds: int
    end_time_in_seconds: int


class UpsertClipsEntityDto(BaseModel):
    name: str
    directory_id: uuid.UUID
    memory_id: uuid.UUID
    path: str
    info: ClipsInfo

    @field_validator('directory_id', mode='before')
    @classmethod
    def directory_id_to_guid(cls, v: str) -> str:
        return uuid.UUID(v)

    @field_validator('memory_id', mode='before')
    @classmethod
    def memory_id_to_guid(cls, v: str) -> str:
        return uuid.UUID(v)
