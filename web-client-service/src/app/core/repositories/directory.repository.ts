import { Observable } from 'rxjs';
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

  abstract update(
    directories: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]>;
}
