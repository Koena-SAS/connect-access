from rest_framework import permissions


class IsAnon(permissions.BasePermission):
    def has_permission(self, request, view):
        return view.action == "create"

    def has_object_permission(self, request, view, obj):
        return False


class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        action_forbidden = view.action in ["list", "delete"]
        return request.user and request.user.is_authenticated and not action_forbidden

    def has_object_permission(self, request, view, obj):
        return (
            obj.complainant
            and request.user
            and (obj.complainant.pk == request.user.pk)
            and view.action != "destroy"
        )


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff
