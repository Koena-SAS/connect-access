from django.core.management.base import CommandError
from django.db.models import ProtectedError

from connect_access.core.loading import get_model
from connect_access.core.management.commands import BaseCommand

TraceReport = get_model("trace_report", "TraceReport")


class Command(BaseCommand):
    help = "Deletes all trace reports from the database."

    def handle(self, *args, **options):
        try:
            TraceReport.objects.all().delete()
        except ProtectedError as e:
            raise CommandError('Exception "%s"' % e)
