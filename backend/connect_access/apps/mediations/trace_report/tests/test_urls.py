import pytest
from django.urls import resolve, reverse

from connect_access.core.loading import get_class

TraceReportFactory = get_class(
    "mediations.trace_report.tests.factories", "TraceReportFactory"
)
MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)
pytestmark = pytest.mark.django_db


class TestURLS:
    def test_trace_reports_by_mediation_request(self):
        mediation_request = MediationRequestFactory()
        TraceReportFactory(mediation_request=mediation_request)
        assert (
            reverse(
                "api:trace_reports-by-mediation-request",
                kwargs={"mediation_request_id": mediation_request.uuid},
            )
            == f"/api/trace-reports/mediation-request/{mediation_request.uuid}/"
        )
        assert (
            resolve(
                f"/api/trace-reports/mediation-request/{mediation_request.uuid}/"
            ).view_name
            == "api:trace_reports-by-mediation-request"
        )

    def test_trace_reports_list(self):
        assert reverse("api:trace_reports-list") == "/api/trace-reports/"
        assert resolve("/api/trace-reports/").view_name == "api:trace_reports-list"
