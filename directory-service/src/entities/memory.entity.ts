import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { WithProjectIdBaseEntity } from "./base";

@Entity({ tableName: "memories" })
export class MemoryEntity extends WithProjectIdBaseEntity {
  @PrimaryKey({ type: "uuid" })
  id: string;

  @Property({ unique: true })
  name: string;

  @Property()
  description: string;
}
