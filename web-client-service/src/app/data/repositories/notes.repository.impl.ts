import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CardModel, NoteModel } from '../../core/domain';
import { NotesRepository } from '../../core/repositories';

export class NotesRepositoryImpl implements NotesRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getNotes(): Observable<NoteModel[]> {
    return this.http.get<NoteModel[]>(`${this.baseUrl}/notes`);
  }

  update(notes: Partial<NoteModel>[]): Observable<Partial<NoteModel>[]> {
    return this.http.put<Partial<NoteModel>[]>(`${this.baseUrl}/notes`, notes);
  }

  view(noteId: string): Observable<CardModel> {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('noteId', noteId);

    return this.http.get<CardModel>(`${this.baseUrl}/notes/view`, {
      params: queryParams,
    });
  }
}
