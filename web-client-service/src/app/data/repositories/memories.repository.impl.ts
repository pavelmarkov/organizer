import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MemoriesRepository } from '../../core/repositories/memories.repository';
import { MemoriesModel, MemorySourceModel } from '../../core/domain';

export class MemoriesRepositoryImpl implements MemoriesRepository {
  private baseUrl: string = `${environment.apiUrl}/memories`;
  private frontendUrl: string = `${environment.frontendUrl}`;
  private mediaUrl: string = environment.mediaUrl;
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

  generate(directoryGuids: string[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/generator`, {
      directoryGuids,
    });
  }

  getSources(memoryId: string): Observable<MemorySourceModel[]> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('memoryId', memoryId);
    return this.http.get<MemorySourceModel[]>(`${this.baseUrl}/sources`, {
      params: queryParams,
    });
  }

  getStreamUrl(pathToFile: string): string {
    return `${this.mediaUrl}/api/v1/clips/stream?path_to_file=${encodeURIComponent(pathToFile)}&directory_id=k`;
  }

  getDirectoryUrl(params: { directoryId: string; projectId: string }): string {
    const { directoryId, projectId } = params;
    return `${this.frontendUrl}/directory/${directoryId};projectId=${projectId}`;
  }
}
