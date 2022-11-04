import pytest

from connect_access.apps.mediations.tests.factories import MediationRequestFactory


@pytest.fixture()
def request_data_for_trace_report():
    mediation_request = MediationRequestFactory()
    return {
        "mediation_request": str(mediation_request.uuid),
        "trace_type": "CALL",
        "comment": "This is what hapened",
    }
