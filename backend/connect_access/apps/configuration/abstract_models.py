import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel
from solo.models import SingletonModel
from translated_fields import TranslatedField

from connect_access.core.loading import get_model
from connect_access.models.fields import DomainNameField, PhoneNumberField


class AbstractContactInformation(SingletonModel):
    """The mediation company contact information.

    The entry is unique as it describes the organization that is providing the mediation service.

    """

    class Meta:
        abstract = True
        app_label = "configuration"
        verbose_name = _(
            "Information about the organization running the mediation service"
        )
        verbose_name_plural = _(
            "Information about the organization running the mediation service"
        )

    email = TranslatedField(
        models.EmailField(verbose_name=_("Email address"), blank=True)
    )
    email_text = TranslatedField(
        models.CharField(
            verbose_name=_("Email address display text"), max_length=255, blank=True
        )
    )
    phone_number = TranslatedField(
        PhoneNumberField(
            verbose_name=_("Phone number"),
            blank=True,
        )
    )
    phone_number_text = TranslatedField(
        models.CharField(
            verbose_name=_("Phone number display text"), max_length=255, blank=True
        )
    )
    website = TranslatedField(
        DomainNameField(
            verbose_name=_("Website URL"),
            blank=True,
            max_length=200,
        )
    )
    website_text = TranslatedField(
        models.CharField(
            verbose_name=_("Website display text"), max_length=255, blank=True
        )
    )
    terms_of_service = TranslatedField(
        models.TextField(
            verbose_name=_("Terms of service. Please use Markdown format."),
            blank=True,
        )
    )

    def __str__(self) -> str:
        return str(self.email)


def display_order_default():
    # The default is always set to the highest display order + 1
    # cf. https://stackoverflow.com/a/37800350/1774332
    AboutServiceInformation = get_model(  # noqa: N806
        "configuration", "AboutServiceInformation"
    )
    if AboutServiceInformation.objects.all().count() == 0:
        order_default = 1
    else:
        order_default = (
            AboutServiceInformation.objects.all().aggregate(
                models.Max("display_order")
            )["display_order__max"]
            + 1
        )
    return order_default


class AbstractAboutServiceInformation(TimeStampedModel):
    """The information about the service.

    These are links to extrernal pages with information about service presentation, privacy, terms and conditions etc.

    """

    class Meta:
        abstract = True
        app_label = "configuration"
        verbose_name = _("About mediation service information")
        verbose_name_plural = _("About mediation service information")

    uuid = models.UUIDField(
        verbose_name=_("Public identifier"),
        unique=True,
        default=uuid.uuid4,
        editable=False,
    )
    display_order = models.IntegerField(
        verbose_name=_("The order in which the link is displayed"),
        unique=True,
        default=display_order_default,
    )
    link_text = TranslatedField(
        models.CharField(verbose_name=_("The link text"), max_length=255)
    )
    link_url = TranslatedField(
        models.CharField(
            verbose_name=_("The link URL to the page containing the information"),
            max_length=200,
        )
    )

    def __str__(self) -> str:
        return str(self.link_text)
