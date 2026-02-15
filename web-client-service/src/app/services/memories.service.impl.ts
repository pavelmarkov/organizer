import { Observable } from 'rxjs';
import { MemoriesService } from '../core/services/';
import { inject } from '@angular/core';
import { MemoriesRepository } from '../core/repositories/memories.repository';
import { MemoriesModel, MemorySourceModel } from '../core/domain';
import { GenerateMemoriesRequestDto } from '../core/dtos';

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

  generate(
    params: GenerateMemoriesRequestDto,
  ): Observable<{ message: string }> {
    return this.memoriesRepository.generate(params);
  }

  getSources(memoryId: string): Observable<MemorySourceModel[]> {
    return this.memoriesRepository.getSources(memoryId);
  }

  updateSources(
    params: (Pick<MemorySourceModel, 'id'> & Partial<MemorySourceModel>)[],
  ): Observable<Partial<MemorySourceModel>[]> {
    return this.memoriesRepository.updateSources(params);
  }

  deleteSources(
    params: (Pick<MemorySourceModel, 'id'> & Partial<MemorySourceModel>)[],
  ): Observable<Partial<MemorySourceModel>[]> {
    return this.memoriesRepository.deleteSources(params);
  }

  getDirectoryUrl(params: {
    directoryId: string;
    projectId: string;
    startTime: number;
  }): string {
    return this.memoriesRepository.getDirectoryUrl(params);
  }
}
