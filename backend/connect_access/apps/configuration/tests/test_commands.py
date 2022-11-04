import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from connect_access.core.loading import get_model

AboutServiceInformation = get_model("configuration", "AboutServiceInformation")
ContactInformation = get_model("configuration", "ContactInformation")

pytestmark = pytest.mark.django_db


def test_createconfigurationsfortest_create_correct_elements():
    assert len(ContactInformation.objects.all()) == 0
    assert len(AboutServiceInformation.objects.all()) == 0
    call_command("createconfigurationsfortest")
    assert len(ContactInformation.objects.all()) == 1
    assert len(AboutServiceInformation.objects.all()) == 2


def test_createconfigurationsfortest_raises_exception_when_called_on_non_empty_database():
    call_command("createconfigurationsfortest")
    with pytest.raises(CommandError):
        call_command("createconfigurationsfortest")


def test_deleteconfigurations_deletes_all_elements_linked_to_configuration():
    call_command("createconfigurationsfortest")
    assert len(ContactInformation.objects.all()) != 0
    assert len(AboutServiceInformation.objects.all()) != 0
    call_command("deleteconfigurations")
    assert len(ContactInformation.objects.all()) == 0
    assert len(AboutServiceInformation.objects.all()) == 0
