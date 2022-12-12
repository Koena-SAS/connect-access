import pytest
from django.urls import resolve, reverse

from connect_access.core.loading import get_class

pytestmark = pytest.mark.django_db

MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)


class TestURLS:
    def test_mediation_requests_detail(self):
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

    def test_mediation_requests_list(self):
        assert reverse("api:mediation_requests-list") == "/api/mediation-requests/"
        assert (
            resolve("/api/mediation-requests/").view_name
            == "api:mediation_requests-list"
        )

    def test_mediation_requests_user(self):
        assert reverse("api:mediation_requests-user") == "/api/mediation-requests/user/"
        assert (
            resolve("/api/mediation-requests/user/").view_name
            == "api:mediation_requests-user"
        )
