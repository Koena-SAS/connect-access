from io import BytesIO
from operator import itemgetter

import pytest
from dateutil.parser import parse
from django.core.files import File
from PIL import Image
from pytest_django.asserts import assertContains
from rest_framework.test import APIRequestFactory

from connect_access.users.tests.factories import UserFactory

from ..api import MediationRequestViewSet, TraceReportViewSet
from ..models import (
    AssistiveTechnology,
    Browser,
    ContactEntityType,
    InaccessibilityLevel,
    MediationRequest,
    MediationRequestStatus,
    MobileAppPlatform,
    TraceReport,
    TraceType,
    UrgencyLevel,
)
from .factories import MediationRequestFactory
from .utils import (
    _authenticate_request_as_admin,
    _execute_mediation_request_list,
    _execute_trace_report_by_mediation_request,
    _execute_trace_report_list,
    _get_mediation_request_absolute_url,
    _get_trace_report_absolute_url,
)

pytestmark = pytest.mark.django_db


# MediationRequest


def test_mediation_request_serializes_correctly_all_fields():
    mediation_request, response = itemgetter("mediation_request", "response")(
        _execute_mediation_request_list(permission="admin")
    )
    data = response.data[0]
    assertContains(response, str(mediation_request.uuid))
    parse(data["creation_date"])  # we test that parsing it to datime does not raise
    parse(data["request_date"])  # we test that parsing it to datime does not raise
    assertContains(response, str(mediation_request.complainant.uuid))
    assertContains(response, MediationRequestStatus(mediation_request.status).name)
    assertContains(response, mediation_request.first_name)
    assertContains(response, mediation_request.last_name)
    assertContains(response, mediation_request.email)
    assertContains(response, mediation_request.phone_number)
    for assistive_technology in mediation_request.assistive_technology_used:
        assertContains(response, AssistiveTechnology(assistive_technology).name)
    assertContains(response, mediation_request.technology_name)
    assertContains(response, mediation_request.technology_version)
    assertContains(response, UrgencyLevel(mediation_request.urgency).name)
    assertContains(response, mediation_request.issue_description)
    assertContains(response, mediation_request.step_description)
    assertContains(
        response, InaccessibilityLevel(mediation_request.inaccessibility_level).name
    )
    assert data["browser_used"] == "YES" if mediation_request.browser_used else "NO"
    assertContains(response, mediation_request.url)
    assertContains(response, Browser(mediation_request.browser).name)
    assertContains(response, mediation_request.browser_version)
    assert (
        data["mobile_app_used"] == "YES" if mediation_request.mobile_app_used else "NO"
    )
    assertContains(
        response, MobileAppPlatform(mediation_request.mobile_app_platform).name
    )
    assertContains(response, mediation_request.mobile_app_name)
    assertContains(response, mediation_request.other_used_software)
    assert (
        data["did_tell_organization"] == "YES"
        if mediation_request.did_tell_organization
        else "NO"
    )
    assert (
        data["did_organization_reply"] == "YES"
        if mediation_request.did_organization_reply
        else "NO"
    )
    assertContains(response, mediation_request.organization_reply)
    assertContains(response, mediation_request.further_info)
    assert mediation_request.attached_file.url in data["attached_file"]
    assertContains(response, mediation_request.organization_name)
    assert mediation_request.organization_address == data["organization_address"]
    assertContains(response, mediation_request.organization_email)
    assertContains(response, mediation_request.organization_phone_number)
    assertContains(response, mediation_request.organization_contact)


def test_mediation_request_serializes_nullboolean_fields_to_empty_str_if_they_are_null():
    MediationRequestFactory(
        browser_used="",
        mobile_app_used="",
        did_tell_organization=None,
        did_organization_reply=None,
    )
    url = _get_mediation_request_absolute_url("list")
    request = APIRequestFactory().get(url)
    _authenticate_request_as_admin(request)
    response = MediationRequestViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    data = response.data[0]
    assert data["browser_used"] == ""
    assert data["mobile_app_used"] == ""
    assert data["did_tell_organization"] == ""
    assert data["did_organization_reply"] == ""


def test_mediation_request_serializes_empty_enums_to_empty_values():
    MediationRequestFactory(
        assistive_technology_used=[""],
        browser="",
        urgency="",
        mobile_app_platform="",
        inaccessibility_level="",
    )
    url = _get_mediation_request_absolute_url("list")
    request = APIRequestFactory().get(url)
    _authenticate_request_as_admin(request)
    response = MediationRequestViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    data = response.data[0]
    assert data["assistive_technology_used"] == []
    assert data["browser"] == ""
    assert data["urgency"] == ""
    assert data["mobile_app_platform"] == ""
    assert data["inaccessibility_level"] == ""


def test_mediation_request_deserializes_correctly_all_fields():
    complainant = UserFactory()
    request_data = {
        "complainant": str(complainant.uuid),
        "status": "WAITING_MEDIATOR_VALIDATION",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@doe.com",
        "phone_number": "0000000000",
        "assistive_technology_used": [
            "SCREEN_READER_VOCAL_SYNTHESIS",
            "BRAILLE_DISPLAY",
        ],
        "technology_name": "Screen reader tech",
        "technology_version": "V3.5",
        "urgency": "MODERATELY_URGENT",
        "issue_description": "Here is the problem",
        "step_description": "Here are the steps",
        "inaccessibility_level": "RANDOM_ACCESS",
        "browser_used": "YES",
        "url": "https://koena.net",
        "browser": "FIREFOX",
        "browser_version": "63.2",
        "mobile_app_used": "YES",
        "mobile_app_platform": "IOS",
        "mobile_app_name": "Super app",
        "other_used_software": "Connected object",
        "did_tell_organization": "YES",
        "did_organization_reply": "NO",
        "organization_reply": "There was no reply.",
        "further_info": "Some more details",
        "attached_file": get_image_file(),
        "organization_name": "Koena",
        "organization_address": "2, esplanade de la Gare à Sannois (95110) FRANCE",
        "organization_email": "aloha@koena.net",
        "organization_phone_number": "0972632128",
        "organization_contact": "Armony",
    }
    url = _get_mediation_request_absolute_url("list")
    request_create = APIRequestFactory().post(
        url, data=request_data, format="multipart"
    )
    _authenticate_request_as_admin(request_create)
    MediationRequestViewSet.as_view({"post": "create"})(request_create)
    mediation_request = MediationRequest.objects.first()
    assert str(mediation_request.complainant.uuid) in request_data.values()
    assert (
        MediationRequestStatus(mediation_request.status).name in request_data.values()
    )
    assert mediation_request.first_name in request_data.values()
    assert mediation_request.last_name in request_data.values()
    assert mediation_request.email in request_data.values()
    assert mediation_request.phone_number in request_data.values()
    for assistive_technology in mediation_request.assistive_technology_used:
        assert (
            AssistiveTechnology(assistive_technology).name
            in request_data["assistive_technology_used"]
        )
    assert mediation_request.technology_name in request_data.values()
    assert mediation_request.technology_version in request_data.values()
    assert UrgencyLevel(mediation_request.urgency).name in request_data.values()
    assert mediation_request.issue_description in request_data.values()
    assert mediation_request.step_description in request_data.values()
    assert (
        InaccessibilityLevel(mediation_request.inaccessibility_level).name
        in request_data.values()
    )
    assert mediation_request.browser_used is True
    assert mediation_request.url in request_data.values()
    assert Browser(mediation_request.browser).name in request_data.values()
    assert mediation_request.browser_version in request_data.values()
    assert mediation_request.mobile_app_used is True
    assert (
        MobileAppPlatform(mediation_request.mobile_app_platform).name
        in request_data.values()
    )
    assert mediation_request.mobile_app_name in request_data.values()
    assert mediation_request.other_used_software in request_data.values()
    assert mediation_request.did_tell_organization is True
    assert mediation_request.did_organization_reply is False
    assert mediation_request.organization_reply in request_data.values()
    assert mediation_request.further_info in request_data.values()
    request_data["attached_file"].seek(0)
    assert (
        mediation_request.attached_file.readlines()
        == request_data["attached_file"].readlines()
    )
    assert mediation_request.organization_name in request_data.values()
    assert (
        mediation_request.organization_address == request_data["organization_address"]
    )
    assert mediation_request.organization_email in request_data.values()
    assert mediation_request.organization_phone_number in request_data.values()
    assert mediation_request.organization_contact in request_data.values()


def get_image_file(name="test.png", ext="png", size=(50, 50), color=(256, 0, 0)):
    file_obj = BytesIO()
    image = Image.new("RGBA", size=size, color=color)
    image.save(file_obj, ext)
    file_obj.seek(0)
    return File(file_obj, name=name)


def test_mediation_request_deserializes_nullboolean_fields_to_none_if_they_are_empty():
    request_data = {
        "status": "WAITING_MEDIATOR_VALIDATION",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@doe.com",
        "browser_used": "",
        "step_description": "Here are the steps",
        "issue_description": "Here is the problem",
        "did_tell_organization": "",
        "did_organization_reply": "",
        "mobile_app_used": "",
    }
    url = _get_mediation_request_absolute_url("list")
    request_create = APIRequestFactory().post(
        url, data=request_data, format="multipart"
    )
    _authenticate_request_as_admin(request_create)
    MediationRequestViewSet.as_view({"post": "create"})(request_create)
    mediation_request = MediationRequest.objects.first()
    assert mediation_request.browser_used is None
    assert mediation_request.mobile_app_used is None
    assert mediation_request.did_tell_organization is None
    assert mediation_request.did_organization_reply is None


def test_mediation_request_replies_with_error_if_nullboolean_field_has_incorrect_value():
    request_data = {
        "status": "WAITING_MEDIATOR_VALIDATION",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@doe.com",
        "step_description": "Here are the steps",
        "issue_description": "Here is the problem",
        "did_organization_reply": "abc",
    }
    url = _get_mediation_request_absolute_url("list")
    request_create = APIRequestFactory().post(
        url, data=request_data, format="multipart"
    )
    _authenticate_request_as_admin(request_create)
    response = MediationRequestViewSet.as_view({"post": "create"})(request_create)
    assert response.status_code == 400


def test_mediation_request_replies_with_error_if_mandatory_email_is_not_provided():
    request_data = {
        "status": "WAITING_MEDIATOR_VALIDATION",
        "first_name": "John",
        "last_name": "Doe",
        "step_description": "Here are the steps",
        "issue_description": "Here is the problem",
    }
    url = _get_mediation_request_absolute_url("list")
    request_create = APIRequestFactory().post(
        url, data=request_data, format="multipart"
    )
    _authenticate_request_as_admin(request_create)
    response = MediationRequestViewSet.as_view({"post": "create"})(request_create)
    assert response.status_code == 400
    assert "email" in response.data


def test_mediation_request_deserializes_empty_enum_values_correctly():
    request_data = {
        "status": "WAITING_MEDIATOR_VALIDATION",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@doe.com",
        "step_description": "Here are the steps",
        "issue_description": "Here is the problem",
        "assistive_technology_used": [""],
        "browser": "",
        "mobile_app_platform": "",
    }
    url = _get_mediation_request_absolute_url("list")
    request_create = APIRequestFactory().post(
        url, data=request_data, format="multipart"
    )
    _authenticate_request_as_admin(request_create)
    MediationRequestViewSet.as_view({"post": "create"})(request_create)
    mediation_request = MediationRequest.objects.first()
    assert mediation_request.assistive_technology_used == []
    assert mediation_request.browser == ""
    assert mediation_request.urgency == ""
    assert mediation_request.inaccessibility_level == ""
    assert mediation_request.mobile_app_platform == ""


# TraceReport


def test_trace_report_serializes_correctly_all_fields():
    trace_report, response = itemgetter("trace_report", "response")(
        _execute_trace_report_list(permission="admin")
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


def test_trace_report_deserializes_correctly_all_fields():
    mediation_request = MediationRequestFactory()
    request_data = {
        "mediation_request": str(mediation_request.uuid),
        "trace_type": "CALL",
        "sender_type": "COMPLAINANT",
        "sender_name": "John Doe",
        "recipient_type": "ORGANIZATION",
        "recipient_name": "Jane Doe",
        "contact_date": "2020-02-15T00:00:00Z",
        "comment": "This is what hapened",
        "attached_file": get_image_file(),
    }
    url = _get_trace_report_absolute_url("list")
    request_create = APIRequestFactory().post(
        url, data=request_data, format="multipart"
    )
    _authenticate_request_as_admin(request_create)
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


def test_trace_report_by_mediation_request_serializes_correctly_all_fields():
    trace_report1, trace_report2, mediation_request_uuid, response = itemgetter(
        "trace_report1", "trace_report2", "mediation_request_uuid", "response"
    )(_execute_trace_report_by_mediation_request(permission="admin"))
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
