import { Observable } from 'rxjs';
import { CardModel, DirectoryModel } from '../domain';

export abstract class DirectoryService {
  abstract getDirectory(
    params: Partial<DirectoryModel>,
    pagination: { offset?: number; limit?: number }
  ): Observable<DirectoryModel[]>;

  abstract count(): Observable<number>;

  abstract processDirectory(
    directoryGuids: string[]
  ): Observable<{ message: string }>;

  abstract importDirectory(
    directories: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]>;

  abstract update(
    directories: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]>;

  abstract view(directoryId: string): Observable<CardModel>;
}
