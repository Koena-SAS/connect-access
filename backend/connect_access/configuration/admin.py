from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from translated_fields import TranslatedFieldAdmin

from .models import AboutServiceInformation, ContactInformation


class ContactInformationAdmin(TranslatedFieldAdmin, admin.ModelAdmin):
    list_display = (
        "email",
        "phone_number",
        "website",
    )
    fieldsets = (
        (
            _("Main information"),
            {
                "fields": (
                    (*ContactInformation.email.fields,),
                    (*ContactInformation.email_text.fields,),
                    (*ContactInformation.phone_number.fields,),
                    (*ContactInformation.phone_number_text.fields,),
                    (*ContactInformation.website.fields,),
                    (*ContactInformation.website_text.fields,),
                )
            },
        ),
    )


class AboutServiceInformationAdmin(TranslatedFieldAdmin, admin.ModelAdmin):
    list_display = (
        "display_order",
        "link_text",
        "link_url",
    )
    fieldsets = (
        (
            _("Main information"),
            {
                "fields": (
                    "display_order",
                    (*AboutServiceInformation.link_text.fields,),
                    (*AboutServiceInformation.link_url.fields,),
                )
            },
        ),
    )


admin.site.register(ContactInformation, ContactInformationAdmin)
admin.site.register(AboutServiceInformation, AboutServiceInformationAdmin)
