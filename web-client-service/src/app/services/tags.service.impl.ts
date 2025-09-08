import { Observable } from 'rxjs';
import { TagsService } from '../core/services/';
import { TagsRepository } from '../core/repositories';
import { TagModel } from '../core/domain';

export class TagsServiceImpl implements TagsService {
  constructor(private tagsRepository: TagsRepository) {}

  getTags(): Observable<TagModel[]> {
    return this.tagsRepository.getTags();
  }
}
