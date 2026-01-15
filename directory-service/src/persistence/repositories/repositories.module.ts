import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DirectoryEntity, MemoryEntity } from "../../entities";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { MemoriesRepository } from "./memories.repository";

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [DirectoryEntity, MemoryEntity],
    }),
    AsyncLocalStorageModule,
  ],
  providers: [MemoriesRepository],
  exports: [MemoriesRepository],
})
export class RepositoriesModule {}
