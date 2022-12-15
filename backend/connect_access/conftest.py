pytest_plugins = [
    "connect_access.tests.fixtures",
    *[
        f"connect_access.apps.{app}.tests.fixtures"
        for app in (
            "mediations",
            "mediations.trace_report",
            "users",
        )
    ],
]
