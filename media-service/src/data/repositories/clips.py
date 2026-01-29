from typing import List
import uuid

from fastapi.params import Depends
from sqlalchemy import delete, select
from sqlalchemy.dialects.sqlite import insert as sqlite_upsert

from src.data.repositories.base_async import get_async_db_session
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from src.data.models import Clips
from src.dtos.clips_entity import UpsertClipsEntityDto


class ClipsRepository():
    async def get_clips_by_memory_id(self, memory_id: str, session: AsyncSession = Depends(get_async_db_session)) -> List[Clips]:
        async for session in get_async_db_session():
            results = await session.scalars(
                select(Clips)
                .where(Clips.memory_id == uuid.UUID(memory_id))
                .order_by(Clips.memory_id)
            )

            return results.all()

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

    async def remove_by_memory_id(self, memory_id: str):
        statement = delete(Clips).where(
            Clips.memory_id == uuid.UUID(memory_id)
        )

        async for session in get_async_db_session():
            await session.execute(statement)
            return
