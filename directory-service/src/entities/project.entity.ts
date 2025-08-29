import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "projects" })
export class ProjectEntity {
  @PrimaryKey({ type: "uuid" })
  projectId: string;

  @Property()
  name: string;

  @Property({ type: "array" })
  participants: string[];
}
