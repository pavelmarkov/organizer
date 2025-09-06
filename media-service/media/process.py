
import av
import os
from config.files import get_settings
from PIL import Image


class VideoProcessor():
    def __init__(self, path):
        config = get_settings()
        self.save_to_path = config.save_to_path
        self.max_files_in_folder = config.max_files_in_folder
        self.path = path

        self.filename = None

        self.duration = None
        self.codec_name = None
        self.width = None
        self.height = None

        self.unique_name = None
        self.full_preview_path = None

    def checkIfExists(self, path, fileToCheck):
        fileExists = False
        for entry in os.listdir(path):
            full_path = os.path.join(path, entry)
            if os.path.isdir(full_path):
                if self.checkIfExists(full_path, fileToCheck):
                    return True
            else:
                if entry == fileToCheck:
                    return True
        return fileExists

    def allocSubfolder(self):
        start = self.max_files_in_folder
        subdir = None
        existing_directories = {}
        for entry in os.listdir(self.save_to_path):
            full_path = os.path.join(self.save_to_path, entry)
            if os.path.isdir(full_path):
                num_of_files = len(os.listdir(full_path))
                existing_directories[entry] = num_of_files

        for folder, number_of_files in existing_directories.items():
            if number_of_files >= self.max_files_in_folder:
                start += self.max_files_in_folder
                continue
            else:
                subdir = folder
                break

        if not subdir:
            subdir = str(start)

        subdir_path = os.path.join(self.save_to_path, subdir)
        if not os.path.exists(subdir_path):
            os.makedirs(subdir_path)

        return subdir

    def prepare(self):
        if not os.path.exists(self.save_to_path):
            os.makedirs(self.save_to_path)

        self.filename = os.path.basename(self.path)

        container = av.open(self.path)
        video_stream = container.streams.video[0]

        self.duration = video_stream.duration
        self.codec_name = video_stream.codec_context.name
        self.width = video_stream.codec_context.width
        self.height = video_stream.codec_context.height

        duration_in_seconds = int(self.duration * video_stream.time_base)
        minutes = duration_in_seconds // 60
        seconds = duration_in_seconds % 60

        print(self.duration, video_stream.time_base,
              duration_in_seconds, minutes, seconds)

        self.unique_name = f"{self.filename}_{minutes}m{seconds}s_{self.width}x{self.height}.jpeg"
        subfolder = self.allocSubfolder()
        self.full_preview_path = os.path.join(
            self.save_to_path, subfolder, self.unique_name
        )

    def process_video_file(self):
        if not self.path:
            print('Path is not provided')
            return
        if not os.path.isfile(self.path):
            print('Directory element is not file')
            return
        if not self.unique_name:
            print('No unique name provided. Run prepare.')
            return
        if os.path.isfile(self.full_preview_path):
            print('File exists, skipping.')
            return
        if self.checkIfExists(self.save_to_path, self.unique_name):
            print('File exists in subdir, skipping.')
            return

        percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90]
        frames = self.__extract_frames(percentiles)

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
        container = av.open(self.path)
        video_stream = container.streams.video[0]

        framerate = video_stream.average_rate  # get the frame rate
        if not framerate:
            framerate = video_stream.codec_context.rate

        print('duration: ', container.duration)

        total_frame_cnt = video_stream.frames
        if total_frame_cnt <= 0:
            duration = float(video_stream.duration *
                             video_stream.time_base)  # seconds
            total_frame_cnt = round(duration * float(framerate))

        print('total_frames: ', total_frame_cnt)
        frame_indices = self.__findPercentileValues(
            total_frame_cnt, percentiles)
        print('frame_indices: ', frame_indices)

        frames = []

        for index in frame_indices:
            # timestamp for that frame_num
            frame_time_in_seconds = int(index / framerate)
            frame_time_in_microseconds = frame_time_in_seconds * \
                1000000  # 1 second → 1,000,000 μs

            minutes = frame_time_in_seconds // 60
            seconds = frame_time_in_seconds % 60
            print(f"{minutes}m{seconds}s{index}i")

            # backward=True = seek to that nearest timestamp
            container.seek(frame_time_in_microseconds, backward=True)

            # get the next available frame
            max_try = 3
            for i in range(1, max_try):
                try:
                    frame = next(container.decode(video=0))
                    break
                except:
                    if i >= max_try:
                        raise 'Max trials has been reached'
                    print('failed getting frame, retry: ', i+2)

            frames.append({"image": frame.to_image(
            ), "minutes": minutes, "seconds": seconds, "index": index})

        container.close()
        return frames
