import pytest
from django.core.exceptions import ValidationError

from .factories import AboutServiceInformationFactory, ContactInformationFactory

pytestmark = pytest.mark.django_db


@pytest.mark.usefixtures("_set_default_language")
def test_contact_information_str():
    contact_information = ContactInformationFactory(email_en="mediation@koena.net")
    assert str(contact_information) == "mediation@koena.net"


@pytest.mark.usefixtures("_set_default_language")
def test_about_service_str():
    about_service = AboutServiceInformationFactory(link_text_en="Bla bla")
    assert str(about_service) == "Bla bla"


@pytest.mark.usefixtures("_set_default_language")
def test_contact_information_phone_number_regex_validation():
    _check_phone_format(ContactInformationFactory, "phone_number_fr")
    _check_phone_format(ContactInformationFactory, "phone_number_en")


def _check_phone_format(factory_class, field_name):
    object = factory_class(**{field_name: "1687416238"})
    object.delete()
    object = factory_class(**{field_name: "+1687416238"})
    object.delete()
    object = factory_class(**{field_name: "a1687416238"})
    with pytest.raises(ValidationError, match="Phone number must have"):
        object.full_clean()
    object.delete()
    object = factory_class(**{field_name: "6238"})
    with pytest.raises(ValidationError, match="Phone number must have"):
        object.full_clean()
    object.delete()


@pytest.mark.usefixtures("_set_default_language")
def test_contact_information_website_regex_validation():
    _check_url_format(ContactInformationFactory, "website_en")
    _check_url_format(ContactInformationFactory, "website_fr")


@pytest.mark.usefixtures("_set_default_language")
def test_about_service_link_url_regex_validation():
    _check_url_format(AboutServiceInformationFactory, "link_url_en")
    _check_url_format(AboutServiceInformationFactory, "link_url_fr")


def _check_url_format(factory_class, field_name):
    object = factory_class(**{field_name: "http://koena.net"})
    object.delete()
    object = factory_class(**{field_name: "https://koena.net"})
    object.delete()
    object = factory_class(**{field_name: "koena.net"})
    with pytest.raises(ValidationError, match="URL must be"):
        object.full_clean()
    object.delete()
    object = factory_class(**{field_name: "koena"})
    with pytest.raises(ValidationError, match="URL must be"):
        object.full_clean()
    object.delete()
    object = factory_class(**{field_name: "http:/koena.net"})
    with pytest.raises(ValidationError, match="URL must be"):
        object.full_clean()
    object.delete()
    object = factory_class(**{field_name: "https://koena"})
    with pytest.raises(ValidationError, match="URL must be"):
        object.full_clean()
    object.delete()


def test_about_service_display_order_default_value_is_always_the_highest():
    about_service_1 = AboutServiceInformationFactory()
    about_service_2 = AboutServiceInformationFactory()
    assert about_service_1.display_order == 1
    assert about_service_2.display_order == 2
    about_service_2.delete()
    about_service_3 = AboutServiceInformationFactory()
    assert about_service_3.display_order == 2
    about_service_1.display_order = 5
    about_service_1.save()
    about_service_4 = AboutServiceInformationFactory()
    assert about_service_4.display_order == 6
