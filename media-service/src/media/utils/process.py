
from fractions import Fraction
from pprint import pprint
from typing import List
import av
import os
from src.config import get_settings
from PIL import Image
from src.media.schemas import MediaInfo
from src.logger.log import logger
from src.media.utils.alloc_subfolder import alloc_subfolder


class VideoProcessor():
    def __init__(self, path):
        config = get_settings()
        self.save_to_path = config.save_to_path
        self.max_files_in_folder = config.max_files_in_folder
        self.path = path

        self.filename = None

        self.container = None

        self.duration = None
        self.duration_in_seconds = None
        self.codec_name = None
        self.width = None
        self.height = None
        self.size: int = None
        self.number_of_frames: int = None
        self.frame_rate: Fraction = None

        self.unique_name = None
        self.full_preview_path = None

        self.errors: List[str] = []

    def findExisting(self, path, fileToCheck):
        for entry in os.listdir(path):
            full_path = os.path.join(path, entry)
            if os.path.isdir(full_path):
                foundEntry = self.findExisting(full_path, fileToCheck)
                if foundEntry:
                    return foundEntry
            else:
                if entry == fileToCheck:
                    return os.path.join(path, entry)
        return None

    def has_errors(self):
        return len(self.errors) > 0

    def allocSubfolder(self) -> str:
        return alloc_subfolder(self.save_to_path, self.max_files_in_folder)

    def prepare(self):
        if not os.path.exists(self.save_to_path):
            os.makedirs(self.save_to_path)

        if not os.path.isfile(self.path):
            self.errors.append('Directory element is not file')
            return

        self.filename = os.path.basename(self.path)

        self.size = os.path.getsize(self.path)

        try:
            self.container = av.open(self.path)
        except:
            self.errors.append('Error opening file')
            return

        if len(self.container.streams.video) < 1:
            self.errors.append('No video stream found in file')
            return

        video_stream = self.container.streams.video[0]

        self.duration = video_stream.duration
        if video_stream.duration:
            self.duration = video_stream.duration
        elif self.container.duration:
            self.duration = self.container.duration // 1000
        else:
            self.errors.append('Duration is not defined')
            return

        if not video_stream.codec_context:
            self.errors.append('Codec context is not defined')
            return

        if not video_stream.time_base:
            self.errors.append('Time base is not defined')
            return

        self.codec_name = video_stream.codec_context.name
        self.width = video_stream.codec_context.width
        self.height = video_stream.codec_context.height

        self.duration_in_seconds = int(self.duration * video_stream.time_base)
        minutes = self.duration_in_seconds // 60
        seconds = self.duration_in_seconds % 60

        self.frame_rate = video_stream.average_rate  # get the frame rate
        if not self.frame_rate:
            self.frame_rate = video_stream.codec_context.rate

        if not self.frame_rate:
            self.errors.append('Framerate is not defined')
            return

        self.number_of_frames = video_stream.frames
        if self.number_of_frames <= 0:
            self.number_of_frames = round(
                self.duration_in_seconds * float(self.frame_rate)
            )

        logger.debug(
            f"Video info: duration={self.duration_in_seconds}, time_base={video_stream.time_base}")

        self.unique_name = f"{self.filename}_{minutes}m{seconds}s_{self.width}x{self.height}.jpeg"

        subfolder = self.allocSubfolder()

        self.full_preview_path = os.path.join(
            self.save_to_path, subfolder, self.unique_name
        )

    def get_media_info(self) -> MediaInfo:
        if len(self.errors):
            logger.error('There are errors while processing file')
            for error in self.errors:
                logger.error(error)
            return None

        return MediaInfo(
            duration_in_seconds=self.duration_in_seconds,
            minutes=self.duration_in_seconds // 60,
            seconds=self.duration_in_seconds % 60,
            width=self.width,
            height=self.height,
            codec_name=self.codec_name,
            unique_name=self.unique_name,
            size=self.size,
        )

    def process_video_file(self):
        if len(self.errors):
            logger.error('There are errors during prepare phase')
            return
        if not self.path:
            logger.error('Path is not provided')
            return
        if not os.path.isfile('/' + self.path):
            logger.error(
                f"Directory element with path={'/' + self.path} is not file")
            return
        if not self.unique_name:
            logger.error('No unique name provided. Run prepare.')
            return
        if os.path.isfile(self.full_preview_path):
            logger.info('File exists, skipping.')
            return

        existing_preview_path = self.findExisting(
            self.save_to_path, self.unique_name)

        if existing_preview_path:
            self.full_preview_path = existing_preview_path
            logger.info('File exists in subdir, skipping.')
            return

        percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90]
        frames = self.__extract_frames(percentiles)

        if len(frames) != len(percentiles):
            self.errors.append(
                f"Expected number of frames is {len(percentiles)}, but received {len(frames)}"
            )
            return

        preview = self.makeSummary(frames)

        preview.save(self.full_preview_path, format="JPEG")

    def makeSummary(self, frames):

        columns = 3
        rows = 3

        x_size = self.width // columns
        y_size = self.height // rows

        new_im = Image.new('RGB', (self.width, self.height))

        index = 0
        for i in range(0, x_size * columns, x_size):
            for j in range(0, y_size * rows, y_size):
                frame = frames[index]
                im = frame["image"]
                im.thumbnail((x_size, y_size))
                new_im.paste(im, (i, j))
                index += 1

        return new_im

    def __findPercentileValues(self, value, percentiles):
        percentileValues = []
        onePercent = value / 100
        for percentile in percentiles:
            percentileValue = round(onePercent * percentile)
            percentileValues.append(percentileValue)
        return percentileValues

    def __extract_frames(self, percentiles):
        frame_indices = self.__findPercentileValues(
            self.number_of_frames, percentiles
        )

        frames = []

        for index in frame_indices:
            # timestamp for that frame_num
            frame_time_in_seconds = int(index / self.frame_rate)
            frame_time_in_microseconds = frame_time_in_seconds * \
                1000000  # 1 second → 1,000,000 μs

            minutes = frame_time_in_seconds // 60
            seconds = frame_time_in_seconds % 60
            logger.debug(f"{minutes}m{seconds}s{index}i")

            # backward=True = seek to that nearest timestamp
            try:
                self.container.seek(frame_time_in_microseconds, backward=True)
            except:
                self.errors.append(f"Error seeking frame at index {i}")
                continue

            # get the next available frame
            max_try = 3
            for i in range(1, max_try):
                try:
                    frame = next(self.container.decode(video=0))
                    break
                except:
                    if i >= max_try:
                        raise 'Max trials has been reached'
                    logger.error('failed getting frame, retry: ', i+2)

            frames.append({
                "image": frame.to_image(),
                "minutes": minutes,
                "seconds": seconds,
                "index": index
            })

        self.container.close()
        return frames
