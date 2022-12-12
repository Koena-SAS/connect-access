import pytest

from connect_access.core.loading import get_classes

pytestmark = pytest.mark.django_db

AboutServiceInformationFactory, ContactInformationFactory = get_classes(
    "configuration.tests.factories",
    ["AboutServiceInformationFactory", "ContactInformationFactory"],
)


class TestModels:
    @pytest.mark.usefixtures("_set_default_language")
    def test_contact_information_str(self):
        contact_information = ContactInformationFactory(email_en="mediation@koena.net")
        assert str(contact_information) == "mediation@koena.net"

    @pytest.mark.usefixtures("_set_default_language")
    def test_about_service_str(self):
        about_service = AboutServiceInformationFactory(link_text_en="Bla bla")
        assert str(about_service) == "Bla bla"

    @pytest.mark.usefixtures("_set_default_language")
    def test_contact_information_phone_number_regex_validation(self, field_checker):
        field_checker.check_phone_format(ContactInformationFactory, "phone_number_fr")
        field_checker.check_phone_format(ContactInformationFactory, "phone_number_en")

    @pytest.mark.usefixtures("_set_default_language")
    def test_contact_information_website_regex_validation(self, field_checker):
        field_checker.check_url_format(ContactInformationFactory, "website_en")
        field_checker.check_url_format(ContactInformationFactory, "website_fr")

    def test_about_service_display_order_default_value_is_always_the_highest(self):
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
