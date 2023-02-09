from django.views.generic.base import TemplateView


class IndexView(TemplateView):
    """The main view integrating the frontend code.

    All the user paths go through this view.

    """

    template_name = "index.html"
