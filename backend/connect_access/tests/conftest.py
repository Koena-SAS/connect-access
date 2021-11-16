import os

import pytest
from django.utils.translation import activate


def pytest_generate_tests():
    # used to add environment variables to these tests
    os.environ["DATA_PLATFORM_NAME"] = "Connect Access"


@pytest.fixture(autouse=True)
def _set_default_language():
    activate("en")
