import { Observable } from 'rxjs';

export abstract class MemoriesService {
  abstract generate(directoryGuids: string[]): Observable<{ message: string }>;
  abstract get(): Observable<string[]>;
  abstract getStreamUrl(pathToFile: string): string;
}
