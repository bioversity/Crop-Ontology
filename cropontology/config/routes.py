import logging

import cropontology.plugins as p
from ..plugins.utilities import add_route

from ..views.search import SearchView
from ..views.term import (
    TermDetailsView,
    TermEditorView,
    TermRevisionListView,
    CompareRevisionView,
    DisregardRevisionView,
    RejectRevisionView,
    ApproveRevisionView,
)
from ..views.search import GetBucketView
from ..views.tree import TreeView
from ..views.public_views import (
    NotFoundView,
    HomeView,
    log_out_view,
    LoginView,
    # RegisterView,
    RefreshSessionView,
    ErrorView,
    Gravatar,
    ContentView,
    APIHelpView,
)
from ..views.pages import (
    PageListView,
    PageAddView,
    PageEditView,
    PageUploadImageView,
    PageGetImageView,
    ViewPageView,
    PageDeleteView,
)
from ..views.sections import (
    SectionListView,
    SectionAddView,
    SectionEditView,
    SectionUploadImageView,
    SectionGetImageView,
    SectionDeleteView,
    SectionUsersView,
    SectionRemoveUserView,
)

from ..views.ontology import OntologyView, JSONDataView, OntologyRDFView
from ..views.api import APIDocView
from ..views.brapi import (
    BRAPITraitsView,
    BRAPICallsView,
    BRAPIOntologiesView,
    BRAPIVariablesView,
)

from ..views.rdf_api import EBIMetadataView, RDFCleanView
from ..views.users import (
    APIUserSearchSelect2,
    UsersListView,
    AddUserView,
    EditUserView,
    ChangePasswordView,
)


log = logging.getLogger("cropontology")

route_list = []


def append_to_routes(route_array):
    """
    #This function append or overrides the routes to the main list
    :param route_array: Array of routes
    """
    for new_route in route_array:
        found = False
        pos = 0
        for curr_route in route_list:
            if curr_route["path"] == new_route["path"]:
                found = True
                break
            pos = pos + 1
        if not found:
            route_list.append(new_route)
        else:
            route_list[pos]["name"] = new_route["name"]
            route_list[pos]["view"] = new_route["view"]
            route_list[pos]["renderer"] = new_route["renderer"]


def load_routes(config):
    """
    Call connected to plugins to add any routes before cropontology
    :param config: Pyramid config
    """
    routes = []
    for plugin in p.PluginImplementations(p.IRoutes):
        routes = plugin.before_mapping(config)
        append_to_routes(routes)

    # cropontology public routes
    routes.append(add_route("home", "/", HomeView, "index.jinja2"))
    routes.append(
        add_route("refresh", "/refresh", RefreshSessionView, "generic/refresh.jinja2")
    )
    routes.append(add_route("login", "/login", LoginView, "user/login.jinja2"))
    # routes.append(add_route("register", "/join", RegisterView, "user/register.jinja2"))
    routes.append(add_route("logout", "/logout", log_out_view, None))
    routes.append(add_route("gravatar", "/gravatar", Gravatar, None))
    routes.append(
        add_route(
            "change_password",
            "/change_password",
            ChangePasswordView,
            "user/change_password.jinja2",
        )
    )

    routes.append(
        add_route("about", "/about", ContentView, "pages/standard/about.jinja2")
    )
    routes.append(
        add_route(
            "feedback", "/feedback", ContentView, "pages/standard/feedback.jinja2"
        )
    )
    routes.append(add_route("help", "/help", ContentView, "pages/standard/help.jinja2"))
    routes.append(
        add_route("api_help", "/api_help", APIHelpView, "pages/standard/api.jinja2")
    )

    # Pages
    routes.append(
        add_route("page_list", "/pages", PageListView, "pages/list_pages.jinja2")
    )
    routes.append(
        add_route("page_add", "/pages/add", PageAddView, "pages/add_page.jinja2")
    )
    routes.append(
        add_route(
            "page_edit", "/page/{pageid}/edit", PageEditView, "pages/edit_page.jinja2"
        )
    )
    routes.append(
        add_route("page_delete", "/page/{pageid}/delete", PageDeleteView, None)
    )
    routes.append(
        add_route("page_view", "/page/{pageid}", ViewPageView, "pages/view_page.jinja2")
    )
    routes.append(
        add_route("page_image_upload", "/pages/upload", PageUploadImageView, "json")
    )
    routes.append(
        add_route(
            "page_image_request",
            "/pages/image/{imageid}",
            PageGetImageView,
            None,
        )
    )
    # Sections
    routes.append(
        add_route(
            "section_list",
            "/sections",
            SectionListView,
            "sections/list_sections.jinja2",
        )
    )
    routes.append(
        add_route(
            "section_add",
            "/sections/add",
            SectionAddView,
            "sections/add_section.jinja2",
        )
    )
    routes.append(
        add_route(
            "section_edit",
            "/section/{sectionid}/edit",
            SectionEditView,
            "sections/edit_section.jinja2",
        )
    )
    routes.append(
        add_route(
            "section_users",
            "/section/{sectionid}/users",
            SectionUsersView,
            "sections/user_sections.jinja2",
        )
    )
    routes.append(
        add_route(
            "section_remove_user",
            "/section/{sectionid}/user/{userid}/remove",
            SectionRemoveUserView,
            None,
        )
    )
    routes.append(
        add_route(
            "section_delete",
            "/section/{sectionid}/delete",
            SectionDeleteView,
            None,
        )
    )
    routes.append(
        add_route(
            "section_image_upload",
            "/section/{sectionid}/upload",
            SectionUploadImageView,
            "json",
        )
    )
    routes.append(
        add_route(
            "section_image_request",
            "/section/{sectionid}/image/{imageid}",
            SectionGetImageView,
            None,
        )
    )

    # Ontology
    routes.append(
        add_route(
            "ontology",
            "/ontology/{ontology_id}",
            OntologyView,
            "/ontology/ontology_d3.jinja2",
        )
    )
    routes.append(
        add_route(
            "ontology_rdf",
            "/ontology/{ontology_id}/rdf",
            RDFCleanView,
            None,
        )
    )

    routes.append(
        add_route(
            "ontology_owl",
            "/ontology/{ontology_id}/{ontology_name}/owl",
            RDFCleanView,
            None,
        )
    )
    routes.append(
        add_route(
            "ontology_json",
            "/ontology_json/{ontology_id}",
            JSONDataView,
            "json",
        )
    )

    # Users
    routes.append(
        add_route(
            "user_list",
            "/users",
            UsersListView,
            "user/list_users.jinja2",
        )
    )
    routes.append(
        add_route(
            "add_user",
            "/users/add",
            AddUserView,
            "user/add_user.jinja2",
        )
    )
    routes.append(
        add_route(
            "modify_user",
            "/user/{userid}/edit",
            EditUserView,
            "user/edit_user.jinja2",
        )
    )

    # Term revision
    routes.append(
        add_route(
            "revisions", "/revisions", TermRevisionListView, "term_revision.jinja2"
        )
    )
    routes.append(
        add_route(
            "compare_revision",
            "/revision/{revisionid}/view",
            CompareRevisionView,
            "compare_revision.jinja2",
        )
    )
    routes.append(
        add_route(
            "disregard_revision",
            "/revision/{revisionid}/disregard",
            DisregardRevisionView,
            None,
        )
    )
    routes.append(
        add_route(
            "reject_revision",
            "/revision/{revisionid}/reject",
            RejectRevisionView,
            None,
        )
    )
    routes.append(
        add_route(
            "approve_revision",
            "/revision/{revisionid}/approve",
            ApproveRevisionView,
            None,
        )
    )

    # Search
    routes.append(add_route("search", "/search", SearchView, "search.jinja2"))
    routes.append(add_route("bucket", "/search/bucket/", GetBucketView, "json"))
    routes.append(
        add_route("term_details", "/term/{termid}", TermDetailsView, "term.jinja2")
    )
    routes.append(
        add_route(
            "term_edit", "/term/{termid}/edit", TermEditorView, "term_editor.jinja2"
        )
    )

    # Tree
    routes.append(add_route("tree", "/tree/{termid}", TreeView, "json"))

    # Here comes the BRAPI API routes

    routes.append(add_route("brapi_traits", "/brapi/v1/traits", BRAPITraitsView, None))
    routes.append(
        add_route("brapi_trait", "/brapi/v1/traits/{trait_id}", BRAPITraitsView, None)
    )
    routes.append(add_route("brapi_calls", "/brapi/v1/calls", BRAPICallsView, None))
    routes.append(
        add_route("brapi_ontologies", "/brapi/v1/ontologies", BRAPIOntologiesView, None)
    )
    routes.append(
        add_route("brapi_variables", "/brapi/v1/variables", BRAPIVariablesView, None)
    )
    routes.append(
        add_route(
            "brapi_variable",
            "/brapi/v1/variables/{variable_id}",
            BRAPIVariablesView,
            None,
        )
    )

    # Here comes the download (EBI/AGROPORTAL) API routes
    routes.append(add_route("ebi_metadata", "/metadata", EBIMetadataView, None))

    # Here comes the CO API routes

    routes.append(add_route("api_ifo", "/api/v1/info", APIDocView, "api/info.jinja2"))

    # Users API
    routes.append(
        add_route(
            "api_select2_users",
            "/api/v1/select2_user",
            APIUserSearchSelect2,
            "json",
        )
    )

    append_to_routes(routes)

    # Add the not found route
    config.add_notfound_view(NotFoundView, renderer="generic/404.jinja2")

    if log.level == logging.WARN:
        config.add_view(ErrorView, context=Exception, renderer="generic/500.jinja2")

    # Call connected plugins to add any routes after cropontology
    for plugin in p.PluginImplementations(p.IRoutes):
        routes = plugin.after_mapping(config)
        append_to_routes(routes)

    # Now add the routes and views to the Pyramid config
    for curr_route in route_list:
        config.add_route(curr_route["name"], curr_route["path"])
        config.add_view(
            curr_route["view"],
            route_name=curr_route["name"],
            renderer=curr_route["renderer"],
        )
