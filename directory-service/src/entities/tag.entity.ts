import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { WithProjectIdBaseEntity } from "./base";

@Entity({ tableName: "tags" })
export class TagEntity extends WithProjectIdBaseEntity {
  @PrimaryKey({ type: "uuid" })
  tagId: string;

  @Property()
  name: string;

  @Property()
  description: string;
}
