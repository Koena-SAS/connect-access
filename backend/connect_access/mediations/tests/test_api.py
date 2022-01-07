import pytest
from django.core import mail
from django.test import override_settings
from pytest_django.asserts import assertContains, assertNotContains
from rest_framework.test import APIRequestFactory, force_authenticate

from connect_access.users.tests.factories import UserFactory

from ..api import MediationRequestViewSet, TraceReportViewSet
from ..models import MediationRequest, MediationRequestStatus, TraceReport
from .factories import MediationRequestFactory, TraceReportFactory
from .utils import (
    _authenticate_request_as_admin,
    _get_mediation_request_absolute_url,
    _get_trace_report_absolute_url,
)

pytestmark = pytest.mark.django_db


# MediationRequest


def test_mediation_requests_list_contains_all_mediation_requests():
    mediation_request1 = MediationRequestFactory()
    mediation_request2 = MediationRequestFactory()
    request = APIRequestFactory().get(_get_mediation_request_absolute_url("list"))
    _authenticate_request_as_admin(request)
    response = MediationRequestViewSet.as_view({"get": "list"})(request)
    assertContains(response, mediation_request1.issue_description)
    assertContains(response, mediation_request2.issue_description)


def test_mediation_requests_list_sorts_requests_by_request_date_from_the_most_recent_to_the_oldest():
    mediation_request1 = MediationRequestFactory(
        request_date="2020-05-27T23:10:05.084022+02:00"
    )
    mediation_request2 = MediationRequestFactory(
        request_date="2020-05-28T23:10:05.084022+02:00"
    )
    mediation_request3 = MediationRequestFactory(
        request_date="2020-05-27T23:05:08.084022+02:00"
    )
    request = APIRequestFactory().get(_get_mediation_request_absolute_url("list"))
    _authenticate_request_as_admin(request)
    response = MediationRequestViewSet.as_view({"get": "list"})(request)
    assert response.data[0]["request_date"] == mediation_request2.request_date
    assert response.data[1]["request_date"] == mediation_request1.request_date
    assert response.data[2]["request_date"] == mediation_request3.request_date


def test_mediation_request_create_with_authorirequest_dateed_status_succeeds(
    request_data_for_mediation_request,
):
    number_of_tests = 0
    for name in MediationRequestStatus.names:
        if (
            name == MediationRequestStatus.PENDING.name
            or name == MediationRequestStatus.WAITING_MEDIATOR_VALIDATION.name
        ):
            assert MediationRequest.objects.count() == 0
            _add_mediation_request(request_data_for_mediation_request, name)
            assert MediationRequest.objects.count() == 1
            MediationRequest.objects.all().delete()
            number_of_tests += 1
    assert number_of_tests == 2


@pytest.mark.usefixtures("_set_default_language")
def test_mediation_request_create_with_unauthorized_status_fails(
    request_data_for_mediation_request,
):
    number_of_tests = 0
    for name in MediationRequestStatus.names:
        if (
            name != MediationRequestStatus.PENDING.name
            and name != MediationRequestStatus.WAITING_MEDIATOR_VALIDATION.name
        ):
            assert MediationRequest.objects.count() == 0
            response = _add_mediation_request(request_data_for_mediation_request, name)
            assert response.status_code == 400
            assert response.data == {
                "message": str(
                    "mediation request creation failed:"
                    " unauthorized mediation request status"
                ),
            }
            assert MediationRequest.objects.count() == 0
            MediationRequest.objects.all().delete()
            number_of_tests += 1
    assert number_of_tests == 7


def _add_mediation_request(request_data_for_mediation_request, status):
    request_data_for_mediation_request["status"] = status
    url = _get_mediation_request_absolute_url("list")
    request_post = APIRequestFactory(status=status).post(
        url, data=request_data_for_mediation_request, format="json"
    )
    _authenticate_request_as_admin(request_post)
    return MediationRequestViewSet.as_view({"post": "create"})(request_post)


def test_mediation_request_delete():
    mediation_request = MediationRequestFactory()
    detail_url = _get_mediation_request_absolute_url("detail", mediation_request.uuid)
    request_delete = APIRequestFactory().delete(detail_url)
    _authenticate_request_as_admin(request_delete)
    assert MediationRequest.objects.count() == 1
    MediationRequestViewSet.as_view({"delete": "destroy"})(
        request_delete, uuid=mediation_request.uuid
    )
    assert MediationRequest.objects.count() == 0


def test_mediation_request_retrieve():
    mediation_request = MediationRequestFactory()
    detail_url = _get_mediation_request_absolute_url("detail", mediation_request.uuid)
    request_retrieve = APIRequestFactory().get(detail_url)
    _authenticate_request_as_admin(request_retrieve)
    response = MediationRequestViewSet.as_view({"get": "retrieve"})(
        request_retrieve, uuid=mediation_request.uuid
    )
    assertContains(response, mediation_request.issue_description)


def test_mediation_request_update(request_data_for_mediation_request):
    mediation_request = MediationRequestFactory(issue_description="Initial problem")
    detail_url = _get_mediation_request_absolute_url("detail", mediation_request.uuid)
    request_update = APIRequestFactory().put(
        detail_url, data=request_data_for_mediation_request, format="json"
    )
    _authenticate_request_as_admin(request_update)
    response = MediationRequestViewSet.as_view({"put": "update"})(
        request_update, uuid=mediation_request.uuid
    )
    assertContains(response, "Here is the problem")
    assertNotContains(response, "Initial problem")


def test_mediation_requests_user_contains_all_user_related_mediation_requests():
    mediation_request1 = MediationRequestFactory(complainant=None)
    mediation_request2 = MediationRequestFactory()
    complainant = UserFactory()
    mediation_request3 = MediationRequestFactory(complainant=complainant)
    mediation_request4 = MediationRequestFactory(complainant=complainant)
    request = APIRequestFactory().get(_get_mediation_request_absolute_url("user"))
    force_authenticate(request, user=complainant)
    response = MediationRequestViewSet.as_view({"get": "user"})(request)
    assertNotContains(response, mediation_request1.issue_description)
    assertNotContains(response, mediation_request2.issue_description)
    assertContains(response, mediation_request3.issue_description)
    assertContains(response, mediation_request4.issue_description)


@pytest.mark.usefixtures("_set_default_language")
@override_settings(MEDIATION_REQUEST_EMAIL="mediator@mediation.org")
def test_send_emails_when_a_mediation_request_is_created(
    request_data_for_mediation_request_creation,
):
    # An email is sent to complainant, and another one to MEDIATION_REQUEST_EMAIL.
    assert len(mail.outbox) == 0
    _add_mediation_request(
        request_data_for_mediation_request_creation,
        MediationRequestStatus.WAITING_MEDIATOR_VALIDATION.name,
    )
    assert len(mail.outbox) == 2
    assert mail.outbox[0].recipients() == ["john@doe.com"]
    assert "successfully" in mail.outbox[0].subject
    assert mail.outbox[1].recipients() == ["mediator@mediation.org"]
    assert "new" in mail.outbox[1].subject


# TraceReport


def test_trace_reports_list_contains_all_trace_reports():
    trace_report1 = TraceReportFactory()
    trace_report2 = TraceReportFactory()
    request = APIRequestFactory().get(_get_trace_report_absolute_url("list"))
    _authenticate_request_as_admin(request)
    response = TraceReportViewSet.as_view({"get": "list"})(request)
    assertContains(response, trace_report1.comment)
    assertContains(response, trace_report2.comment)


def test_trace_report_create(
    request_data_for_trace_report,
):
    assert TraceReport.objects.count() == 0
    _add_trace_report(request_data_for_trace_report)
    assert TraceReport.objects.count() == 1


def _add_trace_report(request_data_for_trace_report):
    url = _get_trace_report_absolute_url("list")
    request_post = APIRequestFactory().post(
        url, data=request_data_for_trace_report, format="json"
    )
    _authenticate_request_as_admin(request_post)
    return TraceReportViewSet.as_view({"post": "create"})(request_post)


def test_trace_reports_by_mediation_request_contains_all_needed_trace_reports():
    mediation_request = MediationRequestFactory()
    trace_report1 = TraceReportFactory(mediation_request=mediation_request)
    trace_report2 = TraceReportFactory(mediation_request=mediation_request)
    trace_report3 = TraceReportFactory()
    request = APIRequestFactory().get(
        _get_trace_report_absolute_url("by-mediation-request", mediation_request.uuid)
    )
    _authenticate_request_as_admin(request)
    response = TraceReportViewSet.as_view({"get": "by_mediation_request"})(
        request, mediation_request_id=mediation_request.uuid
    )
    assertContains(response, trace_report1.comment)
    assertContains(response, trace_report2.comment)
    assertNotContains(response, trace_report3.comment)
