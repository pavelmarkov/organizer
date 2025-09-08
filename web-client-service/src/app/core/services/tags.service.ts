import { Observable } from 'rxjs';
import { TagModel } from '../domain';

export abstract class TagsService {
  abstract getTags(): Observable<TagModel[]>;
}
