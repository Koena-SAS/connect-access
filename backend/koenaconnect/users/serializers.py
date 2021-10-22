from django.contrib.auth import get_user_model
from djoser import serializers as djoser_serializers
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "phone_number", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "email"}
        }


class UserCreatePasswordRetypeSerializer(
    djoser_serializers.UserCreatePasswordRetypeSerializer
):
    id = serializers.ReadOnlyField(source="uuid")

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone_number", "password"]


class UserAuthSerializer(djoser_serializers.UserSerializer):
    id = serializers.ReadOnlyField(source="uuid")

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone_number", "is_staff"]
