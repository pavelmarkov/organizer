import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProjectEntity } from "../../entities";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [ProjectEntity] })],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
