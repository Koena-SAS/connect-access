import connect_access.core.admin as admin
from connect_access.core.loading import get_model

TraceReport = get_model("trace_report", "TraceReport")


class TraceReportAdmin(admin.ModelAdmin):
    search_fields = (
        "mediation_request",
        "comment",
    )
    list_display = (
        "mediation_request",
        "contact_date",
        "trace_type",
        "comment",
    )
    list_filter = ("trace_type",)


TraceReportAdmin.register(TraceReport)
