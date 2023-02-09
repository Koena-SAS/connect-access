import environ
from django.conf import settings

env = environ.Env()


def settings_context(request):
    """Set default settings for the templates context.

    Returns:
        The DEBUG setting.

    """
    # Note: we intentionally do NOT expose the entire settings
    # to prevent accidental leaking of sensitive information
    return {
        "DEBUG": settings.DEBUG,
        "data": {
            "platformName": env("DATA_PLATFORM_NAME"),
            "logoFilename": env("DATA_LOGO_FILENAME"),
            "logoFilenameSmall": env("DATA_LOGO_FILENAME_SMALL"),
        },
    }
