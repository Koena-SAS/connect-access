import pytest
from django.utils.translation import activate

from .factories import MediationRequestFactory


@pytest.fixture(autouse=True)
def _set_default_language():
    activate("en")


@pytest.fixture()
def request_data_for_mediation_request():
    return {
        "status": "WAITING_ADMIN",
        "first_name": "John",
        "email": "john@doe.com",
        "issue_description": "Here is the problem",
    }


@pytest.fixture()
def request_data_for_mediation_request_creation():
    return {
        "status": "PENDING",
        "first_name": "John",
        "email": "john@doe.com",
        "issue_description": "Here is the problem",
    }


@pytest.fixture()
def request_data_for_trace_report():
    mediation_request = MediationRequestFactory()
    return {
        "mediation_request": str(mediation_request.uuid),
        "trace_type": "CALL",
        "comment": "This is what hapened",
    }
