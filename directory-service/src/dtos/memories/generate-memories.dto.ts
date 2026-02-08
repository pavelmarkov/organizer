import { DirectoryEntity } from "../../entities";

export class TimeIntervalDto {
  start: number;
  end: number;
}

export class GenerateMemoriesRequestDto {
  directories: (Pick<DirectoryEntity, "directoryId"> & {
    interval?: TimeIntervalDto;
  })[];
  memoryGuid: string;
}

export class GenerateMemoriesDto {
  directories: (Pick<DirectoryEntity, "directoryId" | "path"> & {
    interval?: {
      start: number;
      end: number;
    };
  })[];
  memoryGuid: string;
}
