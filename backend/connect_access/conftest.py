from io import BytesIO

import pytest
from django.core.files import File
from django.utils.translation import activate
from PIL import Image
from rest_framework.test import force_authenticate

from connect_access.apps.users.tests.factories import AdminUserFactory, UserFactory


@pytest.fixture(autouse=True)
def _media_storage(settings, tmpdir):
    settings.MEDIA_ROOT = tmpdir.strpath


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
def image_file(name="test.png", ext="png", size=(50, 50), color=(256, 0, 0)):
    file_obj = BytesIO()
    image = Image.new("RGBA", size=size, color=color)
    image.save(file_obj, ext)
    file_obj.seek(0)
    return File(file_obj, name=name)


@pytest.fixture()
def authenticate():
    return Authenticate()


@pytest.fixture(autouse=True)
def _set_default_language():
    activate("en")
