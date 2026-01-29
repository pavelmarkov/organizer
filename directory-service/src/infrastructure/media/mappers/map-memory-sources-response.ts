import { GetMemorySourcesDto } from "../../../dtos";

class MediaServiceClipInfoDto {
  duration_in_seconds: number;
  start_time_in_seconds: number;
  end_time_in_seconds: number;
}

export class MediaServiceGetMemorySourcesDto {
  id: string;
  name: string;
  directory_id: string;
  memory_id: string;
  path: string;
  info: MediaServiceClipInfoDto;
}

export function mapMemorySources(
  params: MediaServiceGetMemorySourcesDto[],
): GetMemorySourcesDto[] {
  return params.map((source) => {
    const info = {
      durationInSeconds: source.info.duration_in_seconds,
      startTimeInSeconds: source.info.start_time_in_seconds,
      endTimeInSeconds: source.info.end_time_in_seconds,
    };

    const sourceMapped = {
      id: source.id,
      name: source.name,
      directoryId: source.directory_id,
      memoryId: source.memory_id,
      path: source.path,
      info: info,
    };

    return sourceMapped;
  });
}
