

from typing import List
from pydantic import BaseModel, Field
from src.dtos.media_entity import MediaInfo


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
