from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _
from pagedown.widgets import AdminPagedownWidget
from translated_fields import TranslatedFieldAdmin

import connect_access.core.admin as core_admin

from .models import AboutServiceInformation, ContactInformation


class ContactInformationAdmin(
    admin.ModelAdmin, TranslatedFieldAdmin, core_admin.ModelAdminMixin
):
    list_display = (
        "get_email_text",
        "phone_number_text",
        "website",
    )

    def get_email_text(self, obj):
        return obj.email_text if obj.email_text else "-----"

    get_email_text.short_description = _("Email address display text")  # type: ignore
    _fieldsets = {
        "Main information": {
            "fields": [
                (*ContactInformation.email.fields,),
                (*ContactInformation.email_text.fields,),
                (*ContactInformation.phone_number.fields,),
                (*ContactInformation.phone_number_text.fields,),
                (*ContactInformation.website.fields,),
                (*ContactInformation.website_text.fields,),
            ]
        },
        "Terms of service": {
            "fields": [
                (*ContactInformation.terms_of_service.fields,),
            ]
        },
    }

    formfield_overrides = {
        models.TextField: {"widget": AdminPagedownWidget},
    }


class AboutServiceInformationAdmin(
    admin.ModelAdmin, TranslatedFieldAdmin, core_admin.ModelAdminMixin
):
    list_display = (
        "display_order",
        "link_text",
        "link_url",
    )
    _fieldsets = {
        "Main information": {
            "fields": [
                "display_order",
                (*AboutServiceInformation.link_text.fields,),
                (*AboutServiceInformation.link_url.fields,),
            ]
        },
    }


admin.site.register(ContactInformation, ContactInformationAdmin)
admin.site.register(AboutServiceInformation, AboutServiceInformationAdmin)
