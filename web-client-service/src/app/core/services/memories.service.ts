import { Observable } from 'rxjs';
import { MemoriesModel } from '../domain';

export abstract class MemoriesService {
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
  abstract getSources(memoryId: string): Observable<string[]>;
  abstract getStreamUrl(pathToFile: string): string;
}
