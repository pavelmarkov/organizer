import { Observable } from 'rxjs';
import {
  GetDirectoryRequestDto,
  GetDirectoryResponseDto,
  ImportDirectoryStructureRequestDto,
  ImportDirectoryStructureResponseDto,
} from '../../core/dtos';
import { DirectoryRepository } from '../../core/repositories';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export class DirectoryRepositoryImpl implements DirectoryRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getDirectory(
    params: GetDirectoryRequestDto
  ): Observable<GetDirectoryResponseDto> {
    let queryParams = new HttpParams();
    if (params.parentId) {
      queryParams = queryParams.set('parentId', params.parentId);
    }

    return this.http.get<GetDirectoryResponseDto>(`${this.baseUrl}/directory`, {
      params: queryParams,
    });
  }

  processDirectory(
    directoryGuids: string[]
  ): Observable<GetDirectoryResponseDto> {
    return this.http.post<GetDirectoryResponseDto>(
      `${this.baseUrl}/directory/process`,
      {
        directoryGuids,
      }
    );
  }

  importDirectory(
    directoryStructure: ImportDirectoryStructureRequestDto
  ): Observable<ImportDirectoryStructureResponseDto> {
    return this.http.post<ImportDirectoryStructureResponseDto>(
      `${this.baseUrl}/directory/import`,
      directoryStructure
    );
  }
}
