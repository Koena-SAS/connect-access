import os

import pytest
from django.utils.translation import activate


def pytest_generate_tests():
    # used to add environment variables to these tests
    os.environ["DATA_PLATFORM_NAME"] = "Connect Access"
    os.environ["DATA_LOGO_FILENAME"] = "logo_custom.png"
    os.environ["DATA_LOGO_FILENAME_SMALL"] = "logo_custom_small.png"


@pytest.fixture(autouse=True)
def _set_default_language():
    activate("en")
