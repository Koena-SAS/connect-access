from django.contrib.auth import get_user_model
from rest_framework import serializers

from connect_access.core.loading import get_model
from connect_access.models.serializers import (
    BooleanSerializerNullField,
    EnumArraySerializerField,
    EnumSerializerField,
    ToReprMixin,
)

from .choices import (
    AssistiveTechnology,
    Browser,
    InaccessibilityLevel,
    MediationRequestStatus,
    MobileAppPlatform,
    UrgencyLevel,
)

User = get_user_model()
MediationRequest = get_model("mediations", "MediationRequest")
TraceReport = get_model("trace_report", "TraceReport")


class MediationRequestSerializer(ToReprMixin, serializers.ModelSerializer):
    """Serializes all the fields of mediation request.

    attached_file is serialized as a string representing its URL.

    """

    id = serializers.ReadOnlyField(source="uuid")
    creation_date = serializers.DateTimeField(source="created", required=False)
    modification_date = serializers.DateTimeField(source="created", required=False)
    request_date = serializers.DateTimeField(required=False)
    complainant = serializers.SlugRelatedField(
        slug_field="uuid", queryset=User.objects.all(), required=False
    )
    status = EnumSerializerField(MediationRequestStatus)
    email = serializers.EmailField(allow_blank=False)
    assistive_technology_used = EnumArraySerializerField(
        AssistiveTechnology, required=False
    )
    urgency = EnumSerializerField(UrgencyLevel, required=False)
    inaccessibility_level = EnumSerializerField(InaccessibilityLevel, required=False)
    browser_used = BooleanSerializerNullField(required=False)
    mobile_app_used = BooleanSerializerNullField(required=False)
    mobile_app_platform = EnumSerializerField(MobileAppPlatform, required=False)
    browser = EnumSerializerField(Browser, required=False)
    did_tell_organization = BooleanSerializerNullField(required=False)
    did_organization_reply = BooleanSerializerNullField(required=False)
    attached_file = serializers.FileField(
        allow_empty_file=True, allow_null=True, required=False
    )

    class Meta:
        model = MediationRequest
        fields = [
            "id",
            "creation_date",
            "modification_date",
            "request_date",
            "complainant",
            "status",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "assistive_technology_used",
            "technology_name",
            "technology_version",
            "urgency",
            "issue_description",
            "step_description",
            "inaccessibility_level",
            "browser_used",
            "url",
            "browser",
            "browser_version",
            "mobile_app_used",
            "mobile_app_platform",
            "mobile_app_name",
            "other_used_software",
            "did_tell_organization",
            "did_organization_reply",
            "organization_reply",
            "further_info",
            "attached_file",
            "organization_name",
            "organization_address",
            "organization_email",
            "organization_phone_number",
            "organization_contact",
        ]
