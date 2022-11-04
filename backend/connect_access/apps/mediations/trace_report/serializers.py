from rest_framework import serializers

from connect_access.core.loading import get_model
from connect_access.models.serializers import EnumSerializerField

from . import choices

TraceReport = get_model("trace_report", "TraceReport")
MediationRequest = get_model("mediations", "MediationRequest")


class TraceReportSerializer(serializers.ModelSerializer):
    """Serializes all the fields of trace report.

    attached_file is serialized as a string representing its URL.

    """

    id = serializers.ReadOnlyField(source="uuid")
    mediation_request = serializers.SlugRelatedField(  # type: ignore
        slug_field="uuid", queryset=MediationRequest.objects.all()
    )
    trace_type = EnumSerializerField(choices.TraceType, required=False)
    sender_type = EnumSerializerField(choices.ContactEntityType, required=False)
    recipient_type = EnumSerializerField(choices.ContactEntityType, required=False)
    attached_file = serializers.FileField(
        allow_empty_file=True, allow_null=True, required=False
    )

    class Meta:
        model = TraceReport
        fields = [
            "id",
            "mediation_request",
            "contact_date",
            "trace_type",
            "sender_type",
            "sender_name",
            "recipient_type",
            "recipient_name",
            "comment",
            "attached_file",
        ]
