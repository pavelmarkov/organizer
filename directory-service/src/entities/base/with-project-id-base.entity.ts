import { ManyToOne } from "@mikro-orm/core";
import { ProjectEntity } from "../project.entity";

export class WithProjectIdBaseEntity {
  @ManyToOne({
    primary: false,
    joinColumn: "project_id",
    nullable: true,
    index: true,
  })
  projectId: ProjectEntity;
}
