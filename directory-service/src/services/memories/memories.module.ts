import { Module } from "@nestjs/common";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { MemoriesService } from "./memories.service";
import { MediaModule } from "../../infrastructure/media";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MemoryEntity } from "../../entities";
import { RepositoriesModule } from "../../persistence/repositories";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [MemoryEntity] }),
    AsyncLocalStorageModule,
    MediaModule,
    RepositoriesModule,
  ],
  providers: [MemoriesService],
  exports: [MemoriesService],
})
export class MemoriesModule {}
