import { Observable } from 'rxjs';
import { DirectoryRepository } from '../../core/repositories';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CardModel, DirectoryModel } from '../../core/domain';

export class DirectoryRepositoryImpl implements DirectoryRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getDirectory(
    params: Partial<DirectoryModel>,
    pagination: { offset: number; limit: number },
  ): Observable<DirectoryModel[]> {
    let queryParams = new HttpParams();

    if (params.parentId) {
      queryParams = queryParams.set('parentId', params.parentId);
    }

    if (params.directoryId) {
      queryParams = queryParams.set('directoryId', params.directoryId);
    }

    if (pagination.offset || pagination.offset === 0) {
      queryParams = queryParams.set('offset', pagination.offset);
    }
    if (pagination.limit) {
      queryParams = queryParams.set('limit', pagination.limit);
    }

    return this.http.get<DirectoryModel[]>(`${this.baseUrl}/directory`, {
      params: queryParams,
    });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/directory/count`);
  }

  processDirectory(directoryGuids: string[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/directory/process`,
      {
        directoryGuids,
      },
    );
  }

  importDirectory(
    directoryStructure: Partial<DirectoryModel>[],
  ): Observable<Partial<DirectoryModel>[]> {
    return this.http.post<Partial<DirectoryModel>[]>(
      `${this.baseUrl}/directory`,
      directoryStructure,
    );
  }

  update(
    directories: Partial<DirectoryModel>[],
  ): Observable<Partial<DirectoryModel>[]> {
    return this.http.put<Partial<DirectoryModel>[]>(
      `${this.baseUrl}/directory`,
      directories,
    );
  }

  view(directoryId: string): Observable<CardModel> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('directoryId', directoryId);

    return this.http.get<CardModel>(`${this.baseUrl}/directory/view`, {
      params: queryParams,
    });
  }

  remove(
    directories: Partial<DirectoryModel>[],
  ): Observable<Partial<DirectoryModel>[]> {
    return this.http.delete<Partial<DirectoryModel>[]>(
      `${this.baseUrl}/directory`,
      {
        body: directories,
      },
    );
  }
}
