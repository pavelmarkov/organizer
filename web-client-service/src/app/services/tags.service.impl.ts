import { Observable } from 'rxjs';
import { TagsService } from '../core/services/';
import { TagsRepository } from '../core/repositories';
import { TagModel } from '../core/domain';
import { inject } from '@angular/core';

export class TagsServiceImpl implements TagsService {
  private tagsRepository = inject(TagsRepository);

  constructor() {}

  getTags(): Observable<TagModel[]> {
    return this.tagsRepository.getTags();
  }
}
