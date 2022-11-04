from operator import itemgetter

import pytest

from .utils import (
    _execute_mediation_request_create,
    _execute_mediation_request_delete,
    _execute_mediation_request_list,
    _execute_mediation_request_retrieve,
    _execute_mediation_request_update,
)

pytestmark = pytest.mark.django_db


def test_create_mediation_request_is_authorized_for_anonymous_user(
    request_data_for_mediation_request_creation,
):
    response = itemgetter("response")(
        _execute_mediation_request_create(
            None, request_data_for_mediation_request_creation
        )
    )
    assert response.status_code == 201


def test_create_mediation_request_is_authorized_for_normal_user(
    request_data_for_mediation_request_creation,
):
    response = itemgetter("response")(
        _execute_mediation_request_create(
            "user", request_data_for_mediation_request_creation
        )
    )
    assert response.status_code == 201


def test_create_mediation_request_is_authorized_for_admin_user(
    request_data_for_mediation_request_creation,
):
    response = itemgetter("response")(
        _execute_mediation_request_create(
            "admin", request_data_for_mediation_request_creation
        )
    )
    assert response.status_code == 201


def test_list_mediation_request_is_forbidden_for_anonymous_user():
    response = itemgetter("response")(_execute_mediation_request_list(None))
    assert response.status_code == 401


def test_list_mediation_request_is_forbidden_for_normal_user():
    response = itemgetter("response")(_execute_mediation_request_list("user"))
    assert response.status_code == 403


def test_list_mediation_request_is_authorized_for_admin_user():
    response = itemgetter("response")(_execute_mediation_request_list("admin"))
    assert response.status_code == 200


def test_retrieve_mediation_request_is_forbidden_for_anonymous_user():
    response = itemgetter("response")(_execute_mediation_request_retrieve(None))
    assert response.status_code == 401


def test_retrieve_mediation_request_is_forbidden_for_normal_non_owner_of_the_object_user():
    response = itemgetter("response")(_execute_mediation_request_retrieve("user"))
    assert response.status_code == 403


def test_retrieve_mediation_request_is_authorized_for_normal_owner_of_the_object_user():
    response = itemgetter("response")(_execute_mediation_request_retrieve("same_user"))
    assert response.status_code == 200


def test_retrieve_mediation_request_is_authorized_for_admin_user():
    response = itemgetter("response")(_execute_mediation_request_retrieve("admin"))
    assert response.status_code == 200


def test_update_mediation_request_is_forbidden_for_anonymous_user(
    request_data_for_mediation_request,
):
    response = itemgetter("response")(
        _execute_mediation_request_update(None, request_data_for_mediation_request)
    )
    assert response.status_code == 401


def test_update_mediation_request_is_forbidden_for_normal_non_owner_of_the_object_user(
    request_data_for_mediation_request,
):
    response = itemgetter("response")(
        _execute_mediation_request_update("user", request_data_for_mediation_request)
    )
    assert response.status_code == 403


def test_update_mediation_request_is_authorized_for_normal_owner_of_the_object_user(
    request_data_for_mediation_request,
):
    response = itemgetter("response")(
        _execute_mediation_request_update(
            "same_user", request_data_for_mediation_request
        )
    )
    assert response.status_code == 200


def test_update_mediation_request_is_authorized_for_admin_user(
    request_data_for_mediation_request,
):
    response = itemgetter("response")(
        _execute_mediation_request_update("admin", request_data_for_mediation_request)
    )
    assert response.status_code == 200


def test_update_mediation_request_works_when_not_having_complainant_attached_to_the_request(
    request_data_for_mediation_request,
):
    response = itemgetter("response")(
        _execute_mediation_request_update(
            "admin", request_data_for_mediation_request, False
        )
    )
    assert response.status_code == 200


def test_delete_mediation_request_is_forbidden_for_anonymous_user():
    response = itemgetter("response")(
        _execute_mediation_request_delete(permission=None)
    )
    assert response.status_code == 401


def test_delete_mediation_request_is_forbidden_for_normal_user():
    response = itemgetter("response")(
        _execute_mediation_request_delete(permission="user")
    )
    assert response.status_code == 403


def test_delete_mediation_request_is_forbidden_for_normal_owner_of_the_object_user():
    response = itemgetter("response")(
        _execute_mediation_request_delete(permission="same_user")
    )
    assert response.status_code == 403


def test_delete_mediation_request_is_authorized_for_admin_user():
    response = itemgetter("response")(
        _execute_mediation_request_delete(permission="admin")
    )
    assert response.status_code == 204
