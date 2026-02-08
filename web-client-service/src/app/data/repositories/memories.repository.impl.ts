import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MemoriesRepository } from '../../core/repositories/memories.repository';
import { MemoriesModel, MemorySourceModel } from '../../core/domain';
import { GenerateMemoriesRequestDto } from '../../core/dtos';

export class MemoriesRepositoryImpl implements MemoriesRepository {
  private baseUrl: string = `${environment.apiUrl}/memories`;
  private frontendUrl: string = `${environment.frontendUrl}`;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  get(): Observable<MemoriesModel[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('offset', 0);
    queryParams = queryParams.set('limit', 200);

    return this.http.get<MemoriesModel[]>(this.baseUrl, {
      params: queryParams,
    });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  create(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]> {
    return this.http.post<Partial<MemoriesModel>[]>(this.baseUrl, memories);
  }

  update(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]> {
    return this.http.put<Partial<MemoriesModel>[]>(this.baseUrl, memories);
  }

  remove(
    memories: Partial<MemoriesModel>[],
  ): Observable<Partial<MemoriesModel>[]> {
    return this.http.delete<Partial<MemoriesModel>[]>(this.baseUrl, {
      body: memories,
    });
  }

  generate(
    params: GenerateMemoriesRequestDto,
  ): Observable<{ message: string }> {
    console.log(params);
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/generator`,
      params,
    );
  }

  getSources(memoryId: string): Observable<MemorySourceModel[]> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('memoryId', memoryId);
    return this.http.get<MemorySourceModel[]>(`${this.baseUrl}/sources`, {
      params: queryParams,
    });
  }

  getDirectoryUrl(params: {
    directoryId: string;
    projectId: string;
    startTime: number;
  }): string {
    const { directoryId, projectId, startTime } = params;
    return `${this.frontendUrl}/directory/${directoryId};projectId=${projectId};startTime=${startTime}`;
  }
}
