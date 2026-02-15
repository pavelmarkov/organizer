from typing import List, Optional
import uuid

from fastapi.params import Depends
from pydantic import BaseModel
from sqlalchemy import delete, select, update
from sqlalchemy.dialects.sqlite import insert as sqlite_upsert

from src.data.repositories.base_async import get_async_db_session
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from src.data.models import Clips
from src.dtos.clips_entity import UpsertClipsEntityDto


class ClipsRepository():
    async def upsert_many(self, rows: list[UpsertClipsEntityDto]):
        new_rows = [row.model_dump() for row in rows]

        statement = sqlite_upsert(Clips).values(new_rows)

        statement.on_conflict_do_update(
            index_elements=[Clips.id],
            set_=dict(
                name=statement.excluded.name,
                directory_id=statement.excluded.directory_id,
                memory_id=statement.excluded.memory_id,
                info=statement.excluded.info
            )
        )

        async for session in get_async_db_session():
            await session.execute(statement)
            return

    async def update(self, filter: tuple, values: dict):
        statement = update(Clips).filter_by(**filter).values(**values)

        # print(statement.compile(compile_kwargs={"literal_binds": True}))

        async for session in get_async_db_session():
            await session.execute(statement)
            return

    async def remove(self, filter: tuple):
        statement = delete(Clips).filter_by(**filter)

        # print(statement.compile(compile_kwargs={"literal_binds": True}))

        async for session in get_async_db_session():
            await session.execute(statement)
            return

    async def remove_by_memory_id(self, memory_id: str):
        statement = delete(Clips).filter_by().where(
            Clips.memory_id == uuid.UUID(memory_id)
        )

        async for session in get_async_db_session():
            await session.execute(statement)
            return

    async def remove_by_clip_id(self, clip_id: str):
        statement = delete(Clips).where(
            Clips.id == uuid.UUID(clip_id)
        )

        async for session in get_async_db_session():
            await session.execute(statement)
            return

    async def get_by_clip_id(self, clip_id: str) -> Clips:
        async for session in get_async_db_session():
            results = await session.scalars(
                select(Clips)
                .where(Clips.id == uuid.UUID(clip_id))
            )

            return results.one()
        self.get()

    async def find(self, filter: dict):
        async for session in get_async_db_session():
            statement = select(Clips).filter_by(**filter)

            print(statement.compile(compile_kwargs={"literal_binds": True}))

            results = await session.scalars(statement)

            return results.all()
