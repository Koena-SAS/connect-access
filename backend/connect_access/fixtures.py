from io import BytesIO

import pytest
from django.core.exceptions import ValidationError
from django.core.files import File
from django.utils.translation import activate
from PIL import Image

__all__ = ["_media_storage", "image_file", "_set_default_language"]


@pytest.fixture(autouse=True)
def _media_storage(settings, tmpdir):
    settings.MEDIA_ROOT = tmpdir.strpath


@pytest.fixture()
def image_file(name="test.png", ext="png", size=(50, 50), color=(256, 0, 0)):
    file_obj = BytesIO()
    image = Image.new("RGBA", size=size, color=color)
    image.save(file_obj, ext)
    file_obj.seek(0)
    return File(file_obj, name=name)


@pytest.fixture(autouse=True)
def _set_default_language():
    activate("en")


class FieldChecker(object):
    @staticmethod
    def _check_bad_format(factory_class, field_name, field_value, error_match):
        object = factory_class(**{field_name: field_value})
        FieldChecker.raise_validation_error(object, error_match)
        object.delete()

    @staticmethod
    def _check_good_format(factory_class, field_name, field_value):
        object = factory_class(**{field_name: field_value})
        object.delete()

    @staticmethod
    def _check_format(factory_class, field_name, good_values, bad_values, error_match):
        for value in good_values:
            FieldChecker._check_good_format(factory_class, field_name, value)

        for value in bad_values:
            FieldChecker._check_bad_format(
                factory_class, field_name, value, error_match
            )

    @staticmethod
    def raise_validation_error(class_instance, error_match):
        with pytest.raises(ValidationError, match=error_match):
            class_instance.full_clean()

    @staticmethod
    def check_phone_format(factory_class, field_name):
        good_values = ["1687416238", "+1687416238"]
        bad_values = ["a1687416238", "6238"]
        error_message = "Phone number must have"
        FieldChecker._check_format(
            factory_class, field_name, good_values, bad_values, error_message
        )

    @staticmethod
    def check_url_format(factory_class, field_name):
        good_values = [
            "koena.net",
            "http://koena.net",
            "https://koena.net",
        ]
        bad_values = [
            "koena.",
            "koena",
            "http:/koena.net",
            "https://koena",
        ]
        error_message = "URL must be"
        FieldChecker._check_format(
            factory_class, field_name, good_values, bad_values, error_message
        )


@pytest.fixture()
def field_checker():
    return FieldChecker()
