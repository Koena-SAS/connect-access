from django.contrib import admin

import connect_access.core.admin as core_admin
from connect_access.core.loading import get_model

MediationRequest = get_model("mediations", "MediationRequest")


class MediationRequestAdmin(core_admin.ModelAdminMixin, admin.ModelAdmin):  # type: ignore
    search_fields = (
        "uuid",
        "first_name",
        "last_name",
        "issue_description",
        "step_description",
        "further_info",
        "organization_name",
    )
    list_display = (
        "request_date",
        "urgency",
        "status",
        "issue_description",
    )
    list_filter = ("status",)
    readonly_fields = ("uuid", "created", "modified")

    _fieldsets = {
        "Main information": {
            "fields": [
                "uuid",
                "request_date",
                "modified",
                "status",
                "urgency",
            ]
        },
        "Complainant information": {
            "fields": [
                "complainant",
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "assistive_technology_used",
                "technology_name",
                "technology_version",
            ]
        },
        "Problem description": {
            "fields": [
                "issue_description",
                "step_description",
                "issue_type",
                "inaccessibility_level",
                "browser_used",
                "url",
                "browser",
                "browser_version",
                "mobile_app_used",
                "mobile_app_platform",
                "mobile_app_name",
                "other_used_software",
                "did_tell_organization",
                "did_organization_reply",
                "organization_reply",
                "further_info",
                "attached_file",
            ]
        },
        "Organization information (not partner)": {
            "fields": [
                "organization_name",
                "organization_address",
                "organization_email",
                "organization_phone_number",
                "organization_contact",
            ]
        },
    }


admin.site.register(MediationRequest, MediationRequestAdmin)
