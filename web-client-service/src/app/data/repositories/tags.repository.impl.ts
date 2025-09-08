import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TagModel } from '../../core/domain';
import { TagsRepository } from '../../core/repositories';

export class TagsRepositoryImpl implements TagsRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getTags(): Observable<TagModel[]> {
    return this.http.get<TagModel[]>(`${this.baseUrl}/tags`);
  }
}
