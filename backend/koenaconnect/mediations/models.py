import uuid

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.core.validators import RegexValidator
from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel

User = get_user_model()


def user_directory_path(instance, filename):
    if instance.complainant:
        # file will be uploaded to MEDIA_ROOT/further_info/user_<id>/<filename>
        return f"further_info/user_{instance.complainant.uuid}/{filename}"
    else:
        # file will be uploaded to MEDIA_ROOT/further_info/anonymous/<filename>
        return f"further_info/anonymous/{filename}"


def trace_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/trace_report/mediation_request_<id>/<filename>
    return (
        f"trace_report/mediation_request_{instance.mediation_request.uuid}/{filename}"
    )


phone_regex = RegexValidator(
    regex=r"^\+?\d{9,15}$",
    message=_("Phone number must have 9 to 15 digits, and can be preceded by + sign."),
)

domain_name_regex = RegexValidator(
    regex=r"^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$",
    message=_("Domain name must be at least in the form domain.extension"),
)


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


class ChoiceArrayField(ArrayField):
    """A field that allows us to store an array of choices.

    Uses Django's Postgres ArrayField
    and a MultipleChoiceField for its formfield.
    cf. https://stackoverflow.com/a/39833588/1774332
    """

    def formfield(self, **kwargs):
        defaults = {
            "form_class": forms.MultipleChoiceField,
            "choices": self.base_field.choices,
        }
        defaults.update(kwargs)
        # Skip our parent's formfield implementation completely as we don't
        # care for it.
        # pylint:disable=bad-super-call
        return super(ArrayField, self).formfield(**defaults)


class MediationRequest(TimeStampedModel):
    """Request for a mediation.

    Request from a disabled person having an accessibility problem,
    to start a mediation process and solve the problem.

    """

    class Meta:
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
        choices=MediationRequestStatus.choices,
    )

    # complainant infos
    first_name = models.CharField(
        verbose_name=_("First name / username"), max_length=255
    )
    last_name = models.CharField(
        verbose_name=_("Last name"), max_length=255, blank=True
    )
    email = models.EmailField(verbose_name=_("Email address"), blank=True)
    phone_number = models.CharField(
        verbose_name=_("Phone number"),
        validators=[phone_regex],
        max_length=16,
        blank=True,
    )
    assistive_technology_used = ChoiceArrayField(
        verbose_name=_("Assistive technologies used"),
        base_field=models.CharField(
            verbose_name=_("Assistive technology used"),
            max_length=2,
            choices=AssistiveTechnology.choices,
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
        choices=UrgencyLevel.choices,
        blank=True,
    )
    issue_description = models.TextField(verbose_name=_("Issue description"))
    step_description = models.TextField(verbose_name=_("Step description"), blank=True)
    issue_type = models.CharField(
        verbose_name=_("Issue type"),
        max_length=2,
        choices=IssueType.choices,
        blank=True,
    )
    inaccessibility_level = models.CharField(
        verbose_name=_("Inaccessibility level"),
        max_length=2,
        choices=InaccessibilityLevel.choices,
        blank=True,
    )
    browser_used = models.BooleanField(
        verbose_name=_("Whether the problem occured while using a web browser"),
        null=True,
    )
    url = models.CharField(
        verbose_name=_("URL address where the problem was encountered"),
        blank=True,
        validators=[domain_name_regex],
        max_length=200,
    )
    browser = models.CharField(
        verbose_name=_("Browser"),
        max_length=2,
        choices=Browser.choices,
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
        choices=MobileAppPlatform.choices,
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
    organization_phone_number = models.CharField(
        verbose_name=_("Phone number of the organization"),
        validators=[phone_regex],
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
            self.status == MediationRequestStatus.CLOTURED.value
            or self.status == MediationRequestStatus.MEDIATION_FAILED.value
        )
        if already_existing and no_account and request_closed:
            self._remove_personal_information()
        super().save(*args, **kwargs)

    def _remove_personal_information(self):
        self.first_name = ""
        self.last_name = ""
        self.email = ""
        self.phone_number = ""


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


class TraceReport(TimeStampedModel):
    """Contact trace report associated to a mediation request.

    Everytime a contact is established with one of the participants, a report is filled by the mediator
    to remember the contact history.

    """

    class Meta:
        verbose_name = _("Trace report")
        verbose_name_plural = _("Trace reports")

    uuid = models.UUIDField(
        verbose_name=_("Public identifier"),
        unique=True,
        default=uuid.uuid4,
        editable=False,
    )
    mediation_request = models.ForeignKey(
        MediationRequest,
        verbose_name=_("The mediation request to which this trace is linked"),
        on_delete=models.CASCADE,
    )
    contact_date = models.DateTimeField(
        verbose_name=_("Date of the contact"), default=timezone.now
    )
    trace_type = models.CharField(
        verbose_name=_("The contact type"),
        max_length=2,
        choices=TraceType.choices,
        blank=True,
    )
    sender_type = models.CharField(
        verbose_name=_("Sender type"),
        max_length=2,
        choices=ContactEntityType.choices,
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
        choices=ContactEntityType.choices,
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


# The following 3 methods are here to delete files when the corresponding
#  FileFields are deleted. cf. https://cmljnelson.blog/2020/06/22/delete-files-when-deleting-models-in-django/


@receiver(post_delete)
def delete_files_when_row_deleted_from_db(sender, instance, **kwargs):
    """Whenever ANY model is deleted, if it has a file field on it, delete the associated file too."""
    for field in sender._meta.concrete_fields:
        if isinstance(field, models.FileField):
            instance_file_field = getattr(instance, field.name)
            delete_file_if_unused(sender, instance, field, instance_file_field)


@receiver(pre_save)
def delete_files_when_file_changed(sender, instance, **kwargs):
    """Delete the file if something else get uploaded in its place."""
    # Don't run on initial save
    if not instance.pk:
        return
    for field in sender._meta.concrete_fields:
        if isinstance(field, models.FileField):
            # its got a file field. Let's see if it changed
            try:
                instance_in_db = sender.objects.get(pk=instance.pk)
            except sender.DoesNotExist:
                # We are probably in a transaction and the PK is just temporary
                # Don't worry about deleting attachments if they aren't actually saved yet.
                return
            instance_in_db_file_field = getattr(instance_in_db, field.name)
            instance_file_field = getattr(instance, field.name)
            if instance_in_db_file_field.name != instance_file_field.name:
                delete_file_if_unused(
                    sender, instance, field, instance_in_db_file_field
                )


def delete_file_if_unused(model, instance, field, instance_file_field):
    """Only delete the file if no other instances of that model are using it."""
    dynamic_field = {}
    dynamic_field[field.name] = instance_file_field.name
    other_refs_exist = (
        model.objects.filter(**dynamic_field).exclude(pk=instance.pk).exists()
    )
    if not other_refs_exist:
        instance_file_field.delete(False)
