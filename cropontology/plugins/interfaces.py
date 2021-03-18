"""
This file declares the PCA interfaces available in cropontology and their methods.
"""


__all__ = [
    "Interface",
    "IRoutes",
    "IConfig",
    "IResource",
    "IPluginObserver",
    "ISchema",
    "IDatabase",
    "IUserAuthentication",
    "ITemplateHelpers",
    "ITranslation",
    "IRegistration",
    "IPublicView",
    "IPrivateView",
    "ILogOut",
    "IUserAuthorization",
    "IAPIRoutes",
    "IUser",
    "IEnvironment",
]


from inspect import isclass

from pyutilib.component.core import Interface as _pca_Interface


class Interface(_pca_Interface):
    """
    This code is based on CKAN
    :Copyright (C) 2007 Open Knowledge Foundation
    :license: AGPL V3, see LICENSE for more details.

    """

    @classmethod
    def provided_by(cls, instance):
        return cls.implemented_by(instance.__class__)

    @classmethod
    def implemented_by(cls, other):
        if not isclass(other):
            raise TypeError("Class expected", other)
        try:
            return cls in other._implements
        except AttributeError:
            return False


class IRoutes(Interface):
    """
    Plugin into the creation of routes.

    """

    def before_mapping(self, config):
        """
        Called before the mapping of routes made by cropontology.

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'name':'myroute','path':'/myroute','view',viewDefinition,
                                       'renderer':'renderere_used'}]
        """
        raise NotImplementedError("before_mapping must be implemented in subclasses")

    def after_mapping(self, config):
        """
        Called after the mapping of routes made by cropontology.

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'name':'myroute','path':'/myroute','view',viewDefinition,
                                       'renderer':'renderere_used'}]
        """
        raise NotImplementedError("after_mapping must be implemented in subclasses")


class IAPIRoutes(Interface):
    """
    Plugin into the creation of API routes.

    """

    def before_mapping(self, config):
        """
        Called before the mapping of API routes made by cropontology.

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'name':'myroute','path':'/myroute','view',viewDefinition,
                                       'renderer':'renderere_used'}]
        """
        raise NotImplementedError("before_mapping must be implemented in subclasses")

    def after_mapping(self, config):
        """
        Called after the mapping of API routes made by cropontology.

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'name':'myroute','path':'/myroute','view',viewDefinition,
                                       'renderer':'renderere_used'}]
        """
        raise NotImplementedError("after_mapping must be implemented in subclasses")


class IConfig(Interface):
    """
    Allows the modification of the Pyramid config. For example to add new templates or static directories
    """

    def update_config(self, config):
        """
        Called by cropontology during the initialization of the environment

        :param config: ``pyramid.config`` object
        """


class IResource(Interface):
    """
    Allows to hook into the creation of JS and CSS libraries or resources
    """

    def add_libraries(self, config):
        """
        Called by cropontology so plugins can add new JS and CSS libraries to cropontology

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'name':'mylibrary','path':'/path/to/my/resources'}]
        """
        raise NotImplementedError("add_libraries must be implemented in subclasses")

    def add_js_resources(self, config):
        """
        Called by cropontology so plugins can add new JS Resources

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'libraryname':'mylibrary','id':'myResourceID','file':'/relative/path/to/jsFile',
                                      'depends':'resourceID'}]
        """
        raise NotImplementedError("add_js_resources must be implemented in subclasses")

    def add_css_resources(self, config):
        """
        Called by cropontology so plugins can add new FanStatic CSS Resources

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'libraryname':'mylibrary','id':'myResourceID','file':'/relative/path/to/jsFile',
                                      'depends':'resourceID'}]
        """
        raise NotImplementedError("add_css_resources must be implemented in subclasses")


class ISchema(Interface):
    """
    Allows to hook into the schema layer and add new fields into it.
    The schema is a layer on top of the database schema so plugin developers can
    add new fields to cropontology tables without affecting the structure
    of the database. New fields are stored in extra as JSON keys
    """

    def update_schema(self, config):
        """
        Called by cropontology so plugins can add new fields to table schemata

        :param config: ``pyramid.config`` object
        :return Returns a dict array [{'schema':'schema_to_update','fieldname':'myfield',
                                       'fielddesc':'A good description of myfield'}]

        Plugin writers should use the utility functions:
            - addFieldToUserSchema
            - addFieldToProjectSchema
            - addFieldToEnumeratorSchema
            - addFieldToEnumeratorGroupSchema
            - addFieldToDataUserSchema
            - addFieldToDataGroupSchema
            - addFieldToFormSchema


        Instead of constructing the dict by themselves to ensure API compatibility

        """
        raise NotImplementedError("update_schema must be implemented in subclasses")


class IDatabase(Interface):
    """
    Allows to hook into the database schema so plugins can add new tables
    After calling this
    """

    def update_orm(self, metadata):
        """
        Called by cropontology so plugins can add new tables to cropontology ORM

        :param metadata: cropontology ORM metadata object

        """


class IRegistration(Interface):
    """
    Allows to hook into the user registration
    """

    def before_register(self, request, registrant):
        """
        Called by cropontology so plugins can do something before registering a user

        :param request: ``pyramid.request`` object
        :param registrant: Dictionary containing the details of the registrant
        :return Return a modified version of registrant, true or false if the registrant should be added. If False then
        a message should state why

        """
        raise NotImplementedError("before_register must be implemented in subclasses")

    def after_register(self, request, registrant):
        """
        Called by cropontology so plugins do something after registering a user

        :param request: ``pyramid.request`` object
        :param registrant: Dictionary containing the details of the registrant
        :return Return the next page that will be loaded after the registration. If empty or None the the cropontology
        private will be loaded

        """
        raise NotImplementedError(
            "on_authenticate_user must be implemented in subclasses"
        )


class IUserAuthentication(Interface):
    """
    Allows to hook into the user authentication
    """

    def after_login(self, request, user):
        """
        Called by cropontology so plugins can modify the login of users

        :param request: ``pyramid.request`` object
        :param user: user object
        :return Return true or false if the login should continue. If False then a message should state why

        """
        raise NotImplementedError("after_login must be implemented in subclasses")

    def on_authenticate_user(self, request, user_id, user_is_email):
        """
        Called by cropontology so plugins can modify the way cropontology gather information about the user

        :param request: ``pyramid.request`` object
        :param user_id: The user ID trying to authenticate
        :param user_is_email: Whether the user is an email
        :return Return None and and empty Dict to indicate that Forshare should get this in the normal way.
                False and None if the user must be denied.
                Otherwise true and then the Dict MUST contain at least the following keys:
                user_id : With the same userID authenticating
                user_email : With the email of the userID authenticating
                user_name : With the full name of the userID authenticating
                user_about : With the bio data of the userID authenticating or None
        """
        raise NotImplementedError(
            "on_authenticate_user must be implemented in subclasses"
        )

    def on_authenticate_password(self, request, user_id, password):
        """
        Called by cropontology so plugins can modify the way cropontology gather information about the user

        :param request: ``pyramid.request`` object
        :param user_id: The user ID trying to authenticate
        :param password: The password as is typed in the cropontology interface
        :return Return None to indicate that Forshare should get this in the normal way.
                False if the password is incorrect.
                Otherwise true
        """
        raise NotImplementedError(
            "on_authenticate_password must be implemented in subclasses"
        )


class IUserAuthorization(Interface):
    """
    Allows to hook into the user authorization.
    """

    def before_check_authorization(self, request):
        """
        Called by cropontology so plugins can modify the normal authorization of users

        :param request: ``pyramid.request`` object
        :return Return true or false if cropontology should check the authorization of a user.

        """
        raise NotImplementedError(
            "before_check_authorization must be implemented in subclasses"
        )

    def custom_authorization(self, request):
        """
        Called by cropontology so plugins can perform their own way of authorizing a user.
        :param request:
        :return: True, Authorized user name or False, ""
        """
        raise NotImplementedError(
            "custom_authorization must be implemented in subclasses"
        )


class ITemplateHelpers(Interface):
    """
    Add custom template helper functions.

    By implementing this plugin interface plugins can provide their own
    template helper functions, which custom templates can then access via the
    ``request.h`` variable.
    """

    def get_helpers(self):
        """
        Return a dict mapping names to helper functions.

        The keys of the dict should be the names with which the helper
        functions will be made available to templates, and the values should be
        the functions themselves. For example, a dict like:
        ``{'example_helper': example_helper}`` allows templates to access the
        ``example_helper`` function via ``request.h.example_helper()``.

        Function names should start with the name of the extension providing
        the function, to prevent name clashes between extensions.
        :return:
        """


class IPublicView(Interface):
    """
    Allows to hook into cropontology's view public class.
    """

    def before_processing(self, request):
        """
        Called by cropontology's PublicView class before processing a public view
        :param request: Pyramid request object
        :return: None
        """
        raise NotImplementedError(
            "IPublicView before_processing must be implemented in subclasses"
        )

    def after_processing(self, request, context):
        """
        Called by cropontology's PublicView class after processing a public view but just before returning the context
        :param request: Pyramid request object
        :param context: Context of the view
        :return: A modified version of context
        """
        raise NotImplementedError(
            "IPublicView after_processing must be implemented in subclasses"
        )


class IPrivateView(Interface):
    """
    Allows to hook into cropontology's private class.
    """

    def before_processing(self, request, class_data):
        """
        Called by cropontology's PrivateView class before processing a private view
        :param request: Pyramid request object
        :param class_data: Class parameters as dict
        :return: None
        """
        raise NotImplementedError(
            "IPrivateView before_processing must be implemented in subclasses"
        )

    def after_processing(self, request, context):
        """
        Called by cropontology's PrivateView class after processing a private view but just before returning the context
        :param request: Pyramid request object
        :param context: Context of the view
        :return: A modified version of context
        """
        raise NotImplementedError(
            "IPrivateView after_processing must be implemented in subclasses"
        )


class ITranslation(Interface):
    """
    Allows extensions to provide their own translation strings.
    """

    def get_translation_directory(self):
        """
        Called by cropontology so plugins can add a translation directory
        :return: String path to the translation directory
        """
        raise NotImplementedError(
            "translation_directory must be implemented in subclasses"
        )

    def get_translation_domain(self):
        """
        Called by cropontology so plugins can add a translation domain
        :return: String domain name
        """
        raise NotImplementedError(
            "translation_domain must be implemented in subclasses"
        )


class ILogOut(Interface):
    """
    Allow extensions to hook to the cropontology logout process
    """

    def before_log_out(self, request, user):
        """
        Called by cropontology so plugins can perform actions before cropontology logs out an user
        :param request: Pyramid request object
        :param user: User disconnecting
        :return: True if the logout should proceed. Or false to halt the logout
        """

    def after_log_out(self, request, user):
        """
        Called by cropontology so plugins can perform actions after cropontology logs out an user
        :param request: Pyramid request object
        :param user: User that disconnected
        :return: None
        """


class IUser(Interface):
    """
    Allows to hook into the processes that creates and updates users
    """

    def before_create(self, request, user_data):
        """
        Called by cropontology so plugins can perform actions before adding an user
        :param request: ``pyramid.request`` object
        :param user_data: User information to be added
        :return: Return a modified version of user_data, true or false if the assistant should be added.
        If False then a message should state why. Example: return user_data, False, "My message"
        """
        raise NotImplementedError("before_create must be implemented in subclasses")

    def after_create(self, request, user_data):
        """
        Called by cropontology so plugins can perform actions before adding an user
        :param request: ``pyramid.request`` object
        :param user_data: User information
        :return: None
        """
        raise NotImplementedError("after_create must be implemented in subclasses")

    def before_edit(self, request, user, user_data):
        """
        Called by cropontology so plugins can perform actions before editing an assistant
        :param request: ``pyramid.request`` object
        :param user: User owner of the project
        :param user_data: user information to be edited
        :return: Return a modified version of user_data, true or false if the assistant should be edited.
        If False then a message should state why. Example: return user_data, False, "My message"
        """
        raise NotImplementedError("before_edit must be implemented in subclasses")

    def after_edit(self, request, user, user_data):
        """
        Called by cropontology so plugins can perform actions before editing an user
        :param request: ``pyramid.request`` object
        :param user: User owner of the project
        :param user_data: User information
        :return: None
        """
        raise NotImplementedError("after_edit must be implemented in subclasses")


class IEnvironment(Interface):
    """
    Allows to hook into the process that creates the cropontology environment
    """

    def after_environment_load(self, settings):
        """
        Called by cropontology after the environment is configured
        :param settings: cropontology settings
        """


class IPluginObserver(Interface):
    """
    Plugin to the plugin loading mechanism

    This code is based on CKAN
    :Copyright (C) 2007 Open Knowledge Foundation
    :license: AGPL V3, see LICENSE for more details.

    """

    def before_load(self, plugin):
        """
        Called before a plugin is loaded
        This method is passed the plugin class.
        """

    def after_load(self, service):
        """
        Called after a plugin has been loaded.
        This method is passed the instantiated service object.
        """

    def before_unload(self, plugin):
        """
        Called before a plugin is loaded
        This method is passed the plugin class.
        """

    def after_unload(self, service):
        """
        Called after a plugin has been unloaded.
        This method is passed the instantiated service object.
        """
