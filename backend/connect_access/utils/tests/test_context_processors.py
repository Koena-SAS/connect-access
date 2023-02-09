import pytest
from mock import patch

pytestmark = pytest.mark.django_db


class TestContextProcessor:
    @patch("webpack_loader.loader.WebpackLoader.get_bundle")
    def test_index_has_data_information_defined(self, mock_wpl, client):
        mock_wpl.return_value = []
        context = client.get("home").context
        assert "data" in context
        assert context["data"] == {
            "platformName": "Connect Access",
            "logoFilename": "logo_custom.png",
            "logoFilenameSmall": "logo_custom_small.png",
        }
