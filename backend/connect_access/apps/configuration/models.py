from connect_access.apps.configuration.abstract_models import (
    AbstractAboutServiceInformation,
    AbstractContactInformation,
)
from connect_access.core.loading import is_model_registered
from connect_access.models import model_factory

__all__ = []

if not is_model_registered("configuration", "AboutServiceInformation"):
    AboutServiceInformation = model_factory(AbstractAboutServiceInformation)
    __all__.append("AboutServiceInformation")

if not is_model_registered("configuration", "ContactInformation"):
    ContactInformation = model_factory(AbstractContactInformation)
    __all__.append("ContactInformation")
