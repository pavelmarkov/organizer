import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { WithProjectIdBaseEntity } from "./base";

@Entity({ tableName: "notes" })
export class NoteEntity extends WithProjectIdBaseEntity {
  @PrimaryKey({ type: "uuid" })
  noteId: string;

  @Property({ unique: true })
  name: string;

  @Property()
  description: string;

  @Property()
  type: string;

  @Property()
  source: string;

  @Property({ type: "array" })
  tags: string[];
}
