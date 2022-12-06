pytest_plugins = [
    "tests.fixtures",
    *[
        f"apps.{app}.tests.fixtures"
        for app in (
            "mediations",
            "mediations.trace_report",
            "users",
        )
    ],
]
