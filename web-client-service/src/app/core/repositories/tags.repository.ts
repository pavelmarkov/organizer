import { Observable } from 'rxjs';
import { CardModel, TagModel } from '../domain';

export abstract class TagsRepository {
  abstract getTags(
    params: Partial<TagModel>,
    pagination: { offset?: number; limit?: number },
  ): Observable<TagModel[]>;

  abstract count(): Observable<number>;

  abstract create(notes: Partial<TagModel>[]): Observable<Partial<TagModel>[]>;

  abstract update(notes: Partial<TagModel>[]): Observable<Partial<TagModel>[]>;

  abstract remove(notes: Partial<TagModel>[]): Observable<Partial<TagModel>[]>;

  abstract view(noteId: string): Observable<CardModel>;
}
