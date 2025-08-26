import { Observable } from 'rxjs';
import { NotesService } from '../core/services/';
import { NotesRepository } from '../core/repositories';
import { NoteModel } from '../core/domain';

export class NotesServiceImpl implements NotesService {
  constructor(private notesRepository: NotesRepository) {}

  getNotes(): Observable<NoteModel[]> {
    return this.notesRepository.getNotes();
  }
}
