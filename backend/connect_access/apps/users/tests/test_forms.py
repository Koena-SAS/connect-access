import pytest

from connect_access.core.loading import get_class

UserFactory = get_class("users.tests.factories", "UserFactory")
UserCreationForm = get_class("users.forms", "UserCreationForm")

pytestmark = pytest.mark.django_db


class TestUserCreationForm:
    def test_clean_email(self):
        # A user with proto_user params does not exist yet.
        proto_user = UserFactory.build()

        form = UserCreationForm(
            {
                "email": proto_user.email,
                "first_name": proto_user.first_name,
                "last_name": proto_user.last_name,
                "password1": proto_user._password,
                "password2": proto_user._password,
            }
        )

        assert form.is_valid()
        assert form.clean_email() == proto_user.email

        # Creating a user.
        form.save()

        # The user with proto_user params already exists,
        # hence cannot be created.
        form = UserCreationForm(
            {
                "email": proto_user.email,
                "first_name": proto_user.first_name,
                "last_name": proto_user.last_name,
                "password1": proto_user._password,
                "password2": proto_user._password,
            }
        )

        assert not form.is_valid()
        assert len(form.errors) == 1
        assert "email" in form.errors
