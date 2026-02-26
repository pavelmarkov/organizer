import os
from typing import List, Tuple
from src.config import get_settings
import random
import os
import ffmpeg
from pprint import pprint

from src.logger.log import logger

from src.clips.schemas import ClipsInfo, UpsertClipsEntityDto, GenerateMemoriesDto


class MemoriesGenerator():
    def __init__(self, params: GenerateMemoriesDto):
        config = get_settings()
        self.max_files_for_memories = 50
        self.memory_guid = params.memory_guid
        self.save_to_path = config.memories_path + '/' + self.memory_guid
        self.directories = params.directories

    def prepare(self):
        if not os.path.exists(self.save_to_path):
            os.makedirs(self.save_to_path)

    def get_random_intervals(self, full_length, numer_of_intervals_range, interval_length_range) -> List[Tuple[int, int]]:
        intervals: List[Tuple[int, int]] = []

        max_interval_length = interval_length_range[1]
        max_numer_of_intervals = numer_of_intervals_range[1]

        if (max_interval_length * 2 > full_length):
            return intervals

        if (max_numer_of_intervals < 1):
            return intervals

        cut_length = full_length - max_interval_length

        number_of_intervals = random.randint(*numer_of_intervals_range)

        # random_start_points = random.sample(
        #     range(max_interval_length, cut_length), number_of_intervals)

        mean = cut_length // 2
        std_dev = mean // 4
        random_start_points = [int(random.normalvariate(
            mu=mean, sigma=std_dev)) for _ in range(number_of_intervals)]

        for start_point in sorted(random_start_points):
            interval_length = random.randint(*interval_length_range)
            end_point = start_point + interval_length
            random_interval = (start_point, end_point)
            intervals.append(random_interval)

        return intervals

    def generate_memories(self) -> List[UpsertClipsEntityDto]:
        random_files = self.directories.copy()
        random.shuffle(random_files)

        index = 1

        logger.info(
            f"Star generating memories from {len(random_files)} files"
        )

        clips: List[UpsertClipsEntityDto] = []

        for file in random_files:
            file_path = file.path
            try:
                ffmpeg.probe(file_path)
            except:
                continue
            video_file = ffmpeg.probe(file_path)
            filename = os.path.basename(file_path)
            logger.debug(f"Processing file {filename}")
            # print("video info: ")
            # pprint(video_file, indent=2)
            duration = int(float(video_file["format"]["duration"]))

            intervals: List[Tuple[int, int]] = []
            if file.interval:
                intervals.append((file.interval.start, file.interval.end))
            else:
                intervals = self.get_random_intervals(
                    duration, (2, 3), (14, 21)
                )

            for interval in intervals:
                output_file = os.path.join(
                    self.save_to_path, f"{interval[0]}_{interval[1]}_{filename}")

                clip_duration = self.make_clip(
                    input_file_path=file.path,
                    output_file_path=output_file,
                    start_time_in_seconds=interval[0],
                    end_time_in_seconds=interval[1]
                )

                if not clip_duration:
                    continue

                clips.append(UpsertClipsEntityDto(
                    name=filename,
                    directory_id=file.id,
                    memory_id=self.memory_guid,
                    path=os.path.abspath(output_file),
                    info=ClipsInfo(
                        duration_in_seconds=clip_duration,
                        start_time_in_seconds=interval[0],
                        end_time_in_seconds=interval[1]
                    )
                ))

            logger.debug(f"Finished processing path number {index}")
            index += 1

            if index >= self.max_files_for_memories:
                logger.info(
                    f"Max number of files to process reached: {index}, returning"
                )
                break

        return clips

    def get_memory_sources(self) -> List[str]:
        paths = []
        if not os.path.isdir(os.path.join(self.save_to_path)):
            return []
        for entry in os.listdir(os.path.join(self.save_to_path)):
            if os.path.basename(entry).startswith('.'):
                continue
            full_path = os.path.join(self.save_to_path, entry)
            if not os.path.isdir(full_path):
                paths.append(
                    os.path.abspath(full_path)
                )

        return paths

    def make_clip(
        self,
        input_file_path: str,
        output_file_path: str,
        start_time_in_seconds: int,
        end_time_in_seconds: int,
    ):
        clip_duration = end_time_in_seconds - start_time_in_seconds
        try:
            (
                ffmpeg
                .input(input_file_path, ss=start_time_in_seconds, t=clip_duration)
                # '-c copy' copies streams without re-encoding
                .output(output_file_path, c='copy', loglevel="quiet")
                .run(overwrite_output=True)
            )
            logger.debug(
                f"Video clip copied successfully to {output_file_path}"
            )
            return clip_duration
        except ffmpeg.Error as e:
            logger.error(f"Error: {e.stderr.decode()}")
            return None
