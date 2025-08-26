import { Observable } from 'rxjs';
import { NoteModel } from '../domain';

export abstract class NotesService {
  abstract getNotes(): Observable<NoteModel[]>;
}
