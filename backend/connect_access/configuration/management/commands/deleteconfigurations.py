from django.core.management.base import BaseCommand, CommandError
from django.db.models import ProtectedError

from connect_access.configuration.models import (
    AboutServiceInformation,
    ContactInformation,
)


class Command(BaseCommand):
    help = "Deletes all configuration objects from the database."

    def handle(self, *args, **options):
        try:
            ContactInformation.objects.all().delete()
            AboutServiceInformation.objects.all().delete()
        except ProtectedError as e:
            raise CommandError('Exception "%s"' % e)
