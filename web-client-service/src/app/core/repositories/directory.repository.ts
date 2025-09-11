import { Observable } from 'rxjs';
import {
  GetDirectoryRequestDto,
  GetDirectoryResponseDto,
  ImportDirectoryStructureRequestDto,
  ImportDirectoryStructureResponseDto,
} from '../dtos';
import { DirectoryModel } from '../domain';

export abstract class DirectoryRepository {
  abstract getDirectory(
    params: Partial<DirectoryModel>
  ): Observable<DirectoryModel[]>;

  abstract processDirectory(
    directoryGuids: string[]
  ): Observable<{ message: string }>;

  abstract importDirectory(
    directories: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]>;
}
