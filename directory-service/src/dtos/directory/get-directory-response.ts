import { DirectoryEntity } from "../../entities";

export class DirectoryNodeDto {
  data: DirectoryEntity;
  leaf: boolean;
  children: DirectoryNodeDto[];
}

export class GetDirectoryResponseDto {
  directory: DirectoryNodeDto[];
}
