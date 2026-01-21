import { Observable } from 'rxjs';
import { MemoriesService } from '../core/services/';
import { inject } from '@angular/core';
import { MemoriesRepository } from '../core/repositories/memories.repository';
import { MemoriesModel } from '../core/domain';

export class MemoriesServiceImpl implements MemoriesService {
  private memoriesRepository = inject(MemoriesRepository);

  constructor() {}

  generate(directoryGuids: string[]): Observable<{ message: string }> {
    return this.memoriesRepository.generate(directoryGuids);
  }

  get(): Observable<MemoriesModel[]> {
    return this.memoriesRepository.get();
  }

  getSources(memoryId: string): Observable<string[]> {
    return this.memoriesRepository.getSources(memoryId);
  }

  getStreamUrl(pathToFile: string): string {
    return this.memoriesRepository.getStreamUrl(pathToFile);
  }
}
