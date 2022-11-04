from connect_access.apps.mediations.trace_report.abstract_models import (
    AbstractTraceReport,
)
from connect_access.core.loading import model_factory

TraceReport = model_factory(AbstractTraceReport)
