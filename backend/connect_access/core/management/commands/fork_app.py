from django.core.management import CommandError

from connect_access.core import customisation
from connect_access.core.management.commands import BaseCommand


class Command(BaseCommand):
    help = "Create a customizable local version of one of Connect Access app."

    def _check_requirements(self):
        pass

    def add_arguments(self, parser):
        parser.add_argument("app_label", help="The application to fork")
        parser.add_argument("target_path", help="The path to copy the files to")

    def handle(self, *args, **options):
        app_label = options["app_label"]
        target_path = options["target_path"]

        try:
            customisation.fork_app(app_label, target_path)
        except Exception as e:
            raise CommandError(str(e))
