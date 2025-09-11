import { Observable } from 'rxjs';
import { DirectoryService } from '../core/services/';
import { DirectoryRepository } from '../core/repositories';
import { DirectoryModel } from '../core/domain';

export class DirectoryServiceImpl implements DirectoryService {
  constructor(private directoryRepository: DirectoryRepository) {}

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
}
