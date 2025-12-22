

from pydantic import BaseModel, Field


class GenerateMemoriesDto(BaseModel):
    directory_guids: list[str] = Field(alias='directoryGuids')
    paths: list[str] = Field(alias='paths')


class GenerateMemoriesMessageBodyDto(BaseModel):
    id: str
    pattern: str
    data: GenerateMemoriesDto
