import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NoteModel } from '../../core/domain';
import { NotesRepository } from '../../core/repositories';

export class NotesRepositoryImpl implements NotesRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getNotes(): Observable<NoteModel[]> {
    return this.http.get<NoteModel[]>(`${this.baseUrl}/notes`);
  }
}
