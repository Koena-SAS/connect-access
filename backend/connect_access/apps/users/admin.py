from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from connect_access.apps.users.forms import UserChangeForm, UserCreationForm
from connect_access.core.admin import ModelAdminMixin

User = get_user_model()


class UserAdmin(ModelAdminMixin, BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ("email", "first_name", "last_name", "phone_number", "is_staff")
    list_filter = ("is_staff",)
    _fieldsets = {
        None: {"fields": ["email", "password"]},
        "Personal info": {
            "fields": [
                "first_name",
                "last_name",
                "phone_number",
            ]
        },
        "Permissions": {"fields": ["is_staff", "is_superuser"]},
    }
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
