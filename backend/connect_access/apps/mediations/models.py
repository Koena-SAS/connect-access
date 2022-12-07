from connect_access.apps.mediations.abstract_models import AbstractMediationRequest
from connect_access.core.loading import is_model_registered, model_factory

__all__ = []

if not is_model_registered("mediations", "MediationRequest"):
    MediationRequest = model_factory(AbstractMediationRequest)
    __all__.append("MediationRequest")
