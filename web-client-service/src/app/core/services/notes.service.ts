import { Observable } from 'rxjs';
import { CardModel, NoteModel } from '../domain';

export abstract class NotesService {
  abstract getNotes(
    params: Partial<NoteModel>,
    pagination: { offset: number; limit: number }
  ): Observable<NoteModel[]>;

  abstract count(): Observable<number>;

  abstract update(
    notes: Partial<NoteModel>[]
  ): Observable<Partial<NoteModel>[]>;

  abstract view(noteId: string): Observable<CardModel>;
}
