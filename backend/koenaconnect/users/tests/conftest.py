import pytest
from django.utils.translation import activate


@pytest.fixture(autouse=True)
def _set_default_language():
    activate("en")
