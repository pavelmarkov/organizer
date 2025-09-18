import { Observable } from 'rxjs';
import { DirectoryService } from '../core/services/';
import { DirectoryRepository } from '../core/repositories';
import { CardModel, DirectoryModel } from '../core/domain';
import { inject } from '@angular/core';

export class DirectoryServiceImpl implements DirectoryService {
  private directoryRepository = inject(DirectoryRepository);

  constructor() {}

  getDirectory(params: Partial<DirectoryModel>): Observable<DirectoryModel[]> {
    return this.directoryRepository.getDirectory(params);
  }

  processDirectory(directoryGuids: string[]): Observable<{ message: string }> {
    return this.directoryRepository.processDirectory(directoryGuids);
  }

  importDirectory(
    directories: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]> {
    return this.directoryRepository.importDirectory(directories);
  }

  update(
    directories: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]> {
    return this.directoryRepository.update(directories);
  }

  view(directoryId: string): Observable<CardModel> {
    return this.directoryRepository.view(directoryId);
  }
}
