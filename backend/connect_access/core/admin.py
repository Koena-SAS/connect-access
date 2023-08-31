from typing import Optional, Tuple

from django.utils.translation import gettext_lazy as _


class ModelAdminMixin:
    _fieldsets = None

    @classmethod
    def _add_field(cls, name, field, position=None):
        if cls._fieldsets is None:
            raise TypeError
        fields = cls._fieldsets[name]["fields"]
        if field not in fields:
            if position is None:
                fields.append(field)
            else:
                fields.insert(position, field)

    @classmethod
    def _update_fieldsets(cls):
        raise NotImplementedError

    @property
    def fieldsets(self) -> Optional[Tuple]:
        if self._fieldsets is None:
            return None
        try:
            self._update_fieldsets()
        except NotImplementedError:
            pass

        return [(_(k) if k is not None else k, v) for k, v in self._fieldsets.items()]

    @fieldsets.setter
    def fieldsets(self, value) -> None:
        self._fieldsets = value
