__version__ = "0.0.0"
__version_info__ = tuple(
    int(num) if num.isdigit() else num
    for num in __version__.replace("-", ".", 1).split(".")
)

from django.utils.translation import gettext_lazy as _

LANGUAGES = (
    ("fr", _("French")),
    ("en", _("English")),
)
