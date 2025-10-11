from contextlib import contextmanager

import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

from data.data_models import Base, Media

from sqlalchemy.sql import text

import uuid

main_engine = sa.create_engine(
    "sqlite:///media.db",
    echo=True,
)

DBSession = sessionmaker(
    binds={
        Base: main_engine,
    },
    expire_on_commit=False,
)

Base.metadata.create_all(main_engine)


class DataStorage:
    @staticmethod
    @contextmanager
    def session_scope():
        """Provides a transactional scope around a series of operations."""
        session = DBSession()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def run_migrations(self):
        with main_engine.connect() as con:
            pass
            # self.add_column(con, 'media', 'test', 'varchar')
        return

    def add_column(
        self, connection: sa.Connection, table_name: str, column_name: str, type: str
    ):
        try:
            connection.execute(
                text(
                    f'alter table {table_name} add {column_name} {type}'),
            )
        except:
            print(f'error creating column {column_name}')


class MediaRepository(DataStorage):
    def get_madia(self):
        with self.session_scope() as s:
            media = s.query(Media).all()
            return media

    def get_madia_by_directory_id(self, directory_id):
        with self.session_scope() as s:
            medias = s.query(Media).filter(
                Media.directory_id == uuid.UUID(directory_id)
            ).all()

            if (len(medias) == 1):
                return medias[0]

            if (len(medias) == 0):
                return None

            if (len(medias) > 1):
                error_message = 'Duplicate value directory_id: ' + directory_id
                print(error_message)
                raise ValueError(error_message)

            return None

    def insert_many(self, rows: list[Media]):
        with self.session_scope() as s:
            return s.bulk_save_objects([Media(
                directory_id=uuid.UUID(row['directory_id']),
                preview_path=row['preview_path'],
                info=row['info']
            ) for row in rows])
