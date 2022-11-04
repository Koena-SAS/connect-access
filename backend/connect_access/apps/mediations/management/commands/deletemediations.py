from django.core.management.base import BaseCommand, CommandError
from django.db.models import ProtectedError

from connect_access.core.loading import get_model

MediationRequest = get_model("mediations", "MediationRequest")


class Command(BaseCommand):
    help = (
        "Deletes all mediation requests and trace reports (if exist) from the database."
    )

    def handle(self, *args, **options):
        try:
            MediationRequest.objects.all().delete()
        except ProtectedError as e:
            raise CommandError('Exception "%s"' % e)
