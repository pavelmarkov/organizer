import { Observable } from 'rxjs';
import { ProjectModel } from '../domain';

export abstract class ProjectsService {
  abstract getProjects(): Observable<ProjectModel[]>;
}
