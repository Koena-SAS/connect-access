import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from connect_access.core.loading import get_model

pytestmark = pytest.mark.django_db

MediationRequest = get_model("mediations", "MediationRequest")

CREATE_COMMAND = "createmediationsfortest"
DELETE_COMMAND = "deletemediations"


def test_createmediationsfortest_create_correct_elements():
    assert len(MediationRequest.objects.all()) == 0
    call_command(CREATE_COMMAND)
    assert len(MediationRequest.objects.all()) == 2


def test_createmediationsfortest_raises_exception_when_called_on_non_empty_database():
    call_command(CREATE_COMMAND)
    with pytest.raises(CommandError):
        call_command(CREATE_COMMAND)


def test_deletemediations_deletes_all_elements_linked_to_mediation_requests():
    call_command(CREATE_COMMAND)
    assert len(MediationRequest.objects.all()) != 0
    call_command(DELETE_COMMAND)
    assert len(MediationRequest.objects.all()) == 0
