import { Observable } from 'rxjs';
import { PreviewRepository } from '../../core/repositories';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CardModel, DirectoryModel } from '../../core/domain';
import { AddPreviewResponseDto } from '../../core/dtos';

export class PreviewRepositoryImpl implements PreviewRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  add(entityId: string, file: File): Observable<AddPreviewResponseDto> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('entityId', entityId);

    const formData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<AddPreviewResponseDto>(
      `${this.baseUrl}/previews`,
      formData,
      { params: queryParams },
    );
  }
}
