import os
import shutil
import tempfile

import pytest
from django.core.management import CommandError, call_command

pytestmark = pytest.mark.django_db


def test_fork_app_raises_exception_when_called_with_unknown_app():
    try:
        call_command("fork_app", "UNKNOWN", ".")
    except CommandError:
        assert True


def test_fork_app_with_existing_app():
    try:
        dir_path = tempfile.mkdtemp()
        call_command("fork_app", "mediations", dir_path)
        for p in [
            ("/",),
            ("admin.py",),
            ("apps.py",),
            ("models.py",),
        ]:
            assert os.path.exists(os.path.join(dir_path, "mediations", *p))
        shutil.rmtree(dir_path)
    except CommandError:
        raise AssertionError()
