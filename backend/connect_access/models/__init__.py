from django.core.exceptions import ValidationError

from connect_access.core.loading import is_model_registered


def model_factory(abstract_class):
    app_label = abstract_class.Meta.app_label
    model_name = abstract_class.__name__.replace("Abstract", "")
    if not is_model_registered(app_label, model_name):
        return type(
            str(model_name),
            (abstract_class,),
            {
                "__module__": __name__,
            },
        )


class MixinModel(object):
    def _ensure_no_field_a_without_translated_field_b(self, a, b, error_message):
        for field_b, field_a in zip(b.fields, a.fields):
            if getattr(self, field_a) and not getattr(self, field_b):
                raise ValidationError(error_message)

    def _ensure_no_field_a_without_translated_fields_b(self, a, b, error_message):
        missing_field_b = False
        for field_b in b.fields:
            if not getattr(self, field_b):
                missing_field_b = True
        if a and missing_field_b:
            raise ValidationError(error_message)

    def _ensure_no_translated_field_a_without_translated_field_b(
        self, a, b, error_message
    ):
        for field_b, field_a in zip(b.fields, a.fields):
            if getattr(self, field_a) and not getattr(self, field_b):
                raise ValidationError(error_message)

    def _ensure_translated_fields_a_b_and_c_or_none_of_them(
        self, a, b, c, error_message
    ):
        for field_a, field_b, field_c in zip(a.fields, b.fields, c.fields):
            none_of_them = (
                not getattr(self, field_a)
                and not getattr(self, field_b)
                and not getattr(self, field_c)
            )
            all_of_them = (
                getattr(self, field_a)
                and getattr(self, field_b)
                and getattr(self, field_c)
            )
            if not none_of_them and not all_of_them:
                raise ValidationError(error_message)

    def _ensure_translated_fields_a_and_b_or_none_of_them(self, a, b, error_message):
        for field_a, field_b in zip(a.fields, b.fields):
            none_of_them = not getattr(self, field_a) and not getattr(self, field_b)
            all_of_them = getattr(self, field_a) and getattr(self, field_b)
            if not none_of_them and not all_of_them:
                raise ValidationError(error_message)
