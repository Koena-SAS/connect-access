from operator import itemgetter

import pytest
from dateutil.parser import parse
from pytest_django.asserts import assertContains
from rest_framework.test import APIRequestFactory

from connect_access.core.loading import get_class, get_classes, get_model

from .utils import _execute_mediation_request_list, _get_mediation_request_absolute_url

pytestmark = pytest.mark.django_db

UserFactory = get_class("users.tests.factories", "UserFactory")
MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)
MediationRequestViewSet = get_class("mediations.api", "MediationRequestViewSet")
MediationRequest = get_model("mediations", "MediationRequest")

(
    AssistiveTechnology,
    Browser,
    InaccessibilityLevel,
    MediationRequestStatus,
    MobileAppPlatform,
    UrgencyLevel,
) = get_classes(
    "mediations.choices",
    [
        "AssistiveTechnology",
        "Browser",
        "InaccessibilityLevel",
        "MediationRequestStatus",
        "MobileAppPlatform",
        "UrgencyLevel",
    ],
)


def test_mediation_request_serializes_correctly_all_fields(authenticate):
    mediation_request, response = itemgetter("mediation_request", "response")(
        _execute_mediation_request_list(permission="admin", auth=authenticate)
    )
    data = response.data[0]
    assertContains(response, str(mediation_request.uuid))
    parse(data["creation_date"])  # we test that parsing it to datime does not raise
    parse(data["modification_date"])  # we test that parsing it to datime does not raise
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


def test_mediation_request_serializes_nullboolean_fields_to_empty_str_if_they_are_null(
    authenticate,
):
    MediationRequestFactory(
        browser_used="",
        mobile_app_used="",
        did_tell_organization=None,
        did_organization_reply=None,
    )
    url = _get_mediation_request_absolute_url("list")
    request = APIRequestFactory().get(url)
    authenticate.authenticate_request_as_admin(request)
    response = MediationRequestViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    data = response.data[0]
    assert data["browser_used"] == ""
    assert data["mobile_app_used"] == ""
    assert data["did_tell_organization"] == ""
    assert data["did_organization_reply"] == ""


def test_mediation_request_serializes_empty_enums_to_empty_values(authenticate):
    MediationRequestFactory(
        assistive_technology_used=[""],
        browser="",
        urgency="",
        mobile_app_platform="",
        inaccessibility_level="",
    )
    url = _get_mediation_request_absolute_url("list")
    request = APIRequestFactory().get(url)
    authenticate.authenticate_request_as_admin(request)
    response = MediationRequestViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    data = response.data[0]
    assert data["assistive_technology_used"] == []
    assert data["browser"] == ""
    assert data["urgency"] == ""
    assert data["mobile_app_platform"] == ""
    assert data["inaccessibility_level"] == ""


def test_mediation_request_deserializes_correctly_all_fields(authenticate, image_file):
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
        "attached_file": image_file,
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
    authenticate.authenticate_request_as_admin(request_create)
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


def test_mediation_request_deserializes_nullboolean_fields_to_none_if_they_are_empty(
    authenticate,
):
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
    authenticate.authenticate_request_as_admin(request_create)
    MediationRequestViewSet.as_view({"post": "create"})(request_create)
    mediation_request = MediationRequest.objects.first()
    assert mediation_request.browser_used is None
    assert mediation_request.mobile_app_used is None
    assert mediation_request.did_tell_organization is None
    assert mediation_request.did_organization_reply is None


def test_mediation_request_replies_with_error_if_nullboolean_field_has_incorrect_value(
    authenticate,
):
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
    authenticate.authenticate_request_as_admin(request_create)
    response = MediationRequestViewSet.as_view({"post": "create"})(request_create)
    assert response.status_code == 400


def test_mediation_request_replies_with_error_if_mandatory_email_is_not_provided(
    authenticate,
):
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
    authenticate.authenticate_request_as_admin(request_create)
    response = MediationRequestViewSet.as_view({"post": "create"})(request_create)
    assert response.status_code == 400
    assert "email" in response.data


def test_mediation_request_deserializes_empty_enum_values_correctly(authenticate):
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
    authenticate.authenticate_request_as_admin(request_create)
    MediationRequestViewSet.as_view({"post": "create"})(request_create)
    mediation_request = MediationRequest.objects.first()
    assert mediation_request.assistive_technology_used == []
    assert mediation_request.browser == ""
    assert mediation_request.urgency == ""
    assert mediation_request.inaccessibility_level == ""
    assert mediation_request.mobile_app_platform == ""
