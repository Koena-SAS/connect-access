import pytest

from ...tests.factories import MediationRequestFactory

__all__ = [
    "request_data_for_trace_report",
]


@pytest.fixture()
def request_data_for_trace_report():
    mediation_request = MediationRequestFactory()
    return {
        "mediation_request": str(mediation_request.uuid),
        "trace_type": "CALL",
        "comment": "This is what hapened",
    }
