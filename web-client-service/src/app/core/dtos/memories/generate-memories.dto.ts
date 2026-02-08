import { DirectoryModel } from '../../domain';

interface TimeIntervalDto {
  start: number;
  end: number;
}

export interface GenerateMemoriesRequestDto {
  directories: (Pick<DirectoryModel, 'directoryId'> & {
    interval?: TimeIntervalDto;
  })[];
  memoryGuid: string | null;
}
