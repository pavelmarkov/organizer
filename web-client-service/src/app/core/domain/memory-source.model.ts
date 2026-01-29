interface MemoryInfo {
  durationInSeconds: number;
  startTimeInSeconds: number;
  endTimeInSeconds: number;
}

export interface MemorySourceModel {
  name: string;
  directoryId: string;
  memoryId: string;
  path: string;
  source?: string;
  info: MemoryInfo;
}
