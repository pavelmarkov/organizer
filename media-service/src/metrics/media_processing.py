

from prometheus_client import Histogram

custom_buckets = (0.125, 0.225,
                  0.325, 0.525,
                  1.125, 1.525,
                  2.125, 2.525,
                  3.125, 3.525,
                  float("inf"))
MEDIA_PROCESSING_DURATION_SECONDS = Histogram(
    'media_processing_duration_seconds',
    'Time spent procession media',
    buckets=custom_buckets
)
