import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from connect_access.core.loading import get_model

pytestmark = pytest.mark.django_db

MediationRequest = get_model("mediations", "MediationRequest")


class TestCommands:
    def _create(self):
        command = "createmediationsfortest"
        call_command(command)

    def _delete(self):
        command = "deletemediations"
        call_command(command)

    def test_createmediationsfortest_create_correct_elements(self):
        assert len(MediationRequest.objects.all()) == 0
        self._create()
        assert len(MediationRequest.objects.all()) == 2

    def test_createmediationsfortest_raises_exception_when_called_on_non_empty_database(
        self,
    ):
        self._create()
        with pytest.raises(CommandError):
            self._create()

    def test_deletemediations_deletes_all_elements_linked_to_mediation_requests(self):
        self._create()
        assert len(MediationRequest.objects.all()) != 0
        self._delete()
        assert len(MediationRequest.objects.all()) == 0
