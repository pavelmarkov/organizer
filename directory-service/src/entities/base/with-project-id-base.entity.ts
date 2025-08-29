import { ManyToOne } from "@mikro-orm/core";
import { ProjectEntity } from "../project.entity";

export class WithProjectIdBaseEntity {
  @ManyToOne({ primary: true, joinColumn: "project_id", nullable: true })
  projectId: ProjectEntity;
}
