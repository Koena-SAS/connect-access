from rest_framework import permissions


class AnonCreateAndUpdateOwnerOnly(permissions.BasePermission):
    """Custom permission.

    - allow anonymous POST
    - allow authenticated GET and PUT on *own* record
    - allow all actions for staff

    """

    def has_permission(self, request, view):
        return view.action == "create" or (
            request.user and request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        retrieve_or_update = view.action in ["retrieve", "update", "partial_update"]
        object_owner_or_admin = (
            obj.complainant.pk == request.user.pk or request.user.is_staff
        )
        delete_by_admin = view.action == "destroy" and request.user.is_staff
        return (retrieve_or_update and object_owner_or_admin) or delete_by_admin


class ListDeleteAdminOnly(permissions.BasePermission):
    """Custom permission to only allow access to lists and delete for admins."""

    def has_permission(self, request, view):
        limited_actions = ["list", "delete"]
        return view.action not in limited_actions or (
            request.user and request.user.is_staff
        )
