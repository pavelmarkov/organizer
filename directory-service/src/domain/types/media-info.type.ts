export class MediaInfo {
  constructor() {
    this.durationInSeconds = null;
    this.minutes = null;
    this.seconds = null;
    this.width = null;
    this.height = null;
    this.codecName = null;
    this.size = null;
    this.errors = [];
  }

  durationInSeconds: number;
  minutes: number;
  seconds: number;
  width: number;
  height: number;
  codecName: string;
  size: number;
  errors?: string[];
}
