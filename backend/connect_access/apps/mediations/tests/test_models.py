import os.path

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile

from connect_access.core.loading import get_class, get_model

pytestmark = pytest.mark.django_db

MediationRequest = get_model("mediations", "MediationRequest")
MediationRequestStatus = get_class("mediations.choices", "MediationRequestStatus")
MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)
UserFactory = get_class("users.tests.factories", "UserFactory")


class TestMediationModels:
    @pytest.mark.usefixtures("_set_default_language")
    def test_mediation_request_str(self):
        mediation_request = MediationRequestFactory()
        assert str(mediation_request.uuid) == str(mediation_request)

    def test_attached_file_with_complainant_is_stored_in_correct_path(self):
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

    def test_attached_file_without_complainant_is_stored_in_correct_path(self):
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
            mediation_request.attached_file.name
            == "further_info/anonymous/test_file.png"
        )

    def test_attached_file_is_removed_when_removing_from_db(self):
        attached_file = SimpleUploadedFile(
            "test_file.png",
            b"file content",
            content_type="multipart/form-data",
        )
        mediation_request = MediationRequestFactory(
            complainant=None, attached_file=attached_file
        )
        assert os.path.isfile(
            f"{settings.MEDIA_ROOT}/further_info/anonymous/test_file.png"
        )
        mediation_request.attached_file = None  # type: ignore
        mediation_request.save()
        assert not os.path.isfile(
            f"{settings.MEDIA_ROOT}/further_info/anonymous/test_file.png"
        )

    @pytest.mark.usefixtures("_set_default_language")
    def test_mediation_request_phone_number_regex_validation(self, field_checker):
        field_checker.check_phone_format(MediationRequestFactory, "phone_number")

    @pytest.mark.usefixtures("_set_default_language")
    def test_mediation_request_domain_name_regex_validation(self, field_checker):
        field_checker.check_url_format(MediationRequestFactory, "url")

    @pytest.mark.parametrize(
        "closing_status",
        [
            MediationRequestStatus.CLOTURED.value,
            MediationRequestStatus.MEDIATION_FAILED.value,
        ],
    )
    def test_removes_personal_information_when_mediation_request_is_closed_with_request_not_attached_to_complainant(
        self,
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
