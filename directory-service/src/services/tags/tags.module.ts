import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { TagEntity } from "../../entities";
import { TagsService } from "./tags.service";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TagEntity] })],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
