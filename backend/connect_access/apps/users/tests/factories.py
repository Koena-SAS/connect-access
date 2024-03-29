from django.contrib.auth import get_user_model
from factory import Faker, post_generation
from factory.django import DjangoModelFactory


class UserFactory(DjangoModelFactory):
    first_name = Faker("first_name")
    last_name = Faker("last_name")
    email = Faker("email")
    phone_number = Faker("msisdn")

    @post_generation
    def password(self, create, extracted, **kwargs):
        password = (
            extracted
            if extracted
            else Faker(
                "password",
                length=42,
                special_chars=True,
                digits=True,
                upper_case=True,
                lower_case=True,
            ).evaluate(None, None, extra={"locale": None})
        )
        self.set_password(password)

    class Meta:
        model = get_user_model()
        django_get_or_create = ["email"]


class AdminUserFactory(UserFactory):
    is_staff = True
