import logging


class CustomLogFormatter(logging.Formatter):
    green = "\33[32m"
    violet = "\033[95m"
    yellow = "\033[93m"
    red = "\33[31m"
    bold_red = "\033[91m"
    reset = "\033[0m"
    format = '%(asctime)s [%(levelname)s] [%(funcName)s]: %(message)s'

    FORMATS = {
        logging.INFO: green + format + reset,
        logging.DEBUG: violet + format + reset,
        logging.WARNING: yellow + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: bold_red + format + reset
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(
            fmt=log_fmt,  datefmt='%Y-%m-%d %H:%M:%S'
        )
        return formatter.format(record)
