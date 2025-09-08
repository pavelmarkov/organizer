import { Observable } from 'rxjs';
import { TagModel } from '../domain';

export abstract class TagsRepository {
  abstract getTags(): Observable<TagModel[]>;
}
