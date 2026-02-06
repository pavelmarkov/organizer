import { DirectoryEntity } from "src/entities";

export class ProcessMediaMessageRequestDto {
  directories: Pick<DirectoryEntity, "directoryId" | "path">[];
}

export class ProcessMediaMessageResponseDto {
  directories: (Pick<DirectoryEntity, "directoryId" | "path" | "info"> & {
    errors: [];
  })[];
}
