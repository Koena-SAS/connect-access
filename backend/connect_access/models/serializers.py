import json
from collections import OrderedDict
from uuid import UUID

from bidict import bidict
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.fields import SkipField
from rest_framework.relations import PKOnlyObject


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)


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
