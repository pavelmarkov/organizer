import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MemoriesRepository } from '../../core/repositories/memories.repository';

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
      }
    );
  }

  get(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/memories`);
  }

  getStreamUrl(pathToFile: string): string {
    return `${this.mediaUrl}/api/v1/media/stream?path_to_file=${pathToFile}&directory_id=k`;
  }
}
