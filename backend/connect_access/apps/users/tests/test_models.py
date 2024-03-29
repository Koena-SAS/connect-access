import pytest

from connect_access.core.loading import get_class, get_model

User = get_model("users", "User")
MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)
UserFactory = get_class("users.tests.factories", "UserFactory")

pytestmark = pytest.mark.django_db


class TestModels:
    def test_user_get_full_name(self):
        user = UserFactory(email="john@doe.com", first_name="John", last_name="Doe")
        assert user.get_full_name() == "John Doe"

    def test_user_get_short_name(self):
        user = UserFactory(email="john@doe.com", first_name="John", last_name="Doe")
        assert user.get_short_name() == "John"

    def test_user_str(self):
        user = UserFactory(email="john@doe.com", first_name="John", last_name="Doe")
        assert str(user) == "john@doe.com"

    @pytest.mark.usefixtures("_set_default_language")
    def test_user_manager_create_user_raises_exception_if_no_email(self):
        with pytest.raises(ValueError, match="The Email must be set"):
            User.objects.create_user(email="", first_name="John", last_name="Doe")

    def test_user_manager_create_user_normalizes_email(self):
        user = User.objects.create_user(
            email="John@Doe.com", first_name="John", last_name="Doe"
        )
        assert user.email == "John@doe.com"

    def test_user_manager_create_user_does_not_set_user_as_staff_or_superuser(self):
        user = User.objects.create_user(
            email="john@doe.com", first_name="John", last_name="Doe"
        )
        assert not user.is_staff
        assert not user.is_superuser

    def test_user_manager_create_superuser_sets_user_as_staff_and_superuser(self):
        user = User.objects.create_superuser(
            email="john@doe.com", first_name="John", last_name="Doe"
        )
        assert user.is_staff
        assert user.is_superuser

    def test_user_deletion_deletes_also_personal_information_of_attached_mediation_requests(
        self,
    ):
        user = UserFactory()
        mediation_request_user = MediationRequestFactory(complainant=user)
        mediation_request_user2 = MediationRequestFactory(complainant=user)
        mediation_request_non_user = MediationRequestFactory()
        assert mediation_request_user.first_name
        assert mediation_request_user2.first_name
        assert mediation_request_non_user.first_name
        user.delete()
        mediation_request_user.refresh_from_db()
        mediation_request_user2.refresh_from_db()
        mediation_request_non_user.refresh_from_db()
        assert not mediation_request_user.first_name
        assert not mediation_request_user.last_name
        assert not mediation_request_user.email
        assert not mediation_request_user.phone_number
        assert not mediation_request_user2.first_name
        assert not mediation_request_user2.last_name
        assert not mediation_request_user2.email
        assert not mediation_request_user2.phone_number
        assert mediation_request_non_user.first_name
        assert mediation_request_non_user.last_name
        assert mediation_request_non_user.email
        assert mediation_request_non_user.phone_number
