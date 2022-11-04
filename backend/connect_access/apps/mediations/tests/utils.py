from rest_framework.test import APIRequestFactory, force_authenticate

from connect_access.apps.users.tests.factories import UserFactory
from connect_access.conftest import Authenticate

from ..api import MediationRequestViewSet
from .factories import MediationRequestFactory


def _get_mediation_request_absolute_url(action, parameter=None):
    view = MediationRequestViewSet()
    view.basename = "api:mediation_requests"
    view.request = APIRequestFactory().get("")
    args = []
    if parameter:
        args.append(parameter)
    return view.reverse_action(action, args=args)


def _execute_mediation_request_create(permission, request_data):
    request = APIRequestFactory().post(
        _get_mediation_request_absolute_url("list"), request_data
    )
    Authenticate.authenticate_if_needed(request, permission)
    response = MediationRequestViewSet.as_view({"post": "create"})(request)
    return {"response": response}


def _execute_mediation_request_list(permission):
    mediation_request = MediationRequestFactory()
    request = APIRequestFactory().get(_get_mediation_request_absolute_url("list"))
    Authenticate.authenticate_if_needed(request, permission)
    response = MediationRequestViewSet.as_view({"get": "list"})(request)
    return {
        "mediation_request": mediation_request,
        "response": response,
    }


def _execute_mediation_request_retrieve(permission):
    user = UserFactory()
    mediation_request = MediationRequestFactory(complainant=user)
    request = APIRequestFactory().get(
        _get_mediation_request_absolute_url("detail", mediation_request.uuid)
    )
    Authenticate.authenticate_if_needed(request, permission)
    if permission == "same_user":
        force_authenticate(request, user=user)
    response = MediationRequestViewSet.as_view({"get": "retrieve"})(
        request, uuid=mediation_request.uuid
    )
    return {
        "mediation_request": mediation_request,
        "response": response,
    }


def _execute_mediation_request_update(permission, request_data, has_user=True):
    if has_user:
        user = UserFactory()
    else:
        user = None
    mediation_request = MediationRequestFactory(complainant=user)
    request = APIRequestFactory().put(
        _get_mediation_request_absolute_url("detail", mediation_request.uuid),
        request_data,
    )
    Authenticate.authenticate_if_needed(request, permission)
    if permission == "same_user":
        force_authenticate(request, user=user)
    response = MediationRequestViewSet.as_view({"put": "update"})(
        request, uuid=mediation_request.uuid
    )
    return {
        "mediation_request": mediation_request,
        "response": response,
    }


def _execute_mediation_request_delete(permission):
    user = UserFactory()
    mediation_request = MediationRequestFactory(complainant=user)
    request = APIRequestFactory().delete(
        _get_mediation_request_absolute_url("detail", mediation_request.uuid)
    )
    Authenticate.authenticate_if_needed(request, permission)
    if permission == "same_user":
        force_authenticate(request, user=user)
    response = MediationRequestViewSet.as_view({"delete": "destroy"})(
        request, uuid=mediation_request.uuid
    )
    return {
        "mediation_request": mediation_request,
        "response": response,
    }


def _add_mediation_request(request_data_for_mediation_request, status):
    request_data_for_mediation_request["status"] = status
    url = _get_mediation_request_absolute_url("list")
    request_post = APIRequestFactory(status=status).post(
        url, data=request_data_for_mediation_request, format="json"
    )
    Authenticate.authenticate_request_as_admin(request_post)
    return MediationRequestViewSet.as_view({"post": "create"})(request_post)
