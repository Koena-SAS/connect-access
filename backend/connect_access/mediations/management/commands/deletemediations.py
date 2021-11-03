from django.core.management.base import BaseCommand, CommandError
from django.db.models import ProtectedError

from connect_access.mediations.models import MediationRequest


class Command(BaseCommand):
    help = "Deletes all mediation requests and trace reports from the database."

    def handle(self, *args, **options):
        try:
            MediationRequest.objects.all().delete()
        except ProtectedError as e:
            raise CommandError('Exception "%s"' % e)
