import json

from connect_access.apps.configuration.serializers import (
    AboutServiceInformationSerializer,
    ContactInformationSerializer,
)
from connect_access.core.loading import get_model
from connect_access.models.serializers import UUIDEncoder

AboutServiceInformation = get_model("configuration", "AboutServiceInformation")
ContactInformation = get_model("configuration", "ContactInformation")


def _set_contact_information():
    contact_information = ContactInformation.objects.first()
    if contact_information:
        serializer = ContactInformationSerializer(contact_information)
        contact_information = json.dumps(serializer.data)
    else:
        contact_information = "null"
    return {"contact_information": contact_information}


def _set_about_service():
    about_service = AboutServiceInformation.objects.all()
    if len(about_service) > 0:
        serializer = AboutServiceInformationSerializer(about_service, many=True)
        about_service = json.dumps(serializer.data, cls=UUIDEncoder)
    else:
        about_service = "null"

    return {"about_service": about_service}


def settings_context(request):
    return {
        **_set_contact_information(),
        **_set_about_service(),
    }
