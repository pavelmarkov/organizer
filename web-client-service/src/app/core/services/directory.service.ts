import { Observable } from 'rxjs';
import {
  GetDirectoryRequestDto,
  GetDirectoryResponseDto,
  ImportDirectoryStructureRequestDto,
  ImportDirectoryStructureResponseDto,
} from '../dtos';

export abstract class DirectoryService {
  abstract getDirectory(
    params: GetDirectoryRequestDto
  ): Observable<GetDirectoryResponseDto>;

  abstract processDirectory(
    directoryGuids: string[]
  ): Observable<GetDirectoryResponseDto>;

  abstract importDirectory(
    directoryStructure: ImportDirectoryStructureRequestDto
  ): Observable<ImportDirectoryStructureResponseDto>;
}
