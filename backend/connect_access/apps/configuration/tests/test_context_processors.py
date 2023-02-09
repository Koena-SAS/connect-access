import json

import pytest
from mock import patch

from connect_access.apps.configuration.serializers import (
    AboutServiceInformationSerializer,
    ContactInformationSerializer,
)
from connect_access.core.loading import get_classes

AboutServiceInformationFactory, ContactInformationFactory = get_classes(
    "configuration.tests.factories",
    ["AboutServiceInformationFactory", "ContactInformationFactory"],
)

pytestmark = pytest.mark.django_db


class TestContextProcessors:
    @staticmethod
    def _create_entity(factory, serializer, nb_entities=1):
        if nb_entities == 1:
            return serializer(factory()).data
        else:
            return [serializer(factory()).data for _ in range(nb_entities)]

    @patch("webpack_loader.loader.WebpackLoader.get_bundle")
    def test_set_contact_information_if_exists(self, mock_wpl, client):
        mock_wpl.return_value = []
        entity_serialized = self._create_entity(
            ContactInformationFactory, ContactInformationSerializer
        )
        context_data = client.get("home").context

        assert "contact_information" in context_data
        contact_information_data = json.loads(context_data["contact_information"])
        assert contact_information_data == entity_serialized

    @patch("webpack_loader.loader.WebpackLoader.get_bundle")
    def test_set_contact_infromation_null(self, mock_wpl, client):
        mock_wpl.return_value = []
        context_data = client.get("home").context
        assert "contact_information" in context_data
        assert context_data["contact_information"] == "null"

    @patch("webpack_loader.loader.WebpackLoader.get_bundle")
    def test_set_about_service_if_exists(self, mock_wpl, client):
        mock_wpl.return_value = []
        nb_entities = 2
        entities_serialized = self._create_entity(
            AboutServiceInformationFactory,
            AboutServiceInformationSerializer,
            nb_entities=nb_entities,
        )
        for e in entities_serialized:
            e["id"] = str(e["id"])

        context_data = client.get("home").context
        assert "about_service" in context_data
        about_service_data = json.loads(context_data["about_service"])
        assert isinstance(about_service_data, list)
        assert len(about_service_data) == nb_entities

        for e in entities_serialized:
            assert e in about_service_data

    @patch("webpack_loader.loader.WebpackLoader.get_bundle")
    def test_set_about_service_null(self, mock_wpl, client):
        mock_wpl.return_value = []
        context_data = client.get("home").context
        assert "about_service" in context_data
        assert context_data["about_service"] == "null"
