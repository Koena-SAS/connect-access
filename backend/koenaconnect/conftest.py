import pytest

from koenaconnect.users.models import User
from koenaconnect.users.tests.factories import UserFactory


@pytest.fixture(autouse=True)
def _media_storage(settings, tmpdir):
    settings.MEDIA_ROOT = tmpdir.strpath


@pytest.fixture()
def user() -> User:
    return UserFactory()
