from django.core.management import BaseCommand as DjBaseCommand


class BaseCommand(DjBaseCommand):
    @staticmethod
    def _check_requirements():
        pass
