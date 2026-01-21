import { Observable } from 'rxjs';
import { MemoriesModel } from '../domain';

export abstract class MemoriesRepository {
  abstract generate(directoryGuids: string[]): Observable<{ message: string }>;
  abstract get(): Observable<MemoriesModel[]>;
  abstract getSources(memoryId: string): Observable<string[]>;
  abstract getStreamUrl(pathToFile: string): string;
}
