from typing import Union

from django.conf import settings
from django.urls import path
from rest_framework.routers import DefaultRouter, SimpleRouter

from koenaconnect.mediations.api import MediationRequestViewSet, TraceReportViewSet
from koenaconnect.users.api import UserViewSet

router: Union[SimpleRouter, DefaultRouter]
if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("mediation-requests", MediationRequestViewSet, "mediation_requests")
router.register("trace-reports", TraceReportViewSet, "trace_reports")

urlpatterns = [
    path(
        "trace-reports/mediation-request/<uuid:mediation_request_id>/",
        TraceReportViewSet.as_view({"get": "by_mediation_request"}),
        name="trace_reports-by-mediation-request",
    ),
]

app_name = "api"
urlpatterns += router.urls
