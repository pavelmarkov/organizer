import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { WithProjectIdBaseEntity } from "./base";

@Entity({ tableName: "directory" })
export class DirectoryEntity extends WithProjectIdBaseEntity {
  @PrimaryKey({ type: "uuid" })
  directoryId: string;

  @Property({ type: "uuid", nullable: true })
  parentId: string;

  @Property()
  name: string;

  @Property({ type: "boolean" })
  isFolder: boolean;

  @Property({ nullable: true })
  fileType: string;

  @Property()
  size: number;

  @Property({ unique: true })
  path: string;
}
