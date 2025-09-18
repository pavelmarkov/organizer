import { Module } from "@nestjs/common";
import { DirectoryService } from "./directory.service";
import { MediaModule } from "../../infrastructure/media";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DirectoryEntity } from "../../entities";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { ConfigModule } from "../../shared/config";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [DirectoryEntity] }),
    MediaModule,
    AsyncLocalStorageModule,
    ConfigModule,
  ],
  providers: [DirectoryService],
  exports: [DirectoryService],
})
export class DirectoryModule {}
