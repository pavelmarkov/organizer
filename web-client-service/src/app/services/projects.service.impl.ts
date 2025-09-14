import { Observable } from 'rxjs';
import { ProjectsService } from '../core/services/';
import { ProjectsRepository } from '../core/repositories';
import { ProjectModel } from '../core/domain';
import { inject } from '@angular/core';

export class ProjectsServiceImpl implements ProjectsService {
  private projectsRepository = inject(ProjectsRepository);

  constructor() {}

  getProjects(): Observable<ProjectModel[]> {
    return this.projectsRepository.getProjects();
  }
}
