import logging
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import BadHeaderError
from django.utils.translation import gettext_lazy as _
from rest_framework import authentication, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from connect_access.core.loading import get_model
from connect_access.core.tasks import send_multialternative_mail

from .choices import MediationRequestStatus, UrgencyLevel
from .permissions import IsAdmin, IsAnon, IsOwner
from .serializers import MediationRequestSerializer

MediationRequest = get_model("mediations", "MediationRequest")
TraceReport = get_model("mediations", "TraceReport")

logger = logging.getLogger(__name__)


class MediationRequestViewSet(viewsets.ModelViewSet):
    """Complete viewset to manage mediation requests.

    Admins can do everything, whereas everybody can create a request, and
    owners of a request can update it.

    """

    queryset = MediationRequest.objects.order_by("-request_date")
    permission_classes = [IsAdmin | IsAnon | IsOwner]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = MediationRequestSerializer
    lookup_field = "uuid"

    def create(self, request):
        """Create mediation request, and sends emails on success.

        Emails are sent to the complainant, and to an email defined in
        MEDIATION_REQUEST_EMAIL setting.

        Note: only "pending", and "waiting for mediator validation" statuses are
        accepted for the creation through this endpoint.

        """
        serializer = self.get_serializer(data=request.data)
        log_message = ""
        if logger.isEnabledFor(logging.INFO):
            filled_fields = {k: v for k, v in request.data.items() if v}
            log_message = f"Received mediation request with content: {filled_fields}\n"
        if not serializer.is_valid():
            logger.info(f"{log_message}The request was rejected by the serializer.")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if serializer.validated_data["status"] not in (
            MediationRequestStatus.PENDING.value,
            MediationRequestStatus.WAITING_MEDIATOR_VALIDATION.value,
        ):
            logger.info(
                f"{log_message}The request status {(serializer.validated_data['status'])} was incorrect."
            )
            return Response(
                {
                    "message": _(
                        "mediation request creation failed:"
                        " unauthorized mediation request status"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        mediation_request = MediationRequest(**serializer.validated_data)
        mediation_request.save()
        logger.info(f"{log_message}The request was correctly saved.")
        try:
            send_multialternative_mail(
                {"id": str(mediation_request.uuid)[:8]},
                _("Mediation request successfully submited"),
                [mediation_request.email],
                "mediations/emails/user_request_creation",
            )
            mediators_email = getattr(settings, "MEDIATION_REQUEST_EMAIL", "")
            if mediators_email:
                urgency = None
                if mediation_request.urgency:
                    urgency = UrgencyLevel(mediation_request.urgency).label
                context = {
                    "mediation_request": mediation_request,
                    "mediation_request_id": str(mediation_request.uuid)[:8],
                    "mediation_request_urgency": urgency,
                }
                send_multialternative_mail(
                    context,
                    _("A new mediation request has been submitted"),
                    [mediators_email],
                    "mediations/emails/mediator_request_creation",
                )
        except BadHeaderError as error:
            logger.error(
                f"The header of the email for mediation request {mediation_request.id} "
                f"creation was incorrectly formed. The email couldn't be sent. Actual error: {error}"
            )
        except SMTPException as error:
            logger.error(
                f"The mediation request {mediation_request.id} failed for a reason "
                f"linked to SMTP. The email couldn't be sent. Actual error: {error}"
            )
        return Response(
            {"message": _("mediation request created")},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["GET"])
    def user(self, request):
        mediation_requests = MediationRequest.objects.filter(
            complainant__uuid=request.user.uuid
        )
        serializer = self.get_serializer(mediation_requests, many=True)
        return Response(serializer.data)
