from rest_framework.test import APIRequestFactory

from connect_access.core.loading import get_class

TraceReportViewSet = get_class("trace_report.api", "TraceReportViewSet")
TraceReportFactory = get_class(
    "mediations.trace_report.tests.factories", "TraceReportFactory"
)
MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)


def _get_trace_report_absolute_url(action, parameter=None):
    view = TraceReportViewSet()
    view.basename = "api:trace_reports"
    view.request = APIRequestFactory().get("")
    args = []
    if parameter:
        args.append(parameter)
    return view.reverse_action(action, args=args)


def _execute_trace_report_create(permission, request_data, auth):
    request = APIRequestFactory().post(
        _get_trace_report_absolute_url("list"), request_data
    )
    auth.authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"post": "create"})(request)
    return {"response": response}


def _execute_trace_report_list(permission, auth):
    trace_report = TraceReportFactory()
    request = APIRequestFactory().get(_get_trace_report_absolute_url("list"))
    auth.authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"get": "list"})(request)
    return {
        "trace_report": trace_report,
        "response": response,
    }


def _execute_trace_report_update(permission, request_data, auth):
    trace_report = TraceReportFactory()
    request = APIRequestFactory().put(
        _get_trace_report_absolute_url("detail", trace_report.uuid),
        request_data,
    )
    auth.authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"put": "update"})(
        request, uuid=trace_report.uuid
    )
    return {
        "trace_report": trace_report,
        "response": response,
    }


def _execute_trace_report_delete(permission, auth):
    trace_report = TraceReportFactory()
    request = APIRequestFactory().delete(
        _get_trace_report_absolute_url("detail", trace_report.uuid)
    )
    auth.authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"delete": "destroy"})(
        request, uuid=trace_report.uuid
    )
    return {
        "trace_report": trace_report,
        "response": response,
    }


def _execute_trace_report_by_mediation_request(permission, auth):
    mediation_request = MediationRequestFactory()
    trace_report1 = TraceReportFactory(mediation_request=mediation_request)
    trace_report2 = TraceReportFactory(mediation_request=mediation_request)
    request = APIRequestFactory().get(
        _get_trace_report_absolute_url("by-mediation-request", mediation_request.uuid)
    )
    auth.authenticate_if_needed(request, permission)
    response = TraceReportViewSet.as_view({"get": "by_mediation_request"})(
        request, mediation_request_id=mediation_request.uuid
    )
    return {
        "trace_report1": trace_report1,
        "trace_report2": trace_report2,
        "mediation_request_uuid": mediation_request.uuid,
        "response": response,
    }


def _add_trace_report(request_data_for_trace_report, auth):
    url = _get_trace_report_absolute_url("list")
    request_post = APIRequestFactory().post(
        url, data=request_data_for_trace_report, format="json"
    )
    auth.authenticate_request_as_admin(request_post)
    return TraceReportViewSet.as_view({"post": "create"})(request_post)
