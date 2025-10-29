from contextlib import contextmanager

import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

from data.models.base import Base

from sqlalchemy.sql import text

main_engine = sa.create_engine(
    "sqlite:///media.db",
    echo=False,
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


db = DataStorage()
db.run_migrations()
