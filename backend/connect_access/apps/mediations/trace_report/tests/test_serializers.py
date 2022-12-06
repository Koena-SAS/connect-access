from operator import itemgetter

import pytest
from dateutil.parser import parse
from pytest_django.asserts import assertContains
from rest_framework.test import APIRequestFactory

from connect_access.core.loading import get_model

from ..api import TraceReportViewSet
from ..choices import ContactEntityType, TraceType
from .factories import MediationRequestFactory
from .utils import (
    _execute_trace_report_by_mediation_request,
    _execute_trace_report_list,
    _get_trace_report_absolute_url,
)

TraceReport = get_model("trace_report", "TraceReport")

pytestmark = pytest.mark.django_db


def test_trace_report_serializes_correctly_all_fields(authenticate):
    trace_report, response = itemgetter("trace_report", "response")(
        _execute_trace_report_list(permission="admin", auth=authenticate)
    )
    data = response.data[0]
    assertContains(response, str(trace_report.uuid))
    parse(data["contact_date"])  # we test that parsing it to datime does not raise
    assertContains(response, str(trace_report.mediation_request.uuid))
    assertContains(response, TraceType(trace_report.trace_type).name)
    assertContains(response, ContactEntityType(trace_report.sender_type).name)
    assertContains(response, trace_report.sender_name)
    assertContains(response, ContactEntityType(trace_report.recipient_type).name)
    assertContains(response, trace_report.recipient_name)
    assertContains(response, trace_report.comment)
    assert trace_report.attached_file.url in data["attached_file"]


def test_trace_report_deserializes_correctly_all_fields(image_file, authenticate):
    mediation_request = MediationRequestFactory()
    request_data = {
        "mediation_request": str(mediation_request.uuid),
        "trace_type": "CALL",
        "sender_type": "COMPLAINANT",
        "sender_name": "John Doe",
        "recipient_type": "ORGANIZATION",
        "recipient_name": "Jane Doe",
        "contact_date": "2020-02-15T00:00:00Z",
        "comment": "This is what happened",
        "attached_file": image_file,
    }
    url = _get_trace_report_absolute_url("list")
    request_create = APIRequestFactory().post(
        url, data=request_data, format="multipart"
    )
    authenticate.authenticate_request_as_admin(request_create)
    TraceReportViewSet.as_view({"post": "create"})(request_create)
    trace_report = TraceReport.objects.first()
    assert str(trace_report.mediation_request.uuid) in request_data.values()
    assert (
        trace_report.contact_date.strftime("%Y-%m-%dT%H:%M:%SZ")
        in request_data.values()
    )
    assert TraceType(trace_report.trace_type).name in request_data.values()
    assert ContactEntityType(trace_report.sender_type).name in request_data.values()
    assert trace_report.sender_name in request_data.values()
    assert ContactEntityType(trace_report.recipient_type).name in request_data.values()
    assert trace_report.recipient_name in request_data.values()
    assert trace_report.comment in request_data.values()
    request_data["attached_file"].seek(0)
    assert (
        trace_report.attached_file.readlines()
        == request_data["attached_file"].readlines()
    )


def test_trace_report_by_mediation_request_serializes_correctly_all_fields(
    authenticate,
):
    trace_report1, trace_report2, mediation_request_uuid, response = itemgetter(
        "trace_report1", "trace_report2", "mediation_request_uuid", "response"
    )(_execute_trace_report_by_mediation_request(permission="admin", auth=authenticate))
    data = response.data
    assertContains(response, str(trace_report1.uuid))
    parse(data[0]["contact_date"])  # we test that parsing it to datime does not raise
    assertContains(response, TraceType(trace_report1.trace_type).name)
    assertContains(response, ContactEntityType(trace_report1.sender_type).name)
    assertContains(response, trace_report1.sender_name)
    assertContains(response, ContactEntityType(trace_report1.recipient_type).name)
    assertContains(response, trace_report1.recipient_name)
    assertContains(response, trace_report1.comment)
    assert trace_report1.attached_file.url in data[1]["attached_file"]
    assertContains(response, str(trace_report2.uuid))
    parse(data[1]["contact_date"])  # we test that parsing it to datime does not raise
    assertContains(response, TraceType(trace_report2.trace_type).name)
    assertContains(response, ContactEntityType(trace_report2.sender_type).name)
    assertContains(response, trace_report2.sender_name)
    assertContains(response, ContactEntityType(trace_report2.recipient_type).name)
    assertContains(response, trace_report2.recipient_name)
    assertContains(response, trace_report2.comment)
    assert trace_report2.attached_file.url in data[0]["attached_file"]
