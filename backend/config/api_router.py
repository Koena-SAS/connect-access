from typing import Union

from django.conf import settings
from django.urls import path
from rest_framework.routers import DefaultRouter, SimpleRouter

from connect_access.configuration.api import (
    AboutServiceInformationView,
    ContactInformationView,
)
from connect_access.mediations.api import MediationRequestViewSet, TraceReportViewSet
from connect_access.users.api import UserViewSet

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
        "configuration/contact-information/",
        ContactInformationView.as_view(),
        name="configuration-contact-information",
    ),
    path(
        "configuration/about-service/",
        AboutServiceInformationView.as_view(),
        name="configuration-about-service",
    ),
    path(
        "trace-reports/mediation-request/<uuid:mediation_request_id>/",
        TraceReportViewSet.as_view({"get": "by_mediation_request"}),
        name="trace_reports-by-mediation-request",
    ),
]

app_name = "api"
urlpatterns += router.urls
