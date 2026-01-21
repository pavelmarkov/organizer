import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MemoriesRepository } from '../../core/repositories/memories.repository';
import { MemoriesModel } from '../../core/domain';

export class MemoriesRepositoryImpl implements MemoriesRepository {
  private baseUrl: string = environment.apiUrl;
  private mediaUrl: string = environment.mediaUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  generate(directoryGuids: string[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/memories/generator`,
      {
        directoryGuids,
      },
    );
  }

  get(): Observable<MemoriesModel[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('offset', 0);
    queryParams = queryParams.set('limit', 200);

    return this.http.get<MemoriesModel[]>(`${this.baseUrl}/memories`, {
      params: queryParams,
    });
  }

  getSources(memoryId: string): Observable<string[]> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('memoryId', memoryId);
    return this.http.get<string[]>(`${this.baseUrl}/memories/sources`, {
      params: queryParams,
    });
  }

  getStreamUrl(pathToFile: string): string {
    return `${this.mediaUrl}/api/v1/media/stream?path_to_file=${pathToFile}&directory_id=k`;
  }
}
