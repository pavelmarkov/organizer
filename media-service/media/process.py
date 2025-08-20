
import av
import os
from config.files import get_settings


class VideoProcessor():
    def __init__(self, path):
        config = get_settings()
        self.save_to_path = config.save_to_path
        self.path = path
        if not os.path.exists(self.save_to_path):
            os.makedirs(self.save_to_path)

    def process_video_file(self):
        if not self.path:
            print('path is not provided')
            return
        if not os.path.isfile(self.path):
            print('directory element is not file')
            return
        filename = os.path.basename(self.path)
        saveSubdirectory = os.path.join(self.save_to_path, filename)
        isDirectoryExists = os.path.exists(saveSubdirectory)

        if isDirectoryExists:
            print('directory exists, returning')
            return

        percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90]
        frames = self.__extract_frames(percentiles)

        os.makedirs(saveSubdirectory)

        for i, frame in enumerate(frames):
            print(f"{saveSubdirectory}/frame_{i}.png")
            frame.save(f"{saveSubdirectory}/frame_{i}.png")

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
        time_base = video_stream.time_base  # get the time base

        print('duration: ', container.duration)
        print('total_frames: ', video_stream.frames)
        frame_indices = self.__findPercentileValues(
            video_stream.frames, percentiles)
        print('frame_indices: ', frame_indices)

        frames = []

        for index in frame_indices:
            frame_num = index  # the frame I want
            # timestamp for that frame_num
            frame_time_in_seconds = int(frame_num / framerate)
            frame_time_in_microseconds = frame_time_in_seconds * \
                1000000  # 1 second → 1,000,000 μs
            print(frame_num, frame_time_in_seconds /
                  60, frame_time_in_seconds % 60)
            # backward=True = seek to that nearest timestamp
            container.seek(frame_time_in_microseconds, backward=True)
            # get the next available frame
            frame = next(container.decode(video=0))
            # get the proper key frame number of that timestamp
            sec_frame = int(frame.pts * time_base * framerate)

            for _ in range(sec_frame, frame_num):
                frame = next(container.decode(video=0))

            frames.append(frame.to_image())

        container.close()
        return frames
