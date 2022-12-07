from django.contrib import admin
from django.utils.translation import gettext_lazy as _


class ModelAdmin(admin.ModelAdmin):
    _fieldsets = {}

    @classmethod
    def _add_field(cls, name, field, position=-1):
        fields = cls._fieldsets[name]["fields"]
        if field not in fields:
            fields.insert(position, field)

    @classmethod
    def _update_fieldsets(cls):
        raise NotImplementedError

    @classmethod
    @property
    def fieldsets(cls):
        try:
            cls._update_fieldsets()
        except NotImplementedError:
            pass

        return [(_(k), v) for k, v in cls._fieldsets.items()]

    @classmethod
    def register(cls, model):
        admin.site.register(model, cls)

    @classmethod
    def unregister(cls, model):
        admin.site.unregister(model)
