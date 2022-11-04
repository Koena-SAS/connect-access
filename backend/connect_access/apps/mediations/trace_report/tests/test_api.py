import pytest
from pytest_django.asserts import assertContains, assertNotContains
from rest_framework.test import APIRequestFactory

from connect_access.core.loading import get_model

from ...tests.factories import MediationRequestFactory
from ..api import TraceReportViewSet
from .factories import TraceReportFactory
from .utils import _add_trace_report, _get_trace_report_absolute_url

pytestmark = pytest.mark.django_db

TraceReport = get_model("trace_report", "TraceReport")


def test_trace_reports_list_contains_all_trace_reports(authenticate):
    trace_report1 = TraceReportFactory()
    trace_report2 = TraceReportFactory()
    request = APIRequestFactory().get(_get_trace_report_absolute_url("list"))
    authenticate.authenticate_request_as_admin(request)
    response = TraceReportViewSet.as_view({"get": "list"})(request)
    assertContains(response, trace_report1.comment)
    assertContains(response, trace_report2.comment)


def test_trace_report_create(
    request_data_for_trace_report,
):
    assert TraceReport.objects.count() == 0
    _add_trace_report(request_data_for_trace_report)
    assert TraceReport.objects.count() == 1


def test_trace_reports_by_mediation_request_contains_all_needed_trace_reports(
    authenticate,
):
    mediation_request = MediationRequestFactory()
    trace_report1 = TraceReportFactory(mediation_request=mediation_request)
    trace_report2 = TraceReportFactory(mediation_request=mediation_request)
    trace_report3 = TraceReportFactory()
    request = APIRequestFactory().get(
        _get_trace_report_absolute_url("by-mediation-request", mediation_request.uuid)
    )
    authenticate.authenticate_request_as_admin(request)
    response = TraceReportViewSet.as_view({"get": "by_mediation_request"})(
        request, mediation_request_id=mediation_request.uuid
    )
    assertContains(response, trace_report1.comment)
    assertContains(response, trace_report2.comment)
    assertNotContains(response, trace_report3.comment)
