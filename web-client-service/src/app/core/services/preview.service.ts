import { Observable } from 'rxjs';
import { AddPreviewResponseDto } from '../dtos';

export abstract class PreviewService {
  abstract add(entityId: string, file: File): Observable<AddPreviewResponseDto>;
}
