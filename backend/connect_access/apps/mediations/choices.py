from django.db import models
from django.utils.translation import gettext_lazy as _


class AssistiveTechnology(models.TextChoices):
    KEYBOARD = "kb", _("Keyboard")
    SCREEN_READER_VOCAL_SYNTHESIS = (
        "sv",
        _("Screen reader with vocal synthesis"),
    )
    BRAILLE_DISPLAY = (
        "bd",
        _("Braille display"),
    )
    ZOOM_SOFTWARE = (
        "zs",
        _("Zoom software"),
    )
    VOCAL_COMMAND_SOFTWARE = (
        "vc",
        _("Vocal command software"),
    )
    DYS_DISORDER_SOFTWARE = (
        "ds",
        _("DYS Disorder software"),
    )
    VIRTUAL_KEYBOARD = (
        "vk",
        _("Virtual keyboard"),
    )
    ADAPTED_NAVIGATION_DISPOSITIVE = (
        "an",
        _("Adapted navigation dispositive"),
    )
    EXCLUSIVE_KEYBOARD_NAVIGATION = ("ek", _("Exclusive keyboard navigation"))
    OTHER = "ot", _("Other")


class MediationRequestStatus(models.TextChoices):
    PENDING = "pe", _("Incomplete")
    WAITING_MEDIATOR_VALIDATION = (
        "wm",
        _("Waiting for mediator validation"),
    )
    FILED = (
        "fi",
        _("Request filed"),
    )
    WAITING_ADMIN = (
        "wa",
        _("Waiting for administrative validation"),
    )
    WAITING_CONTACT = (
        "wc",
        _("Waiting for contact"),
    )
    WAITING_CONTACT_BIS = (
        "wb",
        _("Waiting for second contact"),
    )
    MEDIATING = (
        "me",
        _("Mediating"),
    )
    CLOTURED = (
        "cl",
        _("Closed"),
    )
    MEDIATION_FAILED = "fa", _("Mediation failed")


class Browser(models.TextChoices):
    FIREFOX = "ff", _("Firefox")
    CHROME = "ch", _("Chrome")
    INTERNET_EXPLORER = "ie", _("Internet Explorer")
    MICROSOFT_EDGE = "me", _("Microsoft Edge")
    OTHER = "ot", _("Other")
    DONT_KNOW = "dn", _("Don't know")


class MobileAppPlatform(models.TextChoices):
    IOS = "is", _("iOS")
    ANDROID = "ad", _("Android")
    WINDOWS_PHONE = "wp", _("Windows phone")
    OTHER = "ot", _("Other")


class InaccessibilityLevel(models.TextChoices):
    IMPOSSIBLE_ACCESS = "ia", _("Impossible access")
    ACCESS_DIFFICULT = "ad", _("Access possible by bypass but difficult")
    RANDOM_ACCESS = "ra", _(
        "Random access, sometimes it works and sometimes it does not"
    )


class IssueType(models.TextChoices):
    ACCESSIBILITY = "ay", _("Accessibility issue")
    UNDERSTANDING = "ug", _("Understanding issue, i.e. needs easy-to-read")
    USABILITY = "uy", _("Usability issue")


class UrgencyLevel(models.TextChoices):
    VERY_URGENT = "vu", _("Yes, very urgent: need a quick answer")
    MODERATELY_URGENT = "mu", _("Moderately, I can wait, but not too long")
    NOT_URGENT = "nu", _(
        "Not urgent at all, but would like a solution as soon as possible"
    )
