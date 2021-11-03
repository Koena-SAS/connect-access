import pytest
from django.urls import resolve, reverse

from .factories import MediationRequestFactory, TraceReportFactory

pytestmark = pytest.mark.django_db


def test_mediation_requests_detail():
    mediation_request = MediationRequestFactory()
    assert (
        reverse(
            "api:mediation_requests-detail", kwargs={"uuid": mediation_request.uuid}
        )
        == f"/api/mediation-requests/{mediation_request.uuid}/"
    )
    assert (
        resolve(f"/api/mediation-requests/{mediation_request.uuid}/").view_name
        == "api:mediation_requests-detail"
    )


def test_mediation_requests_list():
    assert reverse("api:mediation_requests-list") == "/api/mediation-requests/"
    assert (
        resolve("/api/mediation-requests/").view_name == "api:mediation_requests-list"
    )


def test_mediation_requests_user():
    assert reverse("api:mediation_requests-user") == "/api/mediation-requests/user/"
    assert (
        resolve("/api/mediation-requests/user/").view_name
        == "api:mediation_requests-user"
    )


def test_trace_reports_by_mediation_request():
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


def test_trace_reports_list():
    assert reverse("api:trace_reports-list") == "/api/trace-reports/"
    assert resolve("/api/trace-reports/").view_name == "api:trace_reports-list"
