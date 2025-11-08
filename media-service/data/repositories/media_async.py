import uuid

from fastapi.params import Depends
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert as sqlite_upsert

from data.repositories.base_async import get_async_db_session
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)
from data.models import Media


class MediaRepositoryAsync():
    async def get_madia_by_directory_id(self, directory_id: str, session: AsyncSession = Depends(get_async_db_session)) -> Media:
        async for session in get_async_db_session():
            results = await session.scalars(
                select(Media)
                .where(Media.directory_id == uuid.UUID(directory_id))
                .order_by(Media.media_id)
            )

            medias = results.all()

            if (len(medias) == 1):
                return medias[0]

            if (len(medias) == 0):
                return None

            if (len(medias) > 1):
                error_message = 'Duplicate value directory_id: ' + directory_id
                print(error_message)
                raise ValueError(error_message)

            error_message = 'Something wend wrong during getting directory_id: ' + directory_id
            print(error_message)
            raise ValueError(error_message)

    async def upsert_many(self, rows: list[Media]):
        statement = sqlite_upsert(Media).values([
            ({
                'directory_id': uuid.UUID(row['directory_id']),
                'preview_path': row['preview_path'],
                'info': row['info']
            }) for row in rows
        ])
        statement = statement.on_conflict_do_update(
            index_elements=[Media.directory_id],
            set_=dict(
                preview_path=statement.excluded.preview_path,
                info=statement.excluded.info
            )
        )
        async for session in get_async_db_session():
            await session.execute(statement)
