import sys
import traceback
from importlib import import_module

from django.apps import apps
from django.apps.config import MODELS_MODULE_NAME
from django.core.exceptions import AppRegistryNotReady

from connect_access.core.exceptions import (
    AppNotFoundError,
    ClassNotFoundError,
    ModuleNotFoundError,
)


def get_class(module_label, classname, module_prefix="connect_access.apps"):
    return get_classes(module_label, [classname], module_prefix)[0]


def get_classes(module_label, classnames, module_prefix="connect_access.apps"):
    return class_loader(module_label, classnames, module_prefix)


def class_loader(module_label, classnames, module_prefix):
    if "." not in module_label:
        raise ValueError("Importing from top-level modules is not supported")

    connect_access_module_label = "{0}.{1}".format(module_prefix, module_label)
    connect_access_module = _import_module(connect_access_module_label, classnames)

    app_name = _find_registered_app_name(module_label)
    local_module_label = ".".join(app_name.split(".") + module_label.split(".")[1:])
    local_module = _import_module(local_module_label, classnames)

    if connect_access_module is local_module is None:
        raise ModuleNotFoundError(
            f"The module with label '{module_label}' could not be imported. This either"
            " means that it indeed does not exist, or you might have a problem"
            " with a circular import."
        )

    return _pluck_classes([local_module, connect_access_module], classnames)


def _import_module(module_label, classnames):
    try:
        return __import__(module_label, fromlist=classnames)
    except ImportError:
        __, __, exc_traceback = sys.exc_info()  # type: ignore
        frames = traceback.extract_tb(exc_traceback)
        if len(frames) > 1:
            raise


def _pluck_classes(modules, classnames):
    klasses = []
    for classname in classnames:
        klass = None
        for module in modules:
            if hasattr(module, classname):
                klass = getattr(module, classname)
                break
        if not klass:
            packages = [m.__name__ for m in modules if m is not None]
            raise ClassNotFoundError(
                "No class '{0}' found in {1}".format(classname, ", ".join(packages))
            )
        klasses.append(klass)
    return klasses


def _find_registered_app_name(module_label):
    app_label = module_label.split(".")[0]
    try:
        app_config = apps.get_app_config(app_label)
    except LookupError:
        raise AppNotFoundError(f"Couldn't find an app to import {module_label} from")
    return app_config.name


def get_model(app_label, model_name):
    try:
        return apps.get_model(app_label, model_name)
    except AppRegistryNotReady:
        if apps.apps_ready and not apps.models_ready:
            app_config = apps.get_app_config(app_label)
            import_module(f"{app_config.name}.{MODELS_MODULE_NAME}")
            return apps.get_registered_model(app_label, model_name)
        else:
            raise


def is_model_registered(app_label, model_name):
    try:
        apps.get_registered_model(app_label, model_name)
    except LookupError:
        return False
    else:
        return True
