from collections import OrderedDict

from bidict import bidict
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.fields import SkipField
from rest_framework.relations import PKOnlyObject

from .models import (
    AssistiveTechnology,
    Browser,
    ContactEntityType,
    InaccessibilityLevel,
    MediationRequest,
    MediationRequestStatus,
    MobileAppPlatform,
    TraceReport,
    TraceType,
    UrgencyLevel,
)

User = get_user_model()


class EnumSerializerField(serializers.CharField):
    def __init__(self, choice_model, **kwargs):
        super().__init__(**kwargs)
        enum_map = dict(zip(choice_model.values, choice_model.names))
        self.enum_map = bidict(enum_map)

    def to_representation(self, obj):
        if not obj:
            return ""
        else:
            return self.enum_map[obj]

    def to_internal_value(self, data):
        if not data:
            return ""
        else:
            return self.enum_map.inverse[data]


class EnumArraySerializerField(serializers.ListField):
    def __init__(self, choice_model, **kwargs):
        super().__init__(child=serializers.CharField(), **kwargs)
        enum_map = dict(zip(choice_model.values, choice_model.names))
        self.enum_map = bidict(enum_map)

    def to_representation(self, objects):
        representation = []
        if objects:
            for object in objects:
                if object:
                    representation.append(self.enum_map[object])
        return representation

    def to_internal_value(self, data):
        internal = []
        if data:
            for element in data:
                if element:
                    internal.append(self.enum_map.inverse[element])
        return internal


class BooleanSerializerNullField(serializers.CharField):
    def to_representation(self, obj):
        if obj is True:
            return "YES"
        elif obj is False:
            return "NO"
        else:
            return ""

    def to_internal_value(self, data):
        if data == "YES":
            return True
        elif data == "NO":
            return False
        elif data == "":
            return None
        else:
            raise serializers.ValidationError(
                _("This field must be YES or NO string value.")
            )


class BooleanSerializerField(serializers.CharField):
    def to_representation(self, obj):
        if obj is True:
            return "YES"
        else:
            return "NO"

    def to_internal_value(self, data):
        if data == "YES":
            return True
        elif data == "NO" or data == "":
            return False
        else:
            raise serializers.ValidationError(
                _("This field must be YES or NO string value.")
            )


class ToReprMixin(object):
    """Slightly modified version of to_representation for ModelSerializer.

    modified version of the code available here:
    https://github.com/encode/django-rest-framework/blob/master/rest_framework/serializers.py#L493

    On the original version, None values are skipped in to_representation,
    which is a problem for BooleanField with null=True, that can be None,
    and we need to be able to change their representation even when None.

    """

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = self._readable_fields  # type: ignore
        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            check_for_none = (
                attribute.pk if isinstance(attribute, PKOnlyObject) else attribute
            )
            if check_for_none is None:
                if isinstance(field, BooleanSerializerNullField):
                    ret[field.field_name] = field.to_representation(attribute)
                else:
                    ret[field.field_name] = None
            else:
                ret[field.field_name] = field.to_representation(attribute)
        return ret


class MediationRequestSerializer(ToReprMixin, serializers.ModelSerializer):
    """Serializes all the fields of mediation request.

    attached_file is serialized as a string representing its URL.

    """

    id = serializers.ReadOnlyField(source="uuid")
    creation_date = serializers.DateTimeField(source="created", required=False)
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

    class Meta:
        model = MediationRequest
        fields = [
            "id",
            "creation_date",
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


class TraceReportSerializer(serializers.ModelSerializer):
    """Serializes all the fields of trace report.

    attached_file is serialized as a string representing its URL.

    """

    id = serializers.ReadOnlyField(source="uuid")
    mediation_request = serializers.SlugRelatedField(  # type: ignore
        slug_field="uuid", queryset=MediationRequest.objects.all()
    )
    trace_type = EnumSerializerField(TraceType, required=False)
    sender_type = EnumSerializerField(ContactEntityType, required=False)
    recipient_type = EnumSerializerField(ContactEntityType, required=False)
    attached_file = serializers.ImageField(
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
