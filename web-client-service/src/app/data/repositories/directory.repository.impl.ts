import { Observable } from 'rxjs';
import { DirectoryRepository } from '../../core/repositories';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DirectoryModel } from '../../core/domain';

export class DirectoryRepositoryImpl implements DirectoryRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getDirectory(params: Partial<DirectoryModel>): Observable<DirectoryModel[]> {
    let queryParams = new HttpParams();
    if (params.parentId) {
      queryParams = queryParams.set('parentId', params.parentId);
    }

    return this.http.get<DirectoryModel[]>(`${this.baseUrl}/directory`, {
      params: queryParams,
    });
  }

  processDirectory(directoryGuids: string[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/directory/process`,
      {
        directoryGuids,
      }
    );
  }

  importDirectory(
    directoryStructure: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]> {
    return this.http.post<Partial<DirectoryModel>[]>(
      `${this.baseUrl}/directory`,
      directoryStructure
    );
  }

  update(
    directories: Partial<DirectoryModel>[]
  ): Observable<Partial<DirectoryModel>[]> {
    return this.http.put<Partial<DirectoryModel>[]>(
      `${this.baseUrl}/directory`,
      directories
    );
  }
}
