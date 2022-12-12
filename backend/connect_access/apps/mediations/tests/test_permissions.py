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


class TestPermissions:
    def test_create_mediation_request_is_authorized_for_anonymous_user(
        self, request_data_for_mediation_request_creation, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_create(
                None, request_data_for_mediation_request_creation, authenticate
            )
        )
        assert response.status_code == 201

    def test_create_mediation_request_is_authorized_for_normal_user(
        self, request_data_for_mediation_request_creation, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_create(
                "user", request_data_for_mediation_request_creation, authenticate
            )
        )
        assert response.status_code == 201

    def test_create_mediation_request_is_authorized_for_admin_user(
        self, request_data_for_mediation_request_creation, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_create(
                "admin", request_data_for_mediation_request_creation, authenticate
            )
        )
        assert response.status_code == 201

    def test_list_mediation_request_is_forbidden_for_anonymous_user(self, authenticate):
        response = itemgetter("response")(
            _execute_mediation_request_list(None, authenticate)
        )
        assert response.status_code == 401

    def test_list_mediation_request_is_forbidden_for_normal_user(self, authenticate):
        response = itemgetter("response")(
            _execute_mediation_request_list("user", authenticate)
        )
        assert response.status_code == 403

    def test_list_mediation_request_is_authorized_for_admin_user(self, authenticate):
        response = itemgetter("response")(
            _execute_mediation_request_list("admin", authenticate)
        )
        assert response.status_code == 200

    def test_retrieve_mediation_request_is_forbidden_for_anonymous_user(
        self, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_retrieve(None, authenticate)
        )
        assert response.status_code == 401

    def test_retrieve_mediation_request_is_forbidden_for_normal_non_owner_of_the_object_user(
        self,
        authenticate,
    ):
        response = itemgetter("response")(
            _execute_mediation_request_retrieve("user", authenticate)
        )
        assert response.status_code == 403

    def test_retrieve_mediation_request_is_authorized_for_normal_owner_of_the_object_user(
        self,
        authenticate,
    ):
        response = itemgetter("response")(
            _execute_mediation_request_retrieve("same_user", authenticate)
        )
        assert response.status_code == 200

    def test_retrieve_mediation_request_is_authorized_for_admin_user(
        self, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_retrieve("admin", authenticate)
        )
        assert response.status_code == 200

    def test_update_mediation_request_is_forbidden_for_anonymous_user(
        self, request_data_for_mediation_request, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_update(
                None, request_data_for_mediation_request, authenticate
            )
        )
        assert response.status_code == 401

    def test_update_mediation_request_is_forbidden_for_normal_non_owner_of_the_object_user(
        self, request_data_for_mediation_request, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_update(
                "user", request_data_for_mediation_request, authenticate
            )
        )
        assert response.status_code == 403

    def test_update_mediation_request_is_authorized_for_normal_owner_of_the_object_user(
        self, request_data_for_mediation_request, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_update(
                "same_user", request_data_for_mediation_request, authenticate
            )
        )
        assert response.status_code == 200

    def test_update_mediation_request_is_authorized_for_admin_user(
        self, request_data_for_mediation_request, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_update(
                "admin", request_data_for_mediation_request, authenticate
            )
        )
        assert response.status_code == 200

    def test_update_mediation_request_works_when_not_having_complainant_attached_to_the_request(
        self, request_data_for_mediation_request, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_update(
                "admin", request_data_for_mediation_request, authenticate, False
            )
        )
        assert response.status_code == 200

    def test_delete_mediation_request_is_forbidden_for_anonymous_user(
        self, authenticate
    ):
        response = itemgetter("response")(
            _execute_mediation_request_delete(permission=None, auth=authenticate)
        )
        assert response.status_code == 401

    def test_delete_mediation_request_is_forbidden_for_normal_user(self, authenticate):
        response = itemgetter("response")(
            _execute_mediation_request_delete(permission="user", auth=authenticate)
        )
        assert response.status_code == 403

    def test_delete_mediation_request_is_forbidden_for_normal_owner_of_the_object_user(
        self,
        authenticate,
    ):
        response = itemgetter("response")(
            _execute_mediation_request_delete(permission="same_user", auth=authenticate)
        )
        assert response.status_code == 403

    def test_delete_mediation_request_is_authorized_for_admin_user(self, authenticate):
        response = itemgetter("response")(
            _execute_mediation_request_delete(permission="admin", auth=authenticate)
        )
        assert response.status_code == 204
