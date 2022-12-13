import sys
import traceback
from importlib import import_module

from django.apps import apps
from django.apps.config import MODELS_MODULE_NAME
from django.conf import settings
from django.core.exceptions import AppRegistryNotReady


def get_model(app_label, model_name):
    try:
        return apps.get_model(app_label, model_name)
    except AppRegistryNotReady:
        if apps.apps_ready and not apps.models_ready:
            app_config = apps.get_app_config(app_label)
            import_module("%s.%s" % (app_config.name, MODELS_MODULE_NAME))
            return apps.get_registered_model(app_label, model_name)


def is_model_registered(app_label, model_name):
    try:
        apps.get_registered_model(app_label, model_name)
    except LookupError:
        return False
    else:
        return True


def model_factory(abstract_class):
    app_label = abstract_class.Meta.app_label
    model_name = abstract_class.__name__.replace("Abstract", "")
    if not is_model_registered(app_label, model_name):
        return type(
            str(model_name),
            (abstract_class,),
            {
                "__module__": __name__,
            },
        )


class AppNotFoundError(Exception):
    pass


class ClassNotFoundError(Exception):
    pass


def get_class(module_label, classname):
    return get_classes(
        module_label,
        [
            classname,
        ],
    )[0]


def get_classes(module_label, classnames):
    app_label = module_label.split(".")[0]

    app_module_path = _get_app_module_path(module_label)
    if not app_module_path:
        raise AppNotFoundError("No app found matching '{0}'".format(module_label))

    # Determines the full module path by appending the module label
    # to the base package path of the considered application.
    module_path = app_module_path
    if "." in app_module_path:
        base_package = app_module_path.rsplit("." + app_label, 1)[0]
        module_path = "{0}.{1}".format(base_package, module_label)

    # Try to import this module from the related app that is specified
    # in the Django settings.
    local_imported_module = _import_module(module_path, classnames)

    # If the module we tried to import is not located inside the connect-access
    # vanilla apps, try to import it from the corresponding connect-access app.
    connect_access_imported_module = None
    if not app_module_path.startswith("connect_access.apps"):
        connect_access_imported_module = _import_module(
            "{0}.{1}".format("connect_access.apps", module_label),
            classnames,
        )

    if local_imported_module is None and connect_access_imported_module is None:
        raise AppNotFoundError("Error importing '{0}'".format(module_path))

    # Any local module is prioritized over the corresponding connect_access module
    imported_modules = [
        m
        for m in (local_imported_module, connect_access_imported_module)
        if m is not None
    ]
    return _pick_up_classes(imported_modules, classnames)


def _import_module(module_path, classnames):
    try:
        imported_module = __import__(module_path, fromlist=classnames)
        return imported_module
    except ImportError:
        # In case of an ImportError, the module being loaded generally does not exist. But an
        # ImportError can occur if the module being loaded exists and another import located inside
        # it failed.
        #
        # In order to provide a meaningfull traceback, the execution information can be inspected in
        # order to determine which case to consider. If the execution information provides more than
        # a certain amount of frames, this means that an ImportError occured while loading the
        # initial Python module.
        exc_type, exc_value, exc_traceback = sys.exc_info()
        frames = traceback.extract_tb(exc_traceback)
        if len(frames) > 1:
            raise


def _pick_up_classes(modules, classnames):
    klasses = []
    for classname in classnames:
        klass = None
        for module in modules:
            if hasattr(module, classname):
                klass = getattr(module, classname)
                break
        if not klass:
            raise ClassNotFoundError(
                "Error fetching '{0}' in {1}".format(
                    classname, str([module.__name__ for module in modules])
                )
            )
        klasses.append(klass)
    return klasses


def _get_app_module_path(module_label):
    app_name = module_label.rsplit(".", 1)[0]
    for app in settings.INSTALLED_APPS:
        if app.endswith("." + app_name) or app == app_name:
            return app
    return None
