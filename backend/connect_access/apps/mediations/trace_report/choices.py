from django.db import models
from django.utils.translation import gettext_lazy as _


class TraceType(models.TextChoices):
    CALL = "ca", _("Call")
    MAIL = "ma", _("E-mail")
    LETTER = "le", _("Letter")
    OTHER = "ot", _("Other")


class ContactEntityType(models.TextChoices):
    COMPLAINANT = "cp", _("Complainant")
    MEDIATOR = "md", _("Mediator")
    ORGANIZATION = "or", _("Organization (partner)")
    EXTERNAL_ORGANIZATION = "eo", _("External organization")
    OTHER = "ot", _("Other")
