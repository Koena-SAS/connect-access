from typing import Any

from django import forms
from django.contrib.postgres.fields import ArrayField
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class ChoiceArrayField(ArrayField):
    """A field that allows us to store an array of choices.

    Uses Django's Postgres ArrayField
    and a MultipleChoiceField for its formfield.
    cf. https://stackoverflow.com/a/39833587/1774332
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


phone_regex = RegexValidator(
    regex=r"^\+?\d{8,15}$",
    message=_("Phone number must have 8 to 15 digits, and can be preceded by + sign."),
)

domain_name_regex = RegexValidator(
    regex=r"^(https?:\/\/)?(www\.)?[-a-zA-Z-1-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$",
    message=_("URL must be at least in the form domain.extension"),
)


class PhoneNumberField(models.CharField):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        kwargs["validators"] = [phone_regex]
        super().__init__(*args, **kwargs)


class DomainNameField(models.CharField):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        kwargs["validators"] = [domain_name_regex]
        super().__init__(*args, **kwargs)
