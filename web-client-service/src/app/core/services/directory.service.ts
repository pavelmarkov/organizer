import { Observable } from 'rxjs';
import { GetDirectoryRequestDto, GetDirectoryResponseDto } from '../dtos';

export abstract class DirectoryService {
  abstract getDirectory(
    params: GetDirectoryRequestDto
  ): Observable<GetDirectoryResponseDto>;
}
