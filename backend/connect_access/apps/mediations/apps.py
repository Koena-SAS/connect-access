from django.apps import AppConfig


class MediationsConfig(AppConfig):
    label = "mediations"
    name = "connect_access.apps.mediations"

    def ready(self):
        import connect_access.core.receivers  # noqa

        super().ready()
