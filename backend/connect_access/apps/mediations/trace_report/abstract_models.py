import uuid

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel

from . import choices


def trace_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/trace_report/mediation_request_<id>/<filename>
    return (
        f"trace_report/mediation_request_{instance.mediation_request.uuid}/{filename}"
    )


class AbstractTraceReport(TimeStampedModel):
    """Contact trace report associated to a mediation request.

    Everytime a contact is established with one of the participants, a report is filled by the mediator
    to remember the contact history.

    """

    class Meta:
        abstract = True
        app_label = "mediations"
        verbose_name = _("Trace report")
        verbose_name_plural = _("Trace reports")

    uuid = models.UUIDField(
        verbose_name=_("Public identifier"),
        unique=True,
        default=uuid.uuid4,
        editable=False,
    )
    mediation_request = models.ForeignKey(
        "mediations.MediationRequest",
        verbose_name=_("The mediation request to which this trace is linked"),
        on_delete=models.CASCADE,
    )
    contact_date = models.DateTimeField(
        verbose_name=_("Date of the contact"), default=timezone.now
    )
    trace_type = models.CharField(
        verbose_name=_("The contact type"),
        max_length=2,
        choices=choices.TraceType.choices,
        blank=True,
    )
    sender_type = models.CharField(
        verbose_name=_("Sender type"),
        max_length=2,
        choices=choices.ContactEntityType.choices,
        blank=True,
    )
    sender_name = models.CharField(
        verbose_name=_("Name of the sender(s)"),
        max_length=255,
        blank=True,
    )
    recipient_type = models.CharField(
        verbose_name=_("Recipient type"),
        max_length=2,
        choices=choices.ContactEntityType.choices,
        blank=True,
    )
    recipient_name = models.CharField(
        verbose_name=_("Name of the recipient(s)"),
        max_length=255,
        blank=True,
    )
    comment = models.TextField(
        verbose_name=_("The main text describing what has happened during the contact"),
        blank=True,
    )
    attached_file = models.FileField(
        verbose_name=_("Attached file"), upload_to=trace_directory_path, blank=True
    )

    def __str__(self) -> str:
        return str(self.uuid)
