class ClipInfoDto {
  durationInSeconds: number;
  startTimeInSeconds: number;
  endTimeInSeconds: number;
}

export class GetMemorySourcesDto {
  id: string;
  name: string;
  directoryId: string;
  memoryId: string;
  path: string;
  info: ClipInfoDto;
}
