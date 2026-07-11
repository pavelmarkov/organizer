import { Observable } from 'rxjs';
import { NotesService, PreviewService } from '../core/services/';
import { PreviewRepository } from '../core/repositories';
import { CardModel, NoteModel } from '../core/domain';
import { inject } from '@angular/core';
import { AddPreviewResponseDto } from '../core/dtos';

export class PreviewServiceImpl implements PreviewService {
  private previewRepository = inject(PreviewRepository);

  constructor() {}

  add(entityId: string, file: File): Observable<AddPreviewResponseDto> {
    return this.previewRepository.add(entityId, file);
  }
}
