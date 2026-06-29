import { Observable } from 'rxjs';
import { CardModel, NoteModel } from '../domain';

export abstract class NotesRepository {
  abstract getNotes(
    params: Partial<NoteModel>,
    pagination: { offset?: number; limit?: number },
  ): Observable<NoteModel[]>;

  abstract count(): Observable<number>;

  abstract create(
    notes: Partial<NoteModel>[],
  ): Observable<Partial<NoteModel>[]>;

  abstract update(
    notes: Partial<NoteModel>[],
  ): Observable<Partial<NoteModel>[]>;

  abstract remove(
    notes: Partial<NoteModel>[],
  ): Observable<Partial<NoteModel>[]>;

  abstract view(noteId: string): Observable<CardModel>;
}
