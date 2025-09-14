import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ConnectionEntity } from "../../entities";
import { ConnectionsService } from "./connections.service";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [ConnectionEntity] }),
    AsyncLocalStorageModule,
  ],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
