

from typing import Optional
from pydantic import BaseModel, Field


class TimeInterval(BaseModel):
    start: int
    end: int


class DirectoryDto(BaseModel):
    id: str = Field(alias='directoryId')
    path: str
    interval: Optional[TimeInterval] = None


class GenerateMemoriesDto(BaseModel):
    directories: list[DirectoryDto]
    memory_guid: str = Field(alias='memoryGuid')


class GenerateMemoriesMessageBodyDto(BaseModel):
    id: str
    pattern: str
    data: GenerateMemoriesDto
