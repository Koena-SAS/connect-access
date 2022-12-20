from typing import List, Union

from django.conf import settings
from django.urls import URLPattern, URLResolver, path
from rest_framework.routers import DefaultRouter, SimpleRouter

from connect_access.core.loading import get_class, get_classes

(AboutServiceInformationView, ContactInformationView,) = get_classes(
    "configuration.api", ["AboutServiceInformationView", "ContactInformationView"]
)

MediationRequestViewSet = get_class("mediations.api", "MediationRequestViewSet")
TraceReportViewSet = get_class("trace_report.api", "TraceReportViewSet")
UserViewSet = get_class("users.api", "UserViewSet")

router: Union[SimpleRouter, DefaultRouter]
if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("mediation-requests", MediationRequestViewSet, "mediation_requests")
router.register("trace-reports", TraceReportViewSet, "trace_reports")

urlpatterns: List[Union[URLPattern, URLResolver]] = [
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
