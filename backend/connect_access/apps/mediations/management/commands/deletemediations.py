from django.core.management.base import CommandError
from django.db.models import ProtectedError

from connect_access.core.loading import get_model
from connect_access.core.management.commands import BaseCommand

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
