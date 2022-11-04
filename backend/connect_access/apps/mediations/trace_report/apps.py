from django.apps import AppConfig


class TraceReportConfig(AppConfig):
    label = "trace_report"
    name = "connect_access.apps.mediations.trace_report"

    def ready(self):
        import connect_access.models.receivers  # noqa

        super(TraceReportConfig, self).ready()
