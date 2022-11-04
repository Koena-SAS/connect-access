import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel

import connect_access.apps.mediations.choices as choices
import connect_access.models.fields as local_fields

User = get_user_model()


def user_directory_path(instance, filename):
    if instance.complainant:
        # file will be uploaded to MEDIA_ROOT/further_info/user_<id>/<filename>
        return f"further_info/user_{instance.complainant.uuid}/{filename}"
    else:
        # file will be uploaded to MEDIA_ROOT/further_info/anonymous/<filename>
        return f"further_info/anonymous/{filename}"


class AbstractMediationRequest(TimeStampedModel):
    """Request for a mediation.

    Request from a disabled person having an accessibility problem,
    to start a mediation process and solve the problem.

    """

    class Meta:
        abstract = True
        app_label = "mediations"
        verbose_name = _("Mediation request")
        verbose_name_plural = _("Mediation requests")

    uuid = models.UUIDField(
        verbose_name=_("Public identifier"),
        unique=True,
        default=uuid.uuid4,
        editable=False,
    )
    request_date = models.DateTimeField(
        verbose_name=_("Date of the request"), default=timezone.now
    )
    complainant = models.ForeignKey(
        User,
        verbose_name=_("User who submitted this request"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    status = models.CharField(
        verbose_name=_("Status of the request"),
        max_length=2,
        choices=choices.MediationRequestStatus.choices,
    )

    # complainant infos
    first_name = models.CharField(
        verbose_name=_("First name / username"), max_length=255
    )
    last_name = models.CharField(
        verbose_name=_("Last name"), max_length=255, blank=True
    )
    email = models.EmailField(verbose_name=_("Email address"), blank=True)
    phone_number = local_fields.PhoneNumberField(
        verbose_name=_("Phone number"),
        max_length=16,
        blank=True,
    )
    assistive_technology_used = local_fields.ChoiceArrayField(
        verbose_name=_("Assistive technologies used"),
        base_field=models.CharField(
            verbose_name=_("Assistive technology used"),
            max_length=2,
            choices=choices.AssistiveTechnology.choices,
            blank=True,
        ),
        default=list,
        blank=True,
    )
    technology_name = models.TextField(verbose_name=_("Technology name(s)"), blank=True)
    technology_version = models.TextField(
        verbose_name=_("Technology version(s)"), blank=True
    )

    # problem description
    urgency = models.CharField(
        verbose_name=_("Whether the request is urgent or not"),
        max_length=2,
        choices=choices.UrgencyLevel.choices,
        blank=True,
    )
    issue_description = models.TextField(verbose_name=_("Issue description"))
    step_description = models.TextField(verbose_name=_("Step description"), blank=True)
    issue_type = models.CharField(
        verbose_name=_("Issue type"),
        max_length=2,
        choices=choices.IssueType.choices,
        blank=True,
    )
    inaccessibility_level = models.CharField(
        verbose_name=_("Inaccessibility level"),
        max_length=2,
        choices=choices.InaccessibilityLevel.choices,
        blank=True,
    )
    browser_used = models.BooleanField(
        verbose_name=_("Whether the problem occured while using a web browser"),
        null=True,
    )
    url = local_fields.DomainNameField(
        verbose_name=_("URL address where the problem was encountered"),
        blank=True,
        max_length=200,
    )
    browser = models.CharField(
        verbose_name=_("Browser"),
        max_length=2,
        choices=choices.Browser.choices,
        blank=True,
    )
    browser_version = models.CharField(
        verbose_name=_("Browser version"),
        max_length=255,
        blank=True,
    )
    mobile_app_used = models.BooleanField(
        verbose_name=_("Whether the problem occured while using a mobile app"),
        null=True,
    )
    mobile_app_platform = models.CharField(
        verbose_name=_("The used mobile app platform"),
        max_length=2,
        choices=choices.MobileAppPlatform.choices,
        blank=True,
    )
    mobile_app_name = models.CharField(
        verbose_name=_("The used mobile app name"),
        max_length=255,
        blank=True,
    )
    other_used_software = models.CharField(
        verbose_name=_("Other software, connected object etc. used to navigate"),
        max_length=255,
        blank=True,
    )
    did_tell_organization = models.BooleanField(
        verbose_name=_("Whether the organization was told about the problem"), null=True
    )
    did_organization_reply = models.BooleanField(
        verbose_name=_("Whether the organization replied"), null=True
    )
    organization_reply = models.TextField(
        verbose_name=_("The actual organization reply"),
        blank=True,
    )
    further_info = models.TextField(verbose_name=_("Further information"), blank=True)
    attached_file = models.FileField(
        verbose_name=_("Attached file"), upload_to=user_directory_path, blank=True
    )

    # organization infos
    organization_name = models.CharField(
        verbose_name=_("Name of the organization"),
        max_length=255,
        blank=True,
    )
    organization_address = models.CharField(
        verbose_name=_("Mailing address of the organization"),
        max_length=255,
        blank=True,
    )
    organization_email = models.EmailField(
        verbose_name=_("Email address of the organization"),
        blank=True,
    )
    organization_phone_number = local_fields.PhoneNumberField(
        verbose_name=_("Phone number of the organization"),
        max_length=16,
        blank=True,
    )
    organization_contact = models.CharField(
        verbose_name=_("Contact of the organization"),
        max_length=255,
        blank=True,
    )

    def __str__(self) -> str:
        return str(self.uuid)

    def save(self, *args, **kwargs):
        already_existing = bool(self.pk)
        no_account = bool(not self.complainant)
        request_closed = (
            self.status == choices.MediationRequestStatus.CLOTURED.value
            or self.status == choices.MediationRequestStatus.MEDIATION_FAILED.value
        )
        if already_existing and no_account and request_closed:
            self._remove_personal_information()
        super().save(*args, **kwargs)

    def _remove_personal_information(self):
        self.first_name = ""
        self.last_name = ""
        self.email = ""
        self.phone_number = ""
