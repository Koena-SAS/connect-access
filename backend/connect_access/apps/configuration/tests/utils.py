from django.urls import reverse
from rest_framework.test import APIRequestFactory

from ..api import AboutServiceInformationView, ContactInformationView
from .factories import AboutServiceInformationFactory, ContactInformationFactory


def _execute_contact_information():
    contact_information = ContactInformationFactory()
    url = reverse(
        "api:configuration-contact-information",
    )
    request = APIRequestFactory().get(url)
    response = ContactInformationView.as_view()(request)
    return {
        "contact_information": contact_information,
        "response": response,
    }


def _execute_about_service():
    about_service_1 = AboutServiceInformationFactory(display_order=2)
    about_service_2 = AboutServiceInformationFactory(display_order=1)
    url = reverse(
        "api:configuration-about-service",
    )
    request = APIRequestFactory().get(url)
    response = AboutServiceInformationView.as_view()(request)
    return {
        "about_service_1": about_service_1,
        "about_service_2": about_service_2,
        "response": response,
    }
