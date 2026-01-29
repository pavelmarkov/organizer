import { DirectoryEntity } from "src/entities";

export class GenerateMemoriesDto {
  directoryGuids?: string[];
  directories: Pick<DirectoryEntity, "directoryId" | "path">[];
  memoryGuid: string;
}
