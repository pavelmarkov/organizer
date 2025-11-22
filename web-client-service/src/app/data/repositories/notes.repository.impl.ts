import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CardModel, NoteModel } from '../../core/domain';
import { NotesRepository } from '../../core/repositories';

export class NotesRepositoryImpl implements NotesRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getNotes(
    params: Partial<NoteModel>,
    pagination: { offset: number; limit: number }
  ): Observable<NoteModel[]> {
    const httpParams: Partial<{ offset: number; limit: number }> = {};
    if (pagination.offset || pagination.offset === 0) {
      httpParams.offset = pagination.offset;
    }
    if (pagination.limit) {
      httpParams.limit = pagination.limit;
    }
    return this.http.get<NoteModel[]>(`${this.baseUrl}/notes`, {
      params: httpParams,
    });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/notes/count`);
  }

  update(notes: Partial<NoteModel>[]): Observable<Partial<NoteModel>[]> {
    return this.http.put<Partial<NoteModel>[]>(`${this.baseUrl}/notes`, notes);
  }

  remove(notes: Partial<NoteModel>[]): Observable<Partial<NoteModel>[]> {
    return this.http.delete<Partial<NoteModel>[]>(`${this.baseUrl}/notes`, {
      body: notes,
    });
  }

  create(notes: Partial<NoteModel>[]): Observable<Partial<NoteModel>[]> {
    return this.http.post<Partial<NoteModel>[]>(`${this.baseUrl}/notes`, notes);
  }

  view(noteId: string): Observable<CardModel> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('noteId', noteId);

    return this.http.get<CardModel>(`${this.baseUrl}/notes/view`, {
      params: queryParams,
    });
  }
}
