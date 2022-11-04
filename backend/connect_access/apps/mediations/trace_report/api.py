import logging

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from rest_framework import authentication, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from connect_access.core.loading import get_model

from .serializers import TraceReportSerializer

MediationRequest = get_model("mediations", "MediationRequest")
TraceReport = get_model("trace_report", "TraceReport")

logger = logging.getLogger(__name__)


def send_multialternative_mail(context, subject, to, content_filename):
    text_content = get_template(f"{content_filename}.txt").render(context)
    html_content = get_template(f"{content_filename}.html").render(context)
    msg = EmailMultiAlternatives(subject, text_content, None, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()


class TraceReportViewSet(viewsets.ModelViewSet):
    """Complete viewset to manage trace reports.

    Admins can do everything, anyone else can't do anything.

    """

    queryset = TraceReport.objects.all()
    permission_classes = [IsAdminUser]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = TraceReportSerializer
    lookup_field = "uuid"

    @action(
        detail=False,
        methods=["GET"],
        url_path="mediation-request/<uuid:mediation_request_id>",
    )
    def by_mediation_request(self, request, mediation_request_id):
        trace_reports = TraceReport.objects.filter(
            mediation_request__uuid=mediation_request_id
        ).order_by("-contact_date")
        serializer = self.get_serializer(trace_reports, many=True)
        return Response(serializer.data)
