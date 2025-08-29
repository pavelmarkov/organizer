import { Observable } from 'rxjs';
import { ProjectModel } from '../domain';

export abstract class ProjectsRepository {
  abstract getProjects(): Observable<ProjectModel[]>;
}
