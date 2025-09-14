import { Injectable } from "@nestjs/common";
import { ConnectionEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";
import { BaseAbstractService } from "../../domain/services";

@Injectable()
export class ConnectionsService
  implements BaseAbstractService<ConnectionEntity>
{
  constructor(
    @InjectRepository(ConnectionEntity)
    private readonly connectionsRepository: EntityRepository<ConnectionEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  async get(params: Partial<ConnectionEntity>): Promise<ConnectionEntity[]> {
    return await this.connectionsRepository.findAll({
      where: params,
    });
  }

  async create(
    connections: Partial<ConnectionEntity[]>
  ): Promise<ConnectionEntity[]> {
    console.log(connections);

    return [];

    connections.forEach((connection) => {
      connection.connectionId = uuidv4();
    });

    return await this.connectionsRepository.upsertMany(connections, {
      onConflictFields: ["directoryId"],
      onConflictAction: "ignore",
    });
  }
}
