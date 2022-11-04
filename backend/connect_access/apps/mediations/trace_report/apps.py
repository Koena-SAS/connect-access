from django.apps import AppConfig


class TraceReportConfig(AppConfig):
    label = "trace_report"
    name = "connect_access.apps.mediations.trace_report"

    def ready(self):
        import connect_access.core.receivers  # noqa

        super(TraceReportConfig, self).ready()
