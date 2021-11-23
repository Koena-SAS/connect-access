from rest_framework import serializers

from .models import AboutServiceInformation, ContactInformation


class ContactInformationSerializer(serializers.ModelSerializer):
    """Serializes all the fields contact information."""

    class Meta:
        model = ContactInformation
        fields = (
            []
            + ContactInformation.email.fields
            + ContactInformation.phone_number.fields
            + ContactInformation.website.fields
        )


class AboutServiceInformationSerializer(serializers.ModelSerializer):
    """Serializes all the fields of about service information."""

    id = serializers.ReadOnlyField(source="uuid")

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
