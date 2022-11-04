from operator import itemgetter

import pytest

from .utils import _execute_about_service

pytestmark = pytest.mark.django_db


def test_about_service_is_sorted_according_to_display_order():
    (about_service_1, about_service_2, response,) = itemgetter(
        "about_service_1", "about_service_2", "response"
    )(_execute_about_service())

    assert response.data[0]["display_order"] == 1
    assert response.data[0]["id"] == about_service_2.uuid
    assert response.data[1]["display_order"] == 2
    assert response.data[1]["id"] == about_service_1.uuid
