from django.core.management.base import CommandError

from connect_access.core.loading import get_model
from connect_access.core.management.commands import BaseCommand

TraceReport = get_model("mediations", "TraceReport")
MediationRequest = get_model("mediations", "MediationRequest")


class Command(BaseCommand):
    help = "Creates a set of test mediation requests and trace reports."

    @staticmethod
    def _check_requirements():
        if len(MediationRequest.objects.all()) == 0:
            raise Exception(
                "The database should be populate to apply createtracereportsfortest command.\n"
                f"Here we have {len(MediationRequest.objects.all())} mediation requests.\n"
                "Try to use createmediationsfortest command to populate database."
            )

    def handle(self, *args, **options):
        try:
            self._check_requirements()
            mediation_request_1 = MediationRequest.objects.all()[0]

            TraceReport.objects.create(
                mediation_request=mediation_request_1,
                trace_type="ca",
                sender_type="md",
                sender_name="John",
                recipient_type="cp",
                comment="Called Roman and made clear the problem.",
            )
            TraceReport.objects.create(
                mediation_request=mediation_request_1,
                trace_type="ma",
                comment="Sent an email to the organization to explain the issue.",
            )
        except Exception as e:
            raise CommandError('Exception "%s"' % e)
