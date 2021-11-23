from operator import itemgetter

import pytest
from pytest_django.asserts import assertContains

from .utils import _execute_about_service, _execute_contact_information

pytestmark = pytest.mark.django_db


def test_contact_information_serializes_correctly_all_fields():
    (contact_information, response,) = itemgetter(
        "contact_information", "response"
    )(_execute_contact_information())

    assertContains(response, contact_information.email_fr)
    assertContains(response, contact_information.email_en)
    assertContains(response, contact_information.email_text_fr)
    assertContains(response, contact_information.email_text_en)
    assertContains(response, contact_information.phone_number_fr)
    assertContains(response, contact_information.phone_number_en)
    assertContains(response, contact_information.phone_number_text_fr)
    assertContains(response, contact_information.phone_number_text_en)
    assertContains(response, contact_information.website_fr)
    assertContains(response, contact_information.website_en)
    assertContains(response, contact_information.website_text_fr)
    assertContains(response, contact_information.website_text_en)


def test_about_services_serializes_correctly_all_fields():
    (about_service_1, about_service_2, response,) = itemgetter(
        "about_service_1", "about_service_2", "response"
    )(_execute_about_service())
    assert len(response.data) == 2

    assertContains(response, about_service_1.uuid)
    assertContains(response, about_service_1.display_order)
    assertContains(response, about_service_1.link_text_fr)
    assertContains(response, about_service_1.link_text_en)
    assertContains(response, about_service_1.link_url_fr)
    assertContains(response, about_service_1.link_url_en)
    assertContains(response, about_service_2.uuid)
    assertContains(response, about_service_2.display_order)
    assertContains(response, about_service_2.link_text_fr)
    assertContains(response, about_service_2.link_text_en)
    assertContains(response, about_service_2.link_url_fr)
    assertContains(response, about_service_2.link_url_en)
