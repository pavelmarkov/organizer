import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ConnectionsService } from "../services/connections";
import { ConnectionEntity } from "../entities";

@Controller("connections")
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  getConnections(
    @Query("directoryId") directoryId: string
  ): Promise<ConnectionEntity[]> {
    return this.connectionsService.get({ directoryId });
  }

  @Post()
  createConnections(
    @Body() params: ConnectionEntity[]
  ): Promise<ConnectionEntity[]> {
    return this.connectionsService.create(params);
  }
}
