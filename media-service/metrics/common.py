
from prometheus_client import Summary

REQUEST_DURATION = Summary(
    'request_duration_in_seconds', 'Time spent procession request'
)
