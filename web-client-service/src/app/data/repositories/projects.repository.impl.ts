import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectModel } from '../../core/domain';
import { ProjectsRepository } from '../../core/repositories';

export class ProjectsRepositoryImpl implements ProjectsRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.baseUrl}/projects`);
  }
}
