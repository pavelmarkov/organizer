import { Observable } from 'rxjs';
import { GetDirectoryRequestDto, GetDirectoryResponseDto } from '../dtos';

export abstract class DirectoryRepository {
  abstract getDirectory(
    params: GetDirectoryRequestDto
  ): Observable<GetDirectoryResponseDto>;
  abstract processDirectory(
    directoryGuids: string[]
  ): Observable<GetDirectoryResponseDto>;
}
