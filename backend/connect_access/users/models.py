import uuid

from django.apps import apps
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):  # type: ignore
    """Default user for Connect Access."""

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    uuid = models.UUIDField(
        verbose_name=_("Public identifier"),
        unique=True,
        default=uuid.uuid4,
        editable=False,
    )
    email = models.EmailField(_("Email address"), unique=True)
    first_name = models.CharField(_("First name / username"), max_length=255)
    last_name = models.CharField(_("Last name"), blank=True, max_length=255)
    phone_regex = RegexValidator(
        regex=r"^\+?\d{9,15}$",
        message=_(
            "Phone number must have 9 to 15 digits, and can be preceded by + sign."
        ),
    )
    phone_number = models.CharField(
        _("Phone number"), validators=[phone_regex], max_length=16, blank=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email


@receiver(pre_delete, sender=User)
def delete_user_personal_information(sender, instance, using, **kwargs):
    """Delete mediation requests' personal information related to this user being removed."""
    MediationRequest = apps.get_model("mediations.MediationRequest")  # noqa: N806
    user_requests = MediationRequest.objects.filter(complainant=instance)
    for user_request in user_requests:
        user_request.first_name = ""
        user_request.last_name = ""
        user_request.email = ""
        user_request.phone_number = ""
        user_request.save()
