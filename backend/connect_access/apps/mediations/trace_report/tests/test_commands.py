import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from connect_access.core.loading import get_model

pytestmark = pytest.mark.django_db

CREATE_COMMAND = "createtracereportsfortest"
DELETE_COMMAND = "deletetracereports"

TraceReport = get_model("trace_report", "TraceReport")


def test_createtracereportsfortest_create_correct_elements():
    assert len(TraceReport.objects.all()) == 0
    call_command("createmediationsfortest")
    call_command(CREATE_COMMAND)
    assert len(TraceReport.objects.all()) == 2


def test_createtracereportsfortest_raises_exception_when_called_on_empty_database():
    with pytest.raises(CommandError):
        call_command(CREATE_COMMAND)


def test_deletetracereports_deletes_all_elements_linked_to_mediation_requests():
    call_command("createmediationsfortest")
    call_command(CREATE_COMMAND)
    assert len(TraceReport.objects.all()) != 0
    call_command(DELETE_COMMAND)
    assert len(TraceReport.objects.all()) == 0
