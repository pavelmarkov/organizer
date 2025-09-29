import { Observable } from 'rxjs';
import { TagModel } from '../domain';

export abstract class TagsService {
  abstract getTags(): Observable<TagModel[]>;
  abstract create(items: Partial<TagModel>[]): Observable<Partial<TagModel>[]>;
}
