import { Observable } from 'rxjs';
import { ProjectsService } from '../core/services/';
import { ProjectsRepository } from '../core/repositories';
import { ProjectModel } from '../core/domain';

export class ProjectsServiceImpl implements ProjectsService {
  constructor(private notesRepository: ProjectsRepository) {}

  getProjects(): Observable<ProjectModel[]> {
    return this.notesRepository.getProjects();
  }
}
