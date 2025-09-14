import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "projects" })
export class ProjectEntity {
  @PrimaryKey({ type: "uuid" })
  projectId: string;

  @Property()
  name: string;

  @Property({ default: false })
  default: boolean;

  @Property({ type: "array" })
  participants: string[];
}
