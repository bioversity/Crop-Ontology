"""
Provides plugin services to the cropontology

This code is based on CKAN
:Copyright (C) 2007 Open Knowledge Foundation
:license: AGPL V3, see LICENSE for more details.
"""

from pkg_resources import iter_entry_points
from pyutilib.component.core import implements
from pyutilib.component.core import ExtensionPoint as PluginImplementations
from pyutilib.component.core import SingletonPlugin as _pca_SingletonPlugin
from pyutilib.component.core import Plugin as _pca_Plugin
from .interfaces import IPluginObserver

__all__ = [
    "PluginImplementations",
    "implements",
    "PluginNotFoundException",
    "Plugin",
    "SingletonPlugin",
    "load",
    "load_all",
    "unload",
    "unload_all",
    "get_plugin",
    "plugin_loaded",
]

# Entry point group.
PLUGINS_ENTRY_POINT_GROUP = "cropontology.plugins"

# Entry point for test plugins.
TEST_PLUGINS_ENTRY_POINT_GROUP = "cropontology.test_plugins"

GROUPS = [PLUGINS_ENTRY_POINT_GROUP, TEST_PLUGINS_ENTRY_POINT_GROUP]
# These lists are used to ensure that the correct extensions are enabled.
_PLUGINS = []
_PLUGINS_CLASS = []

# To aid retrieving extensions by name
_PLUGINS_SERVICE = {}


class PluginNotFoundException(Exception):
    """
    Raised when a requested plugin cannot be found.
    """


class Plugin(_pca_Plugin):
    """
    Base class for plugins which require multiple instances.

    Unless you need multiple instances of your plugin object you should
    probably use SingletonPlugin.
    """


class SingletonPlugin(_pca_SingletonPlugin):
    """
    Base class for plugins which are singletons (ie most of them)

    One singleton instance of this class will be created when the plugin is
    loaded. Subsequent calls to the class constructor will always return the
    same singleton instance.
    """


def get_plugin(plugin):
    """
    Get an instance of a active plugin by name.  This is helpful for
    testing.
    :param plugin: Plugin name
    :return: Instance of plugin name
    """
    if plugin in _PLUGINS_SERVICE:
        return _PLUGINS_SERVICE[plugin]


def load_all(settings):
    """
    Load all plugins listed in the 'cropontology.plugins' settings variable.
    :param settings: Pytamid settings
    """
    # Clear any loaded plugins
    unload_all()

    plugins = settings.get(PLUGINS_ENTRY_POINT_GROUP, "").split()

    load(*plugins)


def load(*plugins):
    """
    Load named plugin(s).
    :param plugins: Pointer to the plugins
    :return: Return extension instance if only one was loaded. If more that one has been requested then a list of
             instances is returned in the order they were asked for.
    """
    output = []

    observers = PluginImplementations(IPluginObserver)
    for plugin in plugins:
        if plugin in _PLUGINS:
            raise Exception("Plugin `%s` already loaded" % plugin)

        service = _get_service(plugin)
        for observer_plugin in observers:
            observer_plugin.before_load(service)
        service.activate()
        for observer_plugin in observers:
            observer_plugin.after_load(service)

        _PLUGINS.append(plugin)
        _PLUGINS_CLASS.append(service.__class__)

        if isinstance(service, SingletonPlugin):
            _PLUGINS_SERVICE[plugin] = service

        output.append(service)

    if len(output) == 1:
        return output[0]
    return output


def unload_all():
    """
    Unload (deactivate) all loaded plugins in the reverse order that they
    were loaded.
    """
    unload(*reversed(_PLUGINS))


def unload(*plugins):
    """
    Unload named plugin(s).
    :param plugins: List of plugins
    """

    observers = PluginImplementations(IPluginObserver)

    for plugin in plugins:
        if plugin in _PLUGINS:
            _PLUGINS.remove(plugin)
            if plugin in _PLUGINS_SERVICE:
                del _PLUGINS_SERVICE[plugin]
        else:
            raise Exception("Cannot unload plugin `%s`" % plugin)

        service = _get_service(plugin)
        for observer_plugin in observers:
            observer_plugin.before_unload(service)

        service.deactivate()

        _PLUGINS_CLASS.remove(service.__class__)

        for observer_plugin in observers:
            observer_plugin.after_unload(service)


def plugin_loaded(name):
    """
    See if a particular plugin is loaded.
    :param name: Plugin name
    :return: Boolean
    """
    if name in _PLUGINS:
        return True
    return False


def _get_service(plugin_name):
    """
    Return a service (ie an instance of a plugin class).
    :param plugin_name: the name of a plugin entry point
    :return: the service object
    """
    if isinstance(plugin_name, str):
        for group in GROUPS:
            iterator = iter_entry_points(group=group, name=plugin_name)
            plugin = next(iterator, None)
            if plugin:
                return plugin.load()(name=plugin_name)
        raise PluginNotFoundException(plugin_name)
    else:
        raise TypeError("Expected a plugin name", plugin_name)
