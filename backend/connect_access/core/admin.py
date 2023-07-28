from typing import Any, Dict, List, Union

from django.utils.translation import gettext_lazy as _


class ModelAdminMixin:
    _fieldsets: Dict[Union[None, str], Dict[str, List[Any]]] = {}

    @classmethod
    def _add_field(cls, name, field, position=None):
        fields = cls._fieldsets[name]["fields"]
        if field not in fields:
            if position is None:
                fields.append(field)
            else:
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

        return [(_(k) if k is not None else k, v) for k, v in cls._fieldsets.items()]
