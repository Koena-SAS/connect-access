"""With these settings, tests run faster."""

from .base import *  # noqa
from .base import (
    get_connect_access_apps,
    CONNECT_ACCESS_APPS,
    CONNECT_ACCESS_PLUGIN_APPS,
    DJANGO_APPS,
    THIRD_PARTY_APPS,
)
from .base import env

for app in CONNECT_ACCESS_APPS:
    CONNECT_ACCESS_APPS[app] = True

for app in CONNECT_ACCESS_PLUGIN_APPS:
    CONNECT_ACCESS_PLUGIN_APPS[app] = False

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + get_connect_access_apps()

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="Yo9pQyLBp5c1PCdm3vCvzeEZw1ljBUnVtpmHT2H0oxhHwp0MpOvxul6joHexypRx",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#test-runner
TEST_RUNNER = "django.test.runner.DiscoverRunner"

# CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# TEMPLATES
# ------------------------------------------------------------------------------
TEMPLATES[-1]["OPTIONS"]["loaders"] = [  # type: ignore[index] # noqa F405
    (
        "django.template.loaders.cached.Loader",
        [
            "django.template.loaders.filesystem.Loader",
            "django.template.loaders.app_directories.Loader",
        ],
    )
]

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# Your stuff...
# ------------------------------------------------------------------------------
