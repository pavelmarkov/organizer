

from pydantic import BaseModel, Field


class DirectoryDto(BaseModel):
    id: str = Field(alias='directoryId')
    path: str


class GenerateMemoriesDto(BaseModel):
    directories: list[DirectoryDto]
    memory_guid: str = Field(alias='memoryGuid')


class GenerateMemoriesMessageBodyDto(BaseModel):
    id: str
    pattern: str
    data: GenerateMemoriesDto
