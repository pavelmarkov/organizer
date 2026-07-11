import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { TagEntity } from "../../entities";
import { TagsService } from "./tags.service";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { TagRepository } from "./tags.repository";
import { MediaModule } from "../../infrastructure/media";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [TagEntity] }),
    AsyncLocalStorageModule,
    MediaModule,
  ],
  providers: [TagsService, TagRepository],
  exports: [TagsService],
})
export class TagsModule {}
