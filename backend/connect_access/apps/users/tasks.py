import celery
from django.contrib.auth import get_user_model

User = get_user_model()


@celery.shared_task()
def get_users_count():
    """Do a pointless Celery task to demonstrate usage.

    Returns:
        User count.

    """
    return User.objects.count()
