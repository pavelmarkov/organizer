import { Observable } from 'rxjs';
import { CardModel, NoteModel } from '../domain';

export abstract class NotesRepository {
  abstract getNotes(): Observable<NoteModel[]>;

  abstract update(
    notes: Partial<NoteModel>[]
  ): Observable<Partial<NoteModel>[]>;

  abstract view(noteId: string): Observable<CardModel>;
}
