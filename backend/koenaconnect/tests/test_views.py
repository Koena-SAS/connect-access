import pytest
from django.urls import reverse
from mock import patch

from koenaconnect.views import IndexView

pytestmark = pytest.mark.django_db


@pytest.mark.usefixtures("_set_default_language")
@patch("webpack_loader.loader.WebpackLoader.get_bundle")
def test_index_has_language_defined_in_context(rf):
    context = _execute_index_view(rf, reverse("home"))
    assert "language" in context
    assert context["language"] == "en"


def _execute_index_view(rf, path) -> dict:
    request = rf.get(path)
    request.path = path
    view = IndexView()
    view.setup(request)
    context = view.get_context_data()
    return context
