import { Observable } from 'rxjs';
import { MemoriesService } from '../core/services/';
import { inject } from '@angular/core';
import { MemoriesRepository } from '../core/repositories/memories.repository';

export class MemoriesServiceImpl implements MemoriesService {
  private memoriesRepository = inject(MemoriesRepository);

  constructor() {}

  generate(directoryGuids: string[]): Observable<{ message: string }> {
    return this.memoriesRepository.generate(directoryGuids);
  }

  get(): Observable<string[]> {
    return this.memoriesRepository.get();
  }

  getStreamUrl(pathToFile: string): string {
    return this.memoriesRepository.getStreamUrl(pathToFile);
  }
}
