import pytest
from django.urls import resolve, reverse

from connect_access.apps.users.models import User

pytestmark = pytest.mark.django_db


def test_user_detail(user: User):
    assert (
        reverse("api:user-detail", kwargs={"email": user.email})
        == f"/api/users/{user.email}/"
    )
    assert resolve(f"/api/users/{user.email}/").view_name == "api:user-detail"


def test_user_list():
    assert reverse("api:user-list") == "/api/users/"
    assert resolve("/api/users/").view_name == "api:user-list"
