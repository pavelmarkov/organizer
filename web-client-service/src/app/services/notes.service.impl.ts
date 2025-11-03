import { Observable } from 'rxjs';
import { NotesService } from '../core/services/';
import { NotesRepository } from '../core/repositories';
import { CardModel, NoteModel } from '../core/domain';
import { inject } from '@angular/core';

export class NotesServiceImpl implements NotesService {
  private notesRepository = inject(NotesRepository);

  constructor() {}

  getNotes(
    params: Partial<NoteModel>,
    pagination: { offset: number; limit: number }
  ): Observable<NoteModel[]> {
    return this.notesRepository.getNotes(params, pagination);
  }

  count(): Observable<number> {
    return this.notesRepository.count();
  }

  update(directories: Partial<NoteModel>[]): Observable<Partial<NoteModel>[]> {
    return this.notesRepository.update(directories);
  }

  view(directoryId: string): Observable<CardModel> {
    return this.notesRepository.view(directoryId);
  }
}
