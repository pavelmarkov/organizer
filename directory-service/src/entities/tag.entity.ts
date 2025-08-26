import { Entity, PrimaryKey, Property } from "@mikro-orm/sqlite";

@Entity({ tableName: "tags" })
export class TagEntity {
  @PrimaryKey({ type: "uuid" })
  tagId: string;

  @Property()
  name: string;

  @Property()
  description: string;
}
