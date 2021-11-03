import os.path

import pytest
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile

from connect_access.users.tests.factories import UserFactory

from ..models import MediationRequestStatus
from .factories import MediationRequestFactory, TraceReportFactory

pytestmark = pytest.mark.django_db


# MediationRequest


@pytest.mark.usefixtures("_set_default_language")
def test_mediation_request_str():
    mediation_request = MediationRequestFactory()
    assert str(mediation_request.uuid) == str(mediation_request)


def test_attached_file_with_complainant_is_stored_in_correct_path():
    user = UserFactory()
    attached_file = SimpleUploadedFile(
        "test_file.png",
        b"file content",
        content_type="multipart/form-data",
    )
    mediation_request = MediationRequestFactory(
        complainant=user,
        attached_file=attached_file,
    )
    assert (
        mediation_request.attached_file.name
        == f"further_info/user_{user.uuid}/test_file.png"
    )


def test_attached_file_without_complainant_is_stored_in_correct_path():
    attached_file = SimpleUploadedFile(
        "test_file.png",
        b"file content",
        content_type="multipart/form-data",
    )
    mediation_request = MediationRequestFactory(
        complainant=None,
        attached_file=attached_file,
    )
    assert (
        mediation_request.attached_file.name == "further_info/anonymous/test_file.png"
    )


@pytest.mark.usefixtures("_set_default_language")
def test_mediation_request_phone_number_regex_validation():
    MediationRequestFactory(phone_number="1687416238")
    MediationRequestFactory(phone_number="+1687416238")
    mediation_request = MediationRequestFactory(phone_number="a1687416238")
    with pytest.raises(ValidationError, match="Phone number must have"):
        mediation_request.full_clean()
    mediation_request = MediationRequestFactory(phone_number="6238")
    with pytest.raises(ValidationError, match="Phone number must have"):
        mediation_request.full_clean()


@pytest.mark.usefixtures("_set_default_language")
def test_mediation_request_domain_name_regex_validation():
    MediationRequestFactory(url="koena.net")
    MediationRequestFactory(url="http://koena.net")
    MediationRequestFactory(url="https://koena.net")
    mediation_request = MediationRequestFactory(url="koena")
    with pytest.raises(ValidationError, match="Domain name must be"):
        mediation_request.full_clean()
    mediation_request = MediationRequestFactory(url="http:/koena.net")
    with pytest.raises(ValidationError, match="Domain name must be"):
        mediation_request.full_clean()
    mediation_request = MediationRequestFactory(url="https://koena")
    with pytest.raises(ValidationError, match="Domain name must be"):
        mediation_request.full_clean()


@pytest.mark.parametrize(
    "closing_status",
    [
        MediationRequestStatus.CLOTURED.value,
        MediationRequestStatus.MEDIATION_FAILED.value,
    ],
)
def test_removes_personal_information_when_mediation_request_is_closed_with_request_not_attached_to_complainant(
    closing_status,
):
    mediation_request = MediationRequestFactory(
        complainant=None,
    )
    mediation_request.status = closing_status
    mediation_request.save()
    assert not mediation_request.first_name
    assert not mediation_request.last_name
    assert not mediation_request.email
    assert not mediation_request.phone_number


# TraceReport


@pytest.mark.usefixtures("_set_default_language")
def test_trace_report_str():
    trace_report = TraceReportFactory()
    assert str(trace_report.uuid) == str(trace_report)


def test_trace_report_attached_file_is_stored_in_correct_path():
    mediation_request = MediationRequestFactory()
    attached_file = SimpleUploadedFile(
        "test_file.png",
        b"file content",
        content_type="multipart/form-data",
    )
    trace_report = TraceReportFactory(
        mediation_request=mediation_request,
        attached_file=attached_file,
    )
    assert (
        trace_report.attached_file.name
        == f"trace_report/mediation_request_{mediation_request.uuid}/test_file.png"
    )


def test_trace_report_attached_file_is_removed_when_removing_from_db():
    mediation_request = MediationRequestFactory()
    attached_file = SimpleUploadedFile(
        "test_file.png",
        b"file content",
        content_type="multipart/form-data",
    )
    trace_report = TraceReportFactory(
        mediation_request=mediation_request,
        attached_file=attached_file,
    )
    assert os.path.isfile(
        f"{settings.MEDIA_ROOT}/trace_report/mediation_request_{mediation_request.uuid}/test_file.png"
    )
    trace_report.attached_file = None  # type: ignore
    trace_report.save()
    assert not os.path.isfile(
        f"{settings.MEDIA_ROOT}/trace_report/mediation_request_{mediation_request.uuid}/test_file.png"
    )
