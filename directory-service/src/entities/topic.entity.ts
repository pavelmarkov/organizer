import { Entity, PrimaryKey, Property } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";

@Entity({ tableName: "notes" })
export class NoteEntity {
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
