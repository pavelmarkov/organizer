import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { WithProjectIdBaseEntity } from "./base";

@Entity({ tableName: "tags" })
export class TagEntity extends WithProjectIdBaseEntity {
  @PrimaryKey({ type: "uuid" })
  tagId: string;

  @Property({ type: "uuid", nullable: true })
  parentId: string;

  @Property({ unique: true })
  name: string;

  @Property({ nullable: true })
  description: string;
}
