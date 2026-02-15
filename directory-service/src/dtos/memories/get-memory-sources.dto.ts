class ClipInfoDto {
  durationInSeconds: number;
  startTimeInSeconds: number;
  endTimeInSeconds: number;
}

export class MemorySourceDto {
  id: string;
  name: string;
  directoryId: string;
  memoryId: string;
  source: string;
  info: ClipInfoDto;
}
