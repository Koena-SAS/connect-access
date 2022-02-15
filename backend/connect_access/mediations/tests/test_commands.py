import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from ..models import MediationRequest, TraceReport

pytestmark = pytest.mark.django_db


def test_createmediationsfortest_create_correct_elements():
    assert len(MediationRequest.objects.all()) == 0
    assert len(TraceReport.objects.all()) == 0
    call_command("createmediationsfortest")
    assert len(MediationRequest.objects.all()) == 2
    assert len(TraceReport.objects.all()) == 2


def test_createmediationsfortest_raises_exception_when_called_on_non_empty_database():
    call_command("createmediationsfortest")
    with pytest.raises(CommandError):
        call_command("createmediationsfortest")


def test_deletemediations_deletes_all_elements_linked_to_mediation_requests():
    call_command("createmediationsfortest")
    assert len(MediationRequest.objects.all()) != 0
    assert len(TraceReport.objects.all()) != 0
    call_command("deletemediations")
    assert len(MediationRequest.objects.all()) == 0
    assert len(TraceReport.objects.all()) == 0
