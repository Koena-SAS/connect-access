import json
from uuid import UUID

from django.utils.translation import get_language
from django.views.generic.base import TemplateView


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)


class IndexView(TemplateView):
    """The main view integrating the frontend code.

    All the user paths go through this view.

    """

    template_name = "index.html"

    def get_context_data(self, **kwargs):
        """Create context variables for the main view to pass initial values to the frontend.

        The values are:
         - language: the language code computed by django.

        """
        context = super().get_context_data(**kwargs)
        current_language = get_language()
        context["language"] = current_language
        return context
