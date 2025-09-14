import { Observable } from 'rxjs';
import { environment } from '../../../config/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectionModel } from '../../core/domain';
import { ConnectionsRepository } from '../../core/repositories';

export class ConnectionsRepositoryImpl implements ConnectionsRepository {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getConnections(): Observable<ConnectionModel[]> {
    return this.http.get<ConnectionModel[]>(`${this.baseUrl}/connections`);
  }

  createConnections(
    connections: Partial<ConnectionModel>[]
  ): Observable<ConnectionModel[]> {
    return this.http.post<ConnectionModel[]>(
      `${this.baseUrl}/connections`,
      connections
    );
  }
}
