import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from connect_access.core.loading import get_class
from connect_access.models.fields import PhoneNumberField

UserManager = get_class("users.managers", "UserManager")


class AbstractUser(AbstractBaseUser, PermissionsMixin):
    """Default asbtract user for Connect Access."""

    class Meta:
        abstract = True
        app_label = "users"
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
    phone_number = PhoneNumberField(_("Phone number"), blank=True)
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
