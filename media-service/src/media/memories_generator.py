import os
from typing import List
from src.config.files import get_settings
import random
import os
import ffmpeg
from pprint import pprint


class MemoriesGenerator():
    def __init__(self, memory_guid: str, paths: List[str]):
        config = get_settings()
        self.memory_guid = memory_guid
        self.save_to_path = config.memories_path + '/' + self.memory_guid
        self.paths: List[str] = paths

    def prepare(self):
        if not os.path.exists(self.save_to_path):
            os.makedirs(self.save_to_path)

    def get_random_intervals(self, full_length, numer_of_intervals_range, interval_length_range):
        intervals = []

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

    def get_summary_video(self):
        for file_path in self.paths:
            video_file = ffmpeg.probe(file_path)
            print("video info: ")
            pprint(video_file, indent=2)
            duration = int(float(video_file["format"]["duration"]))
            intervals = self.get_random_intervals(duration, (2, 3), (7, 10))
            for interval in intervals:
                clip_duration = interval[1] - interval[0]
                filename = os.path.basename(file_path)
                output_file = os.path.join(
                    self.save_to_path, f"{interval[0]}_{interval[1]}_{filename}")
                try:
                    (
                        ffmpeg
                        .input(file_path, ss=interval[0], t=clip_duration)
                        # '-c copy' copies streams without re-encoding
                        .output(output_file, c='copy')
                        .run(overwrite_output=True)
                    )
                    print(f"Video clip copied successfully to {output_file}")
                except ffmpeg.Error as e:
                    print(f"Error: {e.stderr.decode()}")
                    continue

        return

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
