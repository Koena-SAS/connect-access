import json

import pytest
from django.urls import reverse
from mock import patch

from connect_access.apps.configuration.serializers import (
    AboutServiceInformationSerializer,
    ContactInformationSerializer,
)
from connect_access.apps.configuration.tests.factories import (
    AboutServiceInformationFactory,
    ContactInformationFactory,
)
from connect_access.views import IndexView

pytestmark = pytest.mark.django_db


@pytest.mark.usefixtures("_set_default_language")
@patch("webpack_loader.loader.WebpackLoader.get_bundle")
def test_index_has_language_defined_in_context(rf):
    context = _execute_index_view(rf, reverse("home"))
    assert "language" in context
    assert context["language"] == "en"


@patch("webpack_loader.loader.WebpackLoader.get_bundle")
def test_index_has_data_information_defined(rf):
    context = _execute_index_view(rf, reverse("home"))
    assert "data" in context
    assert context["data"] == {
        "platformName": "Connect Access",
        "logoFilename": "logo_custom.png",
        "logoFilenameSmall": "logo_custom_small.png",
    }


@patch("webpack_loader.loader.WebpackLoader.get_bundle")
def test_index_has_contact_information_defined(rf):
    contact_information = ContactInformationFactory()
    context = _execute_index_view(rf, reverse("home"))
    assert "contact_information" in context
    contact_information_data = json.loads(context["contact_information"])
    assert isinstance(contact_information_data, dict)
    serializer = ContactInformationSerializer(contact_information)
    assert contact_information_data == serializer.data


@patch("webpack_loader.loader.WebpackLoader.get_bundle")
def test_index_has_about_service_information_defined(rf):
    about_service_1 = AboutServiceInformationFactory()
    about_service_2 = AboutServiceInformationFactory()
    context = _execute_index_view(rf, reverse("home"))
    assert "about_service" in context
    about_service_data = json.loads(context["about_service"])
    assert isinstance(about_service_data, list)
    assert len(about_service_data) == 2
    del about_service_data[0]["id"]
    del about_service_data[1]["id"]
    serializer1 = AboutServiceInformationSerializer(about_service_1)
    about_service_serialized_1 = serializer1.data
    del about_service_serialized_1["id"]
    serializer2 = AboutServiceInformationSerializer(about_service_2)
    about_service_serialized_2 = serializer2.data
    del about_service_serialized_2["id"]
    assert about_service_serialized_1 in about_service_data
    assert about_service_serialized_2 in about_service_data


@patch("webpack_loader.loader.WebpackLoader.get_bundle")
def test_index_has_platform_name_defined(rf):
    context = _execute_index_view(rf, reverse("home"))
    assert "platform_name" in context
    assert context["platform_name"] == "Connect Access"


def _execute_index_view(rf, path) -> dict:
    request = rf.get(path)
    request.path = path
    view = IndexView()
    view.setup(request)
    context = view.get_context_data()
    return context
