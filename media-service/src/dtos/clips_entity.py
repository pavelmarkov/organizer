

from typing import List, Optional
import uuid
from pydantic import BaseModel, Field, field_validator


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


class PatchClipsEntityDto(BaseModel):
    id: uuid.UUID = Field(exclude=True)
    name: str

    @field_validator('id', mode='before')
    @classmethod
    def id_to_guid(cls, v: str) -> str:
        return uuid.UUID(v)


class DeleteClipsEntityDto(BaseModel):
    clip_ids: List[str] = Field(
        alias='memorySourceIds'
    )

    # @field_validator('clip_ids', mode='before')
    # @classmethod
    # def clip_ids_to_guid(cls, v: List[str]) -> str:
    #     return [uuid.UUID(str_guid) for str_guid in v]


class ClipsFilterSchema(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = None
    path: Optional[str] = None
    directory_id: Optional[uuid.UUID] = None
    memory_id: Optional[uuid.UUID] = None

    @field_validator('directory_id', mode='before')
    @classmethod
    def directory_id_to_guid(cls, v: str) -> uuid.UUID:
        return uuid.UUID(v)

    @field_validator('memory_id', mode='before')
    @classmethod
    def memory_id_to_guid(cls, v: str) -> uuid.UUID:
        return uuid.UUID(v)
