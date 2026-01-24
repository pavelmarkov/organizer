import { Observable } from 'rxjs';
import { MemoriesService } from '../core/services/';
import { inject } from '@angular/core';
import { MemoriesRepository } from '../core/repositories/memories.repository';
import { MemoriesModel } from '../core/domain';

export class MemoriesServiceImpl implements MemoriesService {
  private memoriesRepository = inject(MemoriesRepository);

  constructor() {}

  get(): Observable<MemoriesModel[]> {
    return this.memoriesRepository.get();
  }

  count(): Observable<number> {
    return this.memoriesRepository.count();
  }

  create(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]> {
    return this.memoriesRepository.create(memories);
  }

  update(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]> {
    return this.memoriesRepository.update(memories);
  }

  remove(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]> {
    return this.memoriesRepository.remove(memories);
  }

  generate(directoryGuids: string[]): Observable<{ message: string }> {
    return this.memoriesRepository.generate(directoryGuids);
  }

  getSources(memoryId: string): Observable<string[]> {
    return this.memoriesRepository.getSources(memoryId);
  }

  getStreamUrl(pathToFile: string): string {
    return this.memoriesRepository.getStreamUrl(pathToFile);
  }
}
