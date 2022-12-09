from connect_acces.models import model_factory

from connect_access.apps.mediations.trace_report.abstract_models import (
    AbstractTraceReport,
)
from connect_access.core.loading import is_model_registered

__all__ = []

if not is_model_registered("trace_report", "TraceReport"):
    TraceReport = model_factory(AbstractTraceReport)
    __all__.append("TraceReport")
