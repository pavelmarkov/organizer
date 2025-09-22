from contextlib import contextmanager

import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

from data.data_models import Base, Media

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

    def get_madia(self):
        with self.session_scope() as s:
            media = s.query(Media).all()
            return media
