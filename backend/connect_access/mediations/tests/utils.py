from rest_framework.test import APIRequestFactory, force_authenticate

from connect_access.users.tests.factories import AdminUserFactory, UserFactory

from ..api import MediationRequestViewSet, TraceReportViewSet
from .factories import MediationRequestFactory, TraceReportFactory


def _authenticate_request_as_admin(request):
    admin_user = AdminUserFactory()
    force_authenticate(request, user=admin_user)


def _authenticate_request_as_user(request):
    user = UserFactory()
    force_authenticate(request, user=user)


def _authenticate_if_needed(request, permission):
    if permission == "admin":
        _authenticate_request_as_admin(request)
    elif permission == "user":
        _authenticate_request_as_user(request)


def _get_mediation_request_absolute_url(action, parameter=None):
    view = MediationRequestViewSet()
    view.basename = "api:mediation_requests"
    view.request = APIRequestFactory().get("")
    args = []
    if parameter:
        args.append(parameter)
    return view.reverse_action(action, args=args)


def _get_trace_report_absolute_url(action, parameter=None):
    view = TraceReportViewSet()
    view.basename = "api:trace_reports"
    view.request = APIRequestFactory().get("")
    args = []
    if parameter:
        args.append(parameter)
    return view.reverse_action(action, args=args)


def _execute_mediation_request_create(permission, request_data):
    request = APIRequestFactory().post(
        _get_mediation_request_absolute_url("list"), request_data
    )
    _authenticate_if_needed(request, permission)
    response = MediationRequestViewSet.as_view({"post": "create"})(request)
    return {"response": response}


def _execute_mediation_request_list(permission):
    mediation_request = MediationRequestFactory()
    request = APIRequestFactory().get(_get_mediation_request_absolute_url("list"))
    _authenticate_if_needed(request, permission)
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
    _authenticate_if_needed(request, permission)
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
    _authenticate_if_needed(request, permission)
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
    _authenticate_if_needed(request, permission)
    if permission == "same_user":
        force_authenticate(request, user=user)
    response = MediationRequestViewSet.as_view({"delete": "destroy"})(
        request, uuid=mediation_request.uuid
    )
    return {
        "mediation_request": mediation_request,
        "response": response,
    }


def _execute_trace_report_create(permission, request_data):
    request = APIRequestFactory().post(
        _get_trace_report_absolute_url("list"), request_data
    )
    _authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"post": "create"})(request)
    return {"response": response}


def _execute_trace_report_list(permission):
    trace_report = TraceReportFactory()
    request = APIRequestFactory().get(_get_trace_report_absolute_url("list"))
    _authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"get": "list"})(request)
    return {
        "trace_report": trace_report,
        "response": response,
    }


def _execute_trace_report_update(permission, request_data):
    trace_report = TraceReportFactory()
    request = APIRequestFactory().put(
        _get_trace_report_absolute_url("detail", trace_report.uuid),
        request_data,
    )
    _authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"put": "update"})(
        request, uuid=trace_report.uuid
    )
    return {
        "trace_report": trace_report,
        "response": response,
    }


def _execute_trace_report_delete(permission):
    trace_report = TraceReportFactory()
    request = APIRequestFactory().delete(
        _get_trace_report_absolute_url("detail", trace_report.uuid)
    )
    _authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"delete": "destroy"})(
        request, uuid=trace_report.uuid
    )
    return {
        "trace_report": trace_report,
        "response": response,
    }


def _execute_trace_report_by_mediation_request(permission):
    mediation_request = MediationRequestFactory()
    trace_report1 = TraceReportFactory(mediation_request=mediation_request)
    trace_report2 = TraceReportFactory(mediation_request=mediation_request)
    request = APIRequestFactory().get(
        _get_trace_report_absolute_url("by-mediation-request", mediation_request.uuid)
    )
    _authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"get": "by_mediation_request"})(
        request, mediation_request_id=mediation_request.uuid
    )
    return {
        "trace_report1": trace_report1,
        "trace_report2": trace_report2,
        "mediation_request_uuid": mediation_request.uuid,
        "response": response,
    }
