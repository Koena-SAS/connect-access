import pytest
from django.urls import resolve, reverse

pytestmark = pytest.mark.django_db


class TestUrls:
    def test_user_detail(self, user):
        assert (
            reverse("api:user-detail", kwargs={"email": user.email})
            == f"/api/users/{user.email}/"
        )
        assert resolve(f"/api/users/{user.email}/").view_name == "api:user-detail"

    def test_user_list(self):
        assert reverse("api:user-list") == "/api/users/"
        assert resolve("/api/users/").view_name == "api:user-list"
