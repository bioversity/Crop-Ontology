import os

from pyramid.csrf import SessionCSRFStoragePolicy
from pyramid_session_redis import session_factory_from_settings

import cropontology.plugins as p
import cropontology.plugins.helpers as helpers
import cropontology.resources as r
from cropontology.models import add_column_to_schema
from .jinja_extensions import (
    initialize,
    ExtendThis,
    CSSResourceExtension,
    JSResourceExtension,
)
from .mainresources import create_resources
from .routes import load_routes
from cropontology.processes.elasticsearch.term_index import configure_term_index_manager

main_policy_array = []


def __url_for_static(request, static_file, library="cropontology_static"):
    """
    This function return the address of a static URL. It substitutes request.static_url because static_url does not
    work for plugins when using a full path to the static directory
    :param request: Current request object
    :param static_file: Static file being requested
    :param library: Library where the static file is located
    :return: URL to the static resource
    """
    return request.application_url + "/" + library + "/" + static_file


def get_policy_array(request):
    return main_policy_array


def __helper(request):
    h = helpers.helper_functions
    return h


class RequestResources(object):
    """
    This class handles the injection of resources in templates
    """

    def __init__(self, request):
        self.request = request
        self.current_resources = []

    def add_resource(self, library_name, resource_id, resource_type):
        self.current_resources.append(
            {
                "libraryName": library_name,
                "resourceID": resource_id,
                "resourceType": resource_type,
            }
        )

    def resource_in_request(self, library_name, resource_id, resource_type):
        for resource in self.current_resources:
            if (
                resource["libraryName"] == library_name
                and resource["resourceID"] == resource_id
                and resource["resourceType"] == resource_type
            ):
                return True
        return False


def load_environment(settings, config, apppath, policy_array):
    for policy in policy_array:
        main_policy_array.append(policy)

    # Add the session factory to the config
    session_factory = session_factory_from_settings(settings)
    config.set_session_factory(session_factory)

    config.set_csrf_storage_policy(SessionCSRFStoragePolicy())
    # config.set_default_csrf_options(require_csrf=True)

    # Configure the term index
    configure_term_index_manager(settings)

    # Add render subscribers for internationalization
    # config.add_translation_dirs("cropontology:locale")
    config.add_subscriber(
        "cropontology.i18n.i18n.add_renderer_globals", "pyramid.events.BeforeRender"
    )
    config.add_subscriber(
        "cropontology.i18n.i18n.add_localizer", "pyramid.events.NewRequest"
    )

    # Register Jinja2
    config.registry.settings["jinja2.extensions"] = [
        "jinja2.ext.i18n",
        "jinja2.ext.do",
        "jinja2.ext.with_",
        ExtendThis,
        CSSResourceExtension,
        JSResourceExtension,
    ]
    config.include("pyramid_jinja2")

    # Add url_for_static to the request so plugins can use static resources
    config.add_request_method(__url_for_static, "url_for_static")
    # Add active resources to the request. This control the injection of resources into a request
    config.add_request_method(RequestResources, "activeResources", reify=True)

    # Add core library and resources
    create_resources(apppath, config)

    # Add the template directories
    templates_path_array = []
    templates_path = os.path.join(apppath, "templates")
    templates_path_array.append(templates_path)
    config.add_settings(templatesPaths=templates_path_array)

    # Add the static view
    static_path = os.path.join(apppath, "static")
    config.add_static_view("cropontology_static", static_path, cache_max_age=3600)
    # Add the template directories to jinja2
    config.add_jinja2_search_path(templates_path)

    # Load all connected plugins
    p.load_all(settings)

    # Add a series of helper functions to the request like pluralize
    helpers.load_plugin_helpers()
    config.add_request_method(__helper, "h", reify=True)

    config.add_request_method(get_policy_array, "policies", reify=False)

    # Load any change in the configuration done by connected plugins
    for plugin in p.PluginImplementations(p.IConfig):
        plugin.update_config(config)

    # Call any connected plugins to add their libraries
    for plugin in p.PluginImplementations(p.IResource):
        plugin_libraries = plugin.add_libraries(config)
        for library in plugin_libraries:
            r.add_library(library["name"], library["path"], config)

    # Call any connected plugins to add their CSS Resources
    for plugin in p.PluginImplementations(p.IResource):
        css_resources = plugin.add_css_resources(config)
        for resource in css_resources:
            r.add_css_resource(
                resource["libraryname"],
                resource["id"],
                resource["file"],
                resource["depends"],
            )

    # Call any connected plugins to add their JS Resources
    for plugin in p.PluginImplementations(p.IResource):
        js_resources = plugin.add_js_resources(config)
        for resource in js_resources:
            r.add_js_resource(
                resource["libraryname"],
                resource["id"],
                resource["file"],
                resource["depends"],
            )

    # Call any connected plugins to add their modifications into the schema. Not all tables has extras so only
    # certain tables are allowed. Add more tables as necessary
    schemas_allowed = [
        "user",
    ]
    for plugin in p.PluginImplementations(p.ISchema):
        schema_fields = plugin.update_schema(config)
        for field in schema_fields:
            if field["schema"] in schemas_allowed:
                add_column_to_schema(
                    field["schema"], field["fieldname"], field["fielddesc"]
                )

    # Call any connected plugins to update cropontology ORM. For example: Add new tables
    for plugin in p.PluginImplementations(p.IDatabase):
        plugin.update_orm(config.registry["dbsession_metadata"])

    # jinjaEnv is used by the jinja2 extensions so we get it from the config
    config.get_jinja2_environment()

    # setup the jinjaEnv template's paths for the extensions
    initialize(config.registry.settings["templatesPaths"])

    # We load the routes
    load_routes(config)

    # Finally called connected plugins to IEnvironment
    for plugin in p.PluginImplementations(p.IEnvironment):
        plugin.after_environment_load(settings)
