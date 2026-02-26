

from pydantic import BaseModel, Field
from typing import List
import uuid
from pydantic import BaseModel, Field, field_validator


class MediaInfo(BaseModel):
    duration_in_seconds: int = Field(
        serialization_alias='durationInSeconds'
    )
    minutes: int
    seconds: int
    width: int
    height: int
    codec_name: str = Field(
        serialization_alias='codecName'
    )
    unique_name: str = Field(
        serialization_alias='uniqueName'
    )
    size: int


class UpsertMediaEntityDto(BaseModel):
    directory_id: uuid.UUID
    preview_path: str
    info: MediaInfo

    @field_validator('directory_id', mode='before')
    @classmethod
    def directory_id_to_guid(cls, v: str) -> str:
        return uuid.UUID(v)


class DirectoryEntityModel(BaseModel):
    directory_id: str = Field(alias='directoryId')
    path: str = Field(alias='path')


class DirectoryMessageModel(BaseModel):
    directories: list[DirectoryEntityModel]


class ProcessMediaMessageBodyDto(BaseModel):
    id: str
    pattern: str
    data: DirectoryMessageModel


class ProcessMediaResponseDataDto(BaseModel):
    directory_id: str = Field(
        serialization_alias='directoryId'
    )
    path: str = Field()
    info: MediaInfo | None
    errors: List[str]


class ProcessMediaResponseDto(BaseModel):
    directories: List[ProcessMediaResponseDataDto]
