from django.core.management.base import BaseCommand, CommandError

from koenaconnect.mediations.models import MediationRequest, TraceReport


class Command(BaseCommand):
    help = "Creates a set of test mediation requests and trace reports."

    def handle(self, *args, **options):
        try:
            if len(MediationRequest.objects.all()) != 0:
                raise Exception(
                    "The database should be empty to apply createmediationsfortest command.\n"
                    f"Here we have {len(MediationRequest.objects.all())} mediation requests"
                )
            mediation_request1 = MediationRequest.objects.create(
                status="wc",
                first_name="Roman",
                email="roman@koena.net",
                issue_description="Difficulties to connect.",
            )
            TraceReport.objects.create(
                mediation_request=mediation_request1,
                trace_type="ca",
                sender_type="md",
                sender_name="John",
                recipient_type="cp",
                comment="Called Roman and made clear the problem.",
            )
            TraceReport.objects.create(
                mediation_request=mediation_request1,
                trace_type="ma",
                comment="Sent an email to the organization to explain the issue.",
            )
            MediationRequest.objects.create(
                status="wm",
                first_name="Anonymous",
                email="anon@anon.anon",
                issue_description="I have an empty link and I dont know where it points to.",
            )
        except Exception as e:
            raise CommandError('Exception "%s"' % e)
