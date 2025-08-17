import { DirectoryEntity } from "src/entities";

export class ProcessMediaMessageRequestDto {
  directory: Pick<DirectoryEntity, "directoryId" | "path">[];
}
