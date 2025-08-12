import { Observable } from 'rxjs';
import {
  GetDirectoryRequestDto,
  GetDirectoryResponseDto,
  ImportDirectoryStructureRequestDto,
  ImportDirectoryStructureResponseDto,
} from '../core/dtos';
import { DirectoryService } from '../core/services/';
import { DirectoryRepository } from '../core/repositories';

export class DirectoryServiceImpl implements DirectoryService {
  constructor(private directoryRepository: DirectoryRepository) {}

  getDirectory(
    params: GetDirectoryRequestDto
  ): Observable<GetDirectoryResponseDto> {
    return this.directoryRepository.getDirectory(params);
  }

  processDirectory(
    directoryGuids: string[]
  ): Observable<GetDirectoryResponseDto> {
    return this.directoryRepository.processDirectory(directoryGuids);
  }

  importDirectory(
    directoryStructure: ImportDirectoryStructureRequestDto
  ): Observable<ImportDirectoryStructureResponseDto> {
    return this.directoryRepository.importDirectory(directoryStructure);
  }
}
