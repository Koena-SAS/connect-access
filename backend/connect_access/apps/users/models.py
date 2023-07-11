from django.db.models.signals import pre_delete
from django.dispatch import receiver

from connect_access.apps.users.abstract_models import AbstractUser
from connect_access.core.loading import get_model, is_model_registered
from connect_access.models import model_factory

if not is_model_registered("users", "User"):
    User = model_factory(AbstractUser)


@receiver(pre_delete, sender=User)
def delete_user_personal_information(sender, instance, using, **kwargs):
    """Delete mediation requests' personal information related to this user being removed."""
    MediationRequest = get_model("mediations", "MediationRequest")  # noqa: N806
    user_requests = MediationRequest.objects.filter(complainant=instance)
    for user_request in user_requests:
        user_request.first_name = ""
        user_request.last_name = ""
        user_request.email = ""
        user_request.phone_number = ""
        user_request.save()
