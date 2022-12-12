import os

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile

from connect_access.core.loading import get_class

pytestmark = pytest.mark.django_db

TraceReportFactory = get_class(
    "mediations.trace_report.tests.factories", "TraceReportFactory"
)
MediationRequestFactory = get_class(
    "mediations.tests.factories", "MediationRequestFactory"
)


class TestModels:
    @pytest.mark.usefixtures("_set_default_language")
    def test_trace_report_str(self):
        trace_report = TraceReportFactory()
        assert str(trace_report.uuid) == str(trace_report)

    def test_trace_report_attached_file_is_stored_in_correct_path(self):
        mediation_request = MediationRequestFactory()
        attached_file = SimpleUploadedFile(
            "test_file.png",
            b"file content",
            content_type="multipart/form-data",
        )
        trace_report = TraceReportFactory(
            mediation_request=mediation_request,
            attached_file=attached_file,
        )
        assert (
            trace_report.attached_file.name
            == f"trace_report/mediation_request_{mediation_request.uuid}/test_file.png"
        )

    def test_trace_report_attached_file_is_removed_when_removing_from_db(self):
        mediation_request = MediationRequestFactory()
        attached_file = SimpleUploadedFile(
            "test_file.png",
            b"file content",
            content_type="multipart/form-data",
        )
        trace_report = TraceReportFactory(
            mediation_request=mediation_request,
            attached_file=attached_file,
        )
        assert os.path.isfile(
            f"{settings.MEDIA_ROOT}/trace_report/mediation_request_{mediation_request.uuid}/test_file.png"
        )
        trace_report.attached_file = None  # type: ignore
        trace_report.save()
        assert not os.path.isfile(
            f"{settings.MEDIA_ROOT}/trace_report/mediation_request_{mediation_request.uuid}/test_file.png"
        )
