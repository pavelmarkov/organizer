interface MemoryInfo {
  durationInSeconds: number;
  startTimeInSeconds: number;
  endTimeInSeconds: number;
}

export class MemorySourceModel {
  id: string;
  name: string;
  directoryId: string;
  memoryId: string;
  source: string;
  info: MemoryInfo;

  constructor() {
    this.id = '';
    this.name = '';
    this.directoryId = '';
    this.memoryId = '';
    this.source = '';
    this.info = {
      durationInSeconds: 0,
      startTimeInSeconds: 0,
      endTimeInSeconds: 0,
    };
  }
}
