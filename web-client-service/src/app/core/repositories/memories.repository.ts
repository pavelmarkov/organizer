import { Observable } from 'rxjs';
import { MemoriesModel, MemorySourceModel } from '../domain';

export abstract class MemoriesRepository {
  abstract get(): Observable<MemoriesModel[]>;
  abstract count(): Observable<number>;
  abstract create(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]>;
  abstract update(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]>;
  abstract remove(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]>;

  abstract generate(directoryGuids: string[]): Observable<{ message: string }>;
  abstract getSources(memoryId: string): Observable<MemorySourceModel[]>;

  abstract getDirectoryUrl(params: {
    directoryId: string;
    projectId: string;
    startTime: number;
  }): string;
}
