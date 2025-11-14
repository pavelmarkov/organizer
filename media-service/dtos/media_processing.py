

from pydantic import BaseModel, Field


class DirectoryEntityModel(BaseModel):
    directory_id: str = Field(alias='directoryId')
    path: str = Field(alias='path')


class DirectoryMessageModel(BaseModel):
    directory: list[DirectoryEntityModel]


class ProcessMediaMessageBodyDto(BaseModel):
    id: str
    pattern: str
    data: DirectoryMessageModel
