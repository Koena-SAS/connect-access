from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AboutServiceInformation, ContactInformation
from .serializers import AboutServiceInformationSerializer, ContactInformationSerializer


class ContactInformationView(APIView):

    permission_classes = [AllowAny]
    lookup_field = "uuid"

    def get(self, request):
        """Return the singleton contact information entry."""
        contact_information = get_object_or_404(
            ContactInformation,
        )
        serializer = ContactInformationSerializer(contact_information)
        return Response(serializer.data)


class AboutServiceInformationView(ListAPIView):
    """Links for the footer, in about section."""

    serializer_class = AboutServiceInformationSerializer
    queryset = AboutServiceInformation.objects.all().order_by("display_order")
    permission_classes = [AllowAny]
