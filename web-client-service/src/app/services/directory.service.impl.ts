import { Observable } from 'rxjs';
import { GetDirectoryRequestDto, GetDirectoryResponseDto } from '../core/dtos';
import { DirectoryService } from '../core/services/';
import { DirectoryRepository } from '../core/repositories';
import { DataService } from '../shared/services/data.service';

export class DirectoryServiceImpl implements DirectoryService {
  constructor(private directoryRepository: DirectoryRepository) {}

  getDirectory(
    params: GetDirectoryRequestDto
  ): Observable<GetDirectoryResponseDto> {
    return this.directoryRepository.getDirectory(params);
  }
}
