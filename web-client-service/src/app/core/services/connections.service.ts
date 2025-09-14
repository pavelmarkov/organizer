import { Observable } from 'rxjs';
import { ConnectionModel } from '../domain';

export abstract class ConnectionsService {
  abstract getConnections(
    params: Partial<ConnectionModel>
  ): Observable<ConnectionModel[]>;

  abstract createConnections(
    connections: Partial<ConnectionModel>[]
  ): Observable<Partial<ConnectionModel>[]>;
}
