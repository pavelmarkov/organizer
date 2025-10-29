import uuid

from data.repositories.base import DataStorage
from data.models import Media


class MediaRepository(DataStorage):
    def get_madia(self):
        with self.session_scope() as s:
            media = s.query(Media).all()
            return media

    def get_madia_by_directory_id(self, directory_id: str) -> Media | None:
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

            error_message = 'Something wend wrong during getting directory_id: ' + directory_id
            print(error_message)
            raise ValueError(error_message)

    def insert_many(self, rows: list[Media]):
        with self.session_scope() as s:
            return s.bulk_save_objects([Media(
                directory_id=uuid.UUID(row['directory_id']),
                preview_path=row['preview_path'],
                info=row['info']
            ) for row in rows])
