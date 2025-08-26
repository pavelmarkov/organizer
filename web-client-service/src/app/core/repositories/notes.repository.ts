import { Observable } from 'rxjs';
import { NoteModel } from '../domain';

export abstract class NotesRepository {
  abstract getNotes(): Observable<NoteModel[]>;
}
