import {
  ArrayType,
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { WithProjectIdBaseEntity } from "./base";
import { MediaInfo } from "src/domain/types";
import { FileStateEnum } from "src/domain/enums";

@Entity({ tableName: "directory" })
@Unique({ properties: ["path", "projectId"] as never })
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

  @Property({ unique: false, nullable: true })
  path: string;

  @Property({
    type: "array",
    default: [],
    nullable: true,
  })
  tags: string[];

  @Property({
    type: "json",
    default: "{}",
    nullable: true,
  })
  info?: MediaInfo;

  @Enum({
    items: () => FileStateEnum,
    nullable: false,
    default: FileStateEnum.CREATED,
  })
  state?: FileStateEnum;
}
