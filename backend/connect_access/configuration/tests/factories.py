from factory import Faker
from factory.django import DjangoModelFactory

from connect_access.configuration.models import (
    AboutServiceInformation,
    ContactInformation,
)


class ContactInformationFactory(DjangoModelFactory):

    email_fr = Faker("email")
    email_en = Faker("email")
    email_text_fr = Faker("paragraph")
    email_text_en = Faker("paragraph")
    phone_number_fr = Faker("msisdn")
    phone_number_en = Faker("msisdn")
    phone_number_text_fr = Faker("paragraph")
    phone_number_text_en = Faker("paragraph")
    website_fr = Faker("url")
    website_en = Faker("url")
    website_text_fr = Faker("paragraph")
    website_text_en = Faker("paragraph")

    class Meta:
        model = ContactInformation


class AboutServiceInformationFactory(DjangoModelFactory):

    link_text_fr = Faker("paragraph")
    link_text_en = Faker("paragraph")
    link_url_fr = Faker("url")
    link_url_en = Faker("url")

    class Meta:
        model = AboutServiceInformation
