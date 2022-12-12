import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from connect_access.core.loading import get_model

pytestmark = pytest.mark.django_db


class TestCommands:
    def get_about_service_infos_objects(self):
        return get_model("configuration", "AboutServiceInformation").objects.all()

    def get_contact_information_objects(self):
        return get_model("configuration", "ContactInformation").objects.all()

    def test_createconfigurationsfortest_create_correct_elements(self):
        assert len(self.get_contact_information_objects()) == 0
        assert len(self.get_about_service_infos_objects()) == 0
        call_command("createconfigurationsfortest")
        assert len(self.get_contact_information_objects()) == 1
        assert len(self.get_about_service_infos_objects()) == 2

    def test_createconfigurationsfortest_raises_exception_when_called_on_non_empty_database(
        self,
    ):
        call_command("createconfigurationsfortest")
        with pytest.raises(CommandError):
            call_command("createconfigurationsfortest")

    def test_deleteconfigurations_deletes_all_elements_linked_to_configuration(self):
        call_command("createconfigurationsfortest")
        assert len(self.get_contact_information_objects()) != 0
        assert len(self.get_about_service_infos_objects()) != 0
        call_command("deleteconfigurations")
        assert len(self.get_contact_information_objects()) == 0
        assert len(self.get_about_service_infos_objects()) == 0
