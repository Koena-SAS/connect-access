pytest_plugins = [
    "connect_access.fixtures",
    *[
        f"connect_access.apps.{app}.tests.fixtures"
        for app in (
            "mediations",
            "mediations.trace_report",
            "users",
        )
    ],
]


def pytest_generate_tests():
    import os

    os.environ["DATA_PLATFORM_NAME"] = "Connect Access"
    os.environ["DATA_LOGO_FILENAME"] = "logo_custom.png"
    os.environ["DATA_LOGO_FILENAME_SMALL"] = "logo_custom_small.png"
