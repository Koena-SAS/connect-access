from rest_framework import serializers

from .models import AboutServiceInformation, ContactInformation


class TranslatableSerializer:
    @staticmethod
    def _reorganize_fields_with_lang(field, data):
        fields = {}
        old_fields_to_delete = []
        for old_field in data:
            if (
                old_field.startswith(f"{field}_")
                and len(old_field) == len(f"{field}_") + 2
            ):
                lang = old_field[-2:]
                fields[lang] = data[old_field]
                old_fields_to_delete.append(old_field)
        data[field] = fields
        for old_field in old_fields_to_delete:
            data.pop(old_field, None)
        return data


class ContactInformationSerializer(serializers.ModelSerializer, TranslatableSerializer):
    """Serializes all the fields contact information."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data = self._reorganize_fields_with_lang("email", data)
        data = self._reorganize_fields_with_lang("email_text", data)
        data = self._reorganize_fields_with_lang("phone_number", data)
        data = self._reorganize_fields_with_lang("phone_number_text", data)
        data = self._reorganize_fields_with_lang("website", data)
        data = self._reorganize_fields_with_lang("website_text", data)
        data = self._reorganize_fields_with_lang("terms_of_service", data)
        return data

    class Meta:
        model = ContactInformation
        fields = (
            []
            + ContactInformation.email.fields
            + ContactInformation.email_text.fields
            + ContactInformation.phone_number.fields
            + ContactInformation.phone_number_text.fields
            + ContactInformation.website.fields
            + ContactInformation.website_text.fields
            + ContactInformation.terms_of_service.fields
        )


class AboutServiceInformationSerializer(
    serializers.ModelSerializer, TranslatableSerializer
):
    """Serializes all the fields of about service information."""

    id = serializers.ReadOnlyField(source="uuid")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data = self._reorganize_fields_with_lang("link_text", data)
        data = self._reorganize_fields_with_lang("link_url", data)
        return data

    class Meta:
        model = AboutServiceInformation
        fields = (
            [
                "id",
                "display_order",
            ]
            + AboutServiceInformation.link_text.fields
            + AboutServiceInformation.link_url.fields
        )
