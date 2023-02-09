import os


def pytest_generate_tests():
    # used to add environment variables to these tests
    os.environ["DATA_PLATFORM_NAME"] = "Connect Access"
    os.environ["DATA_LOGO_FILENAME"] = "logo_custom.png"
    os.environ["DATA_LOGO_FILENAME_SMALL"] = "logo_custom_small.png"
