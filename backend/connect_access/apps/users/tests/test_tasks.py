import pytest
from celery.result import EagerResult

from connect_access.apps.users.tasks import get_users_count
from connect_access.core.loading import get_class

UserFactory = get_class("users.tests.factories", "UserFactory")
pytestmark = pytest.mark.django_db


class TestTasks:
    def test_user_count(self, settings):
        # Do a basic test to execute the get_users_count Celery task.
        UserFactory.create_batch(3)
        settings.CELERY_TASK_ALWAYS_EAGER = True
        task_result = get_users_count.delay()
        assert isinstance(task_result, EagerResult)
        assert task_result.result == 3
