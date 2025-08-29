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
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DataService } from '../../shared/services/data.service';
import { PROJECT_HEADER } from '../../core/const';

export class DirectoryRepositoryImpl implements DirectoryRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private dataService: DataService = inject(DataService);
  private currentProjectId: string | null = null;

  constructor() {
    this.dataService.currentProject.subscribe((data) => {
      this.currentProjectId = data;
    });
  }

  getDirectory(
    params: GetDirectoryRequestDto
  ): Observable<GetDirectoryResponseDto> {
    let queryParams = new HttpParams();
    if (params.parentId) {
      queryParams = queryParams.set('parentId', params.parentId);
    }

    let headers = new HttpHeaders();
    console.log('this.currentProjectId ', this.currentProjectId);
    if (this.currentProjectId) {
      headers = headers.append(PROJECT_HEADER, this.currentProjectId);
    }
    console.log(headers);

    return this.http.get<GetDirectoryResponseDto>(`${this.baseUrl}/directory`, {
      headers,
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
