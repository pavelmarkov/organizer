import { Observable } from 'rxjs';
import { MemoriesModel, MemorySourceModel } from '../domain';
import { GenerateMemoriesRequestDto } from '../dtos';

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

  abstract generate(
    params: GenerateMemoriesRequestDto,
  ): Observable<{ message: string }>;

  abstract getDirectoryUrl(params: {
    directoryId: string;
    projectId: string;
    startTime: number;
  }): string;

  abstract getSources(memoryId: string): Observable<MemorySourceModel[]>;
  abstract updateSources(
    params: (Pick<MemorySourceModel, 'id'> & Partial<MemorySourceModel>)[],
  ): Observable<Partial<MemorySourceModel>[]>;
  abstract deleteSources(
    params: (Pick<MemorySourceModel, 'id'> & Partial<MemorySourceModel>)[],
  ): Observable<Partial<MemorySourceModel>[]>;
}
