from operator import itemgetter

import pytest

from .utils import (
    _execute_trace_report_create,
    _execute_trace_report_delete,
    _execute_trace_report_list,
    _execute_trace_report_update,
)

pytestmark = pytest.mark.django_db


def test_create_trace_report_is_authorized_for_anonymous_user(
    request_data_for_trace_report,
):
    response = itemgetter("response")(
        _execute_trace_report_create(None, request_data_for_trace_report)
    )
    assert response.status_code == 401


def test_create_trace_report_is_authorized_for_normal_user(
    request_data_for_trace_report,
):
    response = itemgetter("response")(
        _execute_trace_report_create("user", request_data_for_trace_report)
    )
    assert response.status_code == 403


def test_create_trace_report_is_authorized_for_admin_user(
    request_data_for_trace_report,
):
    response = itemgetter("response")(
        _execute_trace_report_create("admin", request_data_for_trace_report)
    )
    assert response.status_code == 201


def test_list_trace_report_is_forbidden_for_anonymous_user():
    response = itemgetter("response")(_execute_trace_report_list(None))
    assert response.status_code == 401


def test_list_trace_report_is_forbidden_for_normal_user():
    response = itemgetter("response")(_execute_trace_report_list("user"))
    assert response.status_code == 403


def test_list_trace_report_is_authorized_for_admin_user():
    response = itemgetter("response")(_execute_trace_report_list("admin"))
    assert response.status_code == 200


def test_update_trace_report_is_forbidden_for_anonymous_user(
    request_data_for_trace_report,
):
    response = itemgetter("response")(
        _execute_trace_report_update(None, request_data_for_trace_report)
    )
    assert response.status_code == 401


def test_update_trace_report_is_forbidden_for_normal_user(
    request_data_for_trace_report,
):
    response = itemgetter("response")(
        _execute_trace_report_update("user", request_data_for_trace_report)
    )
    assert response.status_code == 403


def test_update_trace_report_is_authorized_for_admin_user(
    request_data_for_trace_report,
):
    response = itemgetter("response")(
        _execute_trace_report_update("admin", request_data_for_trace_report)
    )
    assert response.status_code == 200


def test_delete_trace_report_is_forbidden_for_anonymous_user():
    response = itemgetter("response")(_execute_trace_report_delete(permission=None))
    assert response.status_code == 401


def test_delete_trace_report_is_forbidden_for_normal_user():
    response = itemgetter("response")(_execute_trace_report_delete(permission="user"))
    assert response.status_code == 403


def test_delete_trace_report_is_authorized_for_admin_user():
    response = itemgetter("response")(_execute_trace_report_delete(permission="admin"))
    assert response.status_code == 204
