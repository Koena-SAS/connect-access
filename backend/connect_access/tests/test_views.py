import pytest
from django.urls import reverse
from mock import patch

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
