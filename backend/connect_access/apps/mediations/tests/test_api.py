import pytest
from django.core import mail
from django.test import override_settings
from pytest_django.asserts import assertContains, assertNotContains
from rest_framework.test import APIRequestFactory, force_authenticate

from connect_access.core.loading import get_class, get_model

from .utils import _add_mediation_request, _get_mediation_request_absolute_url

pytestmark = pytest.mark.django_db

MediationRequest = get_model("mediations", "MediationRequest")
MediationRequestViewSet = get_class("mediations.api", "MediationRequestViewSet")
MediationRequestStatus = get_class("mediations.choices", "MediationRequestStatus")
MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)
UserFactory = get_class("users.tests.factories", "UserFactory")


class TestAPI:
    def test_mediation_requests_list_contains_all_mediation_requests(
        self, authenticate
    ):
        mediation_request1 = MediationRequestFactory()
        mediation_request2 = MediationRequestFactory()
        request = APIRequestFactory().get(_get_mediation_request_absolute_url("list"))
        authenticate.authenticate_request_as_admin(request)
        response = MediationRequestViewSet.as_view({"get": "list"})(request)
        assertContains(response, mediation_request1.issue_description)
        assertContains(response, mediation_request2.issue_description)

    def test_mediation_requests_list_sorts_requests_by_request_date_from_the_most_recent_to_the_oldest(
        self,
        authenticate,
    ):
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
        authenticate.authenticate_request_as_admin(request)
        response = MediationRequestViewSet.as_view({"get": "list"})(request)
        assert response.data[0]["request_date"] == mediation_request2.request_date
        assert response.data[1]["request_date"] == mediation_request1.request_date
        assert response.data[2]["request_date"] == mediation_request3.request_date

    def test_mediation_request_create_with_authorirequest_dateed_status_succeeds(
        self, request_data_for_mediation_request, authenticate
    ):
        number_of_tests = 0
        for name in MediationRequestStatus.names:
            if name in [
                MediationRequestStatus.PENDING.name,
                MediationRequestStatus.WAITING_MEDIATOR_VALIDATION.name,
            ]:
                assert MediationRequest.objects.count() == 0
                _add_mediation_request(
                    request_data_for_mediation_request, name, authenticate
                )
                assert MediationRequest.objects.count() == 1
                MediationRequest.objects.all().delete()
                number_of_tests += 1
        assert number_of_tests == 2

    @pytest.mark.usefixtures("_set_default_language")
    def test_mediation_request_create_with_unauthorized_status_fails(
        self, request_data_for_mediation_request, authenticate
    ):
        number_of_tests = 0
        for name in MediationRequestStatus.names:
            if (
                name != MediationRequestStatus.PENDING.name
                and name != MediationRequestStatus.WAITING_MEDIATOR_VALIDATION.name
            ):
                assert MediationRequest.objects.count() == 0
                response = _add_mediation_request(
                    request_data_for_mediation_request, name, authenticate
                )
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

    def test_mediation_request_delete(self, authenticate):
        mediation_request = MediationRequestFactory()
        detail_url = _get_mediation_request_absolute_url(
            "detail", mediation_request.uuid
        )
        request_delete = APIRequestFactory().delete(detail_url)
        authenticate.authenticate_request_as_admin(request_delete)
        assert MediationRequest.objects.count() == 1
        MediationRequestViewSet.as_view({"delete": "destroy"})(
            request_delete, uuid=mediation_request.uuid
        )
        assert MediationRequest.objects.count() == 0

    def test_mediation_request_retrieve(self, authenticate):
        mediation_request = MediationRequestFactory()
        detail_url = _get_mediation_request_absolute_url(
            "detail", mediation_request.uuid
        )
        request_retrieve = APIRequestFactory().get(detail_url)
        authenticate.authenticate_request_as_admin(request_retrieve)
        response = MediationRequestViewSet.as_view({"get": "retrieve"})(
            request_retrieve, uuid=mediation_request.uuid
        )
        assertContains(response, mediation_request.issue_description)

    def test_mediation_request_update(
        self, request_data_for_mediation_request, authenticate
    ):
        mediation_request = MediationRequestFactory(issue_description="Initial problem")
        detail_url = _get_mediation_request_absolute_url(
            "detail", mediation_request.uuid
        )
        request_update = APIRequestFactory().put(
            detail_url, data=request_data_for_mediation_request, format="json"
        )
        authenticate.authenticate_request_as_admin(request_update)
        response = MediationRequestViewSet.as_view({"put": "update"})(
            request_update, uuid=mediation_request.uuid
        )
        assertContains(response, "Here is the problem")
        assertNotContains(response, "Initial problem")

    def test_mediation_requests_user_contains_all_user_related_mediation_requests(self):
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
        self, request_data_for_mediation_request_creation, authenticate
    ):
        # An email is sent to complainant, and another one to MEDIATION_REQUEST_EMAIL.
        assert len(mail.outbox) == 0
        _add_mediation_request(
            request_data_for_mediation_request_creation,
            MediationRequestStatus.WAITING_MEDIATOR_VALIDATION.name,
            authenticate,
        )
        assert len(mail.outbox) == 2
        assert mail.outbox[0].recipients() == ["john@doe.com"]
        assert "successfully" in mail.outbox[0].subject
        assert mail.outbox[1].recipients() == ["mediator@mediation.org"]
        assert "new" in mail.outbox[1].subject
