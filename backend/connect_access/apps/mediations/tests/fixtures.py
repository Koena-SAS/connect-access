import pytest

__all__ = [
    "request_data_for_mediation_request",
    "request_data_for_mediation_request_creation",
]


@pytest.fixture()
def request_data_for_mediation_request():
    return {
        "status": "WAITING_ADMIN",
        "first_name": "John",
        "email": "john@doe.com",
        "issue_description": "Here is the problem",
    }


@pytest.fixture()
def request_data_for_mediation_request_creation():
    return {
        "status": "PENDING",
        "first_name": "John",
        "email": "john@doe.com",
        "issue_description": "Here is the problem",
    }
