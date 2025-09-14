import { Observable } from 'rxjs';
import { ConnectionsService } from '../core/services/';
import { ConnectionsRepository } from '../core/repositories';
import { ConnectionModel } from '../core/domain';
import { inject } from '@angular/core';

export class ConnectionsServiceImpl implements ConnectionsService {
  private connectionsRepository = inject(ConnectionsRepository);

  constructor() {}

  getConnections(
    params: Partial<ConnectionModel>
  ): Observable<ConnectionModel[]> {
    return this.connectionsRepository.getConnections(params);
  }

  createConnections(
    connections: Partial<ConnectionModel>[]
  ): Observable<Partial<ConnectionModel>[]> {
    return this.connectionsRepository.createConnections(connections);
  }
}
