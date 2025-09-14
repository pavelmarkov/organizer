import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { TagEntity } from "./tag.entity";
import { DirectoryEntity } from "./directory.entity";

@Entity({ tableName: "connections" })
export class ConnectionEntity {
  @PrimaryKey({ type: "uuid" })
  connectionId: string;

  @ManyToOne(() => TagEntity, {
    name: "tag_id",
    columnType: "uuid",
    nullable: true,
    referencedColumnNames: ["tag_id"],
  })
  tagId: string;

  @ManyToOne(() => DirectoryEntity, {
    name: "directory_id",
    columnType: "uuid",
    nullable: true,
    referencedColumnNames: ["directory_id"],
  })
  directoryId: string;
}
