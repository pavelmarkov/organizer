import { Observable } from 'rxjs';
import { ConnectionModel } from '../domain';

export abstract class ConnectionsRepository {
  abstract getConnections(
    params: Partial<ConnectionModel>
  ): Observable<ConnectionModel[]>;

  abstract createConnections(
    connections: Partial<ConnectionModel>[]
  ): Observable<Partial<ConnectionModel>[]>;
}
