import { Observable } from 'rxjs';
import { TagsService } from '../core/services/';
import { TagsRepository } from '../core/repositories';
import { CardModel, TagModel } from '../core/domain';
import { inject } from '@angular/core';

export class TagsServiceImpl implements TagsService {
  private tagsRepository = inject(TagsRepository);

  constructor() {}

  getTags(
    params: Partial<TagModel>,
    pagination: { offset?: number; limit?: number },
  ): Observable<TagModel[]> {
    return this.tagsRepository.getTags(params, pagination);
  }

  count(): Observable<number> {
    return this.tagsRepository.count();
  }

  create(tags: Partial<TagModel>[]): Observable<Partial<TagModel>[]> {
    return this.tagsRepository.create(tags);
  }

  update(tags: Partial<TagModel>[]): Observable<Partial<TagModel>[]> {
    return this.tagsRepository.update(tags);
  }

  remove(tags: Partial<TagModel>[]): Observable<Partial<TagModel>[]> {
    return this.tagsRepository.remove(tags);
  }

  view(directoryId: string): Observable<CardModel> {
    return this.tagsRepository.view(directoryId);
  }
}
