from django.conf import settings


def settings_context(_request):
    """Set default settings for the templates context.

    Returns:
        The DEBUG setting.

    """
    # Note: we intentionally do NOT expose the entire settings
    # to prevent accidental leaking of sensitive information
    return {"DEBUG": settings.DEBUG}
