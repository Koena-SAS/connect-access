from connect_access.apps.mediations.abstract_models import AbstractMediationRequest
from connect_access.core.loading import model_factory

__all__ = []

MediationRequest = model_factory(AbstractMediationRequest)
__all__.append("MediationRequest")
