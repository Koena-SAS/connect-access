from django.core.management.base import BaseCommand, CommandError

from connect_access.core.loading import get_model

MediationRequest = get_model("mediations", "MediationRequest")


class Command(BaseCommand):
    help = "Creates a set of test mediation requests and trace reports."

    def handle(self, *args, **options):
        try:
            if len(MediationRequest.objects.all()) != 0:
                raise Exception(
                    "The database should be empty to apply createmediationsfortest command.\n"
                    f"Here we have {len(MediationRequest.objects.all())} mediation requests"
                )
            MediationRequest.objects.create(
                status="wc",
                first_name="Roman",
                email="roman@koena.net",
                issue_description="Difficulties to connect.",
                request_date="2020-05-28T23:10:05.084022+02:00",
            )
            MediationRequest.objects.create(
                status="wm",
                first_name="Anonymous",
                email="anon@anon.anon",
                issue_description="I have an empty link and I dont know where it points to.",
                request_date="2020-05-27T23:10:05.084022+02:00",
            )
        except Exception as e:
            raise CommandError('Exception "%s"' % e)
