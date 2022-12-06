import pytest
from rest_framework.test import force_authenticate

from .factories import AdminUserFactory, UserFactory

__all__ = ["user", "authenticate"]


@pytest.fixture()
def user():
    return UserFactory()


class Authenticate(object):
    @staticmethod
    def authenticate_request_as_admin(request):
        admin_user = AdminUserFactory()
        force_authenticate(request, user=admin_user)

    @staticmethod
    def authenticate_request_as_user(request):
        user = UserFactory()
        force_authenticate(request, user=user)

    @staticmethod
    def authenticate_if_needed(request, permission):
        if permission == "admin":
            Authenticate.authenticate_request_as_admin(request)
        elif permission == "user":
            Authenticate.authenticate_request_as_user(request)


@pytest.fixture()
def authenticate():
    return Authenticate()
