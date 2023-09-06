import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from connect_access.core.loading import get_model

pytestmark = pytest.mark.django_db

TraceReport = get_model("mediations", "TraceReport")


class TestCommands:
    @staticmethod
    def _create(with_mediation_requests=False):
        if with_mediation_requests:
            call_command("createmediationsfortest")
        call_command("createtracereportsfortest")

    @staticmethod
    def _delete():
        call_command("deletetracereports")

    def test_createtracereportsfortest_create_correct_elements(self):
        assert len(TraceReport.objects.all()) == 0
        self._create(with_mediation_requests=True)
        assert len(TraceReport.objects.all()) == 2

    def test_createtracereportsfortest_raises_exception_when_called_on_empty_database(
        self,
    ):
        with pytest.raises(CommandError):
            self._create()

    def test_deletetracereports_deletes_all_elements_linked_to_mediation_requests(self):
        self._create(with_mediation_requests=True)
        assert len(TraceReport.objects.all()) != 0
        self._delete()
        assert len(TraceReport.objects.all()) == 0
