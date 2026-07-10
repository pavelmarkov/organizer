import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { TagEntity } from "../../entities";
import { TagsService } from "./tags.service";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { TagRepository } from "./tags.repository";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [TagEntity] }),
    AsyncLocalStorageModule,
  ],
  providers: [TagsService, TagRepository],
  exports: [TagsService],
})
export class TagsModule {}
