import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CardModel, TagModel } from '../../core/domain';
import { TagsRepository } from '../../core/repositories';

export class TagsRepositoryImpl implements TagsRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getTags(
    params: Partial<TagModel>,
    pagination: { offset?: number; limit?: number },
  ): Observable<TagModel[]> {
    const httpParams: Partial<{
      offset: number;
      limit: number;
      parentId: string;
    }> = {};
    if (pagination.offset || pagination.offset === 0) {
      httpParams.offset = pagination.offset;
    }
    if (pagination.limit) {
      httpParams.limit = pagination.limit;
    }
    if (params.parentId) {
      httpParams.parentId = params.parentId;
    }

    return this.http.get<TagModel[]>(`${this.baseUrl}/tags`, {
      params: httpParams,
    });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/tags/count`);
  }

  update(tags: Partial<TagModel>[]): Observable<Partial<TagModel>[]> {
    return this.http.put<Partial<TagModel>[]>(`${this.baseUrl}/tags`, tags);
  }

  remove(tags: Partial<TagModel>[]): Observable<Partial<TagModel>[]> {
    return this.http.delete<Partial<TagModel>[]>(`${this.baseUrl}/tags`, {
      body: tags,
    });
  }

  create(tags: Partial<TagModel>[]): Observable<Partial<TagModel>[]> {
    return this.http.post<Partial<TagModel>[]>(`${this.baseUrl}/tags`, tags);
  }

  view(tagId: string): Observable<CardModel> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('tagId', tagId);

    return this.http.get<CardModel>(`${this.baseUrl}/tags/view`, {
      params: queryParams,
    });
  }
}
