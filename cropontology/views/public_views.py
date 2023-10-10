import datetime
import logging
import re
import secrets
import traceback
import uuid
from ast import literal_eval

import pymongo
import validators
from formencode.variabledecode import variable_decode
from jinja2 import ext
from neo4j import GraphDatabase
from pyramid.httpexceptions import HTTPFound
from pyramid.httpexceptions import HTTPNotFound
from pyramid.response import Response
from pyramid.security import remember
from pyramid.session import check_csrf_token

import cropontology.plugins as p
from cropontology.config.encdecdata import encode_data
from cropontology.processes.avatar import Avatar
from .classes import PublicView, SendEmailMixin
from ..config.auth import get_user_data, getUserByEmail, setPasswordResetToken, resetKeyExists, resetPassword, \
    get_user_by_reset_key
from ..config.jinja_extensions import jinjaEnv, extendThis
from ..plugins.helpers import readble_date
from ..processes.db import (
    register_user,
    update_last_login,
)

log = logging.getLogger("cropontology")

def render_template(template_filename, context):
    return jinjaEnv.get_template(template_filename).render(context)

class HomeView(PublicView):
    def process_view(self):
        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        ontology_collection = ontology_db["ontologies"]
        ontologies = list(ontology_collection.find().sort([("ontology_name", 1)]))

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        categories = []
        for an_ontology in ontologies:
            query = (
                'match(p {ontology_id: "'
                + an_ontology["ontology_id"]
                + '", root: True}) optional match (variable:Variable {ontology_id: "'
                + an_ontology["ontology_id"]
                + '"}) return p.id, count(variable) as var'
            )
            cursor = db.run(query)
            roots = []
            count = 0
            for an_item in cursor:
                roots.append(an_item["p.id"])
                count = an_item["var"]
            if len(roots) > 0:
                an_ontology["root"] = roots[0]
            else:
                an_ontology["root"] = "None"
            if an_ontology["category"] not in categories:
                categories.append(an_ontology["category"])
            an_ontology["variable"] = count
        result = []
        for a_category in categories:
            parts = a_category.split(" ")
            category_code = parts[0]
            del parts[0]
            category_name = " ".join(parts)
            category_data = {
                "code": category_code,
                "name": category_name,
                "ontologies": [],
            }
            for an_ontology in ontologies:
                if an_ontology["category"] == a_category:
                    category_data["ontologies"].append(an_ontology)
            result.append(category_data)

        mongo_client.close()
        db.close()

        return {"categories": result}


class ContentView(PublicView):
    def process_view(self):
        return {}


class APIHelpView(PublicView):
    def process_view(self):
        return {}


class NotFoundView(PublicView):
    def process_view(self):
        self.request.response.status = 404
        return {}


class Gravatar(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        try:
            size = int(self.request.params.get("size", 45))
        except ValueError:
            size = 45
        name = self.request.params.get("name", "#")
        avatar = Avatar.generate(size, name, "PNG")
        headers = [("Content-Type", "image/png")]
        return Response(avatar, 200, headers)


class ErrorView(PublicView):
    def process_view(self):
        user = None
        i_user_authorization = p.PluginImplementations(p.IUserAuthorization)
        continue_authorization = True
        for plugin in i_user_authorization:
            continue_authorization = plugin.before_check_authorization(self.request)
            break  # Only only plugin will be called for before_check_authorization
        if continue_authorization:
            policy = get_policy(self.request, "main")
            login_data = policy.authenticated_userid(self.request)
            if login_data is not None:
                login_data = literal_eval(login_data)
                if login_data["group"] == "mainApp":
                    user = login_data["login"]
        else:
            authorized = False
            user_authorized = None
            for plugin in i_user_authorization:
                authorized, user_authorized = plugin.custom_authorization(self.request)
                break  # Only only plugin will be called for custom_authorization
            if authorized:
                user = user_authorized

        if user is None:
            user = "Unknown"
        log.error(
            "Server Error in URL {}.\nAccount: {}\nError: \n{}".format(
                self.request.url, user, traceback.format_exc()
            )
        )
        self.request.response.status = 500
        return {}


class LoginView(PublicView):
    def process_view(self):
        # If we logged in then go to home
        next_page = self.request.params.get("next")
        if self.request.method == "GET":
            policy = get_policy(self.request, "main")
            login_data = policy.authenticated_userid(self.request)
            if login_data is not None:
                login_data = literal_eval(login_data)
                if login_data["group"] == "mainApp":
                    current_user = get_user_data(login_data["login"], self.request)
                    if current_user is not None:
                        self.returnRawViewResult = True
                        return HTTPFound(
                            location=self.request.route_url("home"),
                            headers={"FS_error": "true"},
                        )
        else:
            if (
                self.request.registry.settings.get("perform_post_checks", "true")
                == "true"
            ):
                safe = check_csrf_token(self.request, raises=False)
                if not safe:
                    raise HTTPNotFound()
            data = variable_decode(self.request.POST)

            login = data["email"]
            passwd = data["passwd"]
            user = get_user_data(login, self.request)
            if user is not None:
                login_data = {"login": user.id, "group": "mainApp"}
                if user.check_password(passwd, self.request):
                    continue_login = True
                    # Load connected plugins and check if they modify the login authorization
                    for plugin in p.PluginImplementations(p.IUserAuthentication):
                        continue_with_login, error_message = plugin.after_login(
                            self.request, user
                        )
                        if not continue_with_login:
                            self.append_to_errors(error_message)
                            continue_login = False
                        break  # Only one plugging will be called to extend after_login
                    if continue_login:
                        update_last_login(self.request, user.login)
                        headers = remember(
                            self.request, str(login_data), policies=["main"]
                        )
                        next_page = self.request.params.get(
                            "next"
                        ) or self.request.route_url("home")
                        self.returnRawViewResult = True
                        return HTTPFound(location=next_page, headers=headers)
                else:
                    log.error(
                        "Logging into account {} provided an invalid password".format(
                            login
                        )
                    )
                    self.append_to_errors(
                        self._(
                            "The user account does not exists or the password is invalid"
                        )
                    )
            else:
                log.error("User account {} does not exist".format(login))
                self.append_to_errors(
                    self._(
                        "The user account does not exists or the password is invalid"
                    )
                )
        return {"next": next_page}


class RecoverPasswordView(PublicView, SendEmailMixin):

    def send_password_email(self, email_to, reset_token, reset_key, user_dict):
        jinjaEnv.add_extension(ext.i18n)
        jinjaEnv.add_extension(extendThis)
        _ = self.request.translate
        email_from = self.request.registry.settings.get("email.from", None)

        if email_from is None:
            log.error(
                "Crop Ontology has no email settings in place. Email service is disabled."
            )
            return False
        if email_from == "":
            return False
        date_string = readble_date(datetime.datetime.now(), self.request.locale_name)
        reset_url = self.request.route_url("reset_password", reset_key=reset_key)
        text = render_template(
            "email/recover_email.jinja2",
            {
                "recovery_date": date_string,
                "reset_token": reset_token,
                "user_dict": user_dict,
                "reset_url": reset_url,
                "_": _,
            },
        )

        self.send_email(email_from, email_to, "Crop Ontology - Password reset request", text, user_dict.name)

    def process_view(self):
        # If we logged in then go to dashboard
        policy = get_policy(self.request, "main")
        login = policy.authenticated_userid(self.request)
        currentUser = get_user_data(login, self.request)
        if currentUser is not None:
            raise HTTPNotFound()

        error_summary = {}
        if "submit" in self.request.POST:
            email = self.request.POST.get("user_email", None)
            if email is not None:
                user, password = getUserByEmail(email, self.request)
                if user is not None:

                    reset_key = str(uuid.uuid4())
                    reset_token = secrets.token_hex(16)
                    setPasswordResetToken(
                        self.request, user.login, reset_key, reset_token
                    )
                    self.send_password_email(user.email, reset_token, reset_key, user)
                    self.returnRawViewResult = True
                    return HTTPFound(location=self.request.route_url("login"))
                else:
                    error_summary["email"] = self._(
                        "Cannot find an user with such email address"
                    )
            else:
                error_summary["email"] = self._("You need to provide an email address")

        return {"error_summary": error_summary}


class ResetPasswordView(PublicView):
    def process_view(self):

        error_summary = {}
        dataworking = {}

        reset_key = self.request.matchdict["reset_key"]

        if not resetKeyExists(self.request, reset_key):
            raise HTTPNotFound()

        if self.request.method == "POST":

            safe = check_csrf_token(self.request, raises=False)

            if not safe:
                raise HTTPNotFound()

            dataworking = self.get_post_dict()
            new_password = dataworking["password"].strip()
            new_password2 = dataworking["password2"].strip()
            reset_token = dataworking["reset_token"]
            user = get_user_by_reset_key(self.request, reset_token)

            if user is not None:
                user = get_user_data(user.user_id, self.request)
                if user.userData["user_password_reset_key"] == reset_key:
                    if user.userData["user_password_reset_token"] == reset_token:
                        if (
                                user.userData["user_password_reset_expires_on"]
                                > datetime.datetime.now()
                        ):
                            if new_password != "":
                                if new_password == new_password2:
                                    new_password = encode_data(
                                        self.request, new_password
                                    )
                                    resetPassword(
                                        self.request,
                                        user.userData["user_name"],
                                        reset_key,
                                        reset_token,
                                        new_password,
                                    )
                                    self.returnRawViewResult = True
                                    return HTTPFound(
                                        location=self.request.route_url("login")
                                    )
                                else:
                                    error_summary = {
                                        "Error": self._(
                                            "The password and the confirmation are not the same"
                                        )
                                    }
                            else:
                                error_summary = {
                                    "Error": self._("The password cannot be empty")
                                }
                        else:
                            error_summary = {"Error": self._("Invalid token")}
                    else:
                        error_summary = {"Error": self._("Invalid token")}
                else:
                    error_summary = {"Error": self._("Invalid key")}
            else:
                error_summary = {"Error": self._("User does not exist")}

        return {"error_summary": error_summary, "dataworking": dataworking}

class RefreshSessionView(PublicView):
    def process_view(self):
        return {}


def get_policy(request, policy_name):
    policies = request.policies()
    for policy in policies:
        if policy["name"] == policy_name:
            return policy["policy"]
    return None


def log_out_view(request):
    policy = get_policy(request, "main")
    headers = policy.forget(request)
    loc = request.route_url("home")
    raise HTTPFound(location=loc, headers=headers)


class RegisterView(PublicView):
    def process_view(self):
        if self.request.method == "GET":
            data = {}
        else:
            if (
                self.request.registry.settings.get("perform_post_checks", "true")
                == "true"
            ):
                safe = check_csrf_token(self.request, raises=False)
                if not safe:
                    raise HTTPNotFound()
            data = variable_decode(self.request.POST)

            if validators.email(data["user_email"]):
                if data["user_password"] != "":
                    if re.match(r"^[A-Za-z0-9._]+$", data["user_id"]):
                        if data["user_password"] == data["user_password2"]:
                            if len(data["user_password"]) <= 50:
                                data["user_cdate"] = datetime.datetime.now()
                                if "user_apikey" not in data.keys():
                                    data["user_apikey"] = str(uuid.uuid4())
                                data["user_password"] = encode_data(
                                    self.request, data["user_password"]
                                )
                                data["user_active"] = 1
                                # Load connected plugins and check if they modify the registration of an user
                                continue_registration = True
                                for plugin in p.PluginImplementations(p.IRegistration):
                                    (
                                        data,
                                        continue_with_registration,
                                        error_message,
                                    ) = plugin.before_register(self.request, data)
                                    if not continue_with_registration:
                                        self.append_to_errors(error_message)
                                        continue_registration = False
                                    break  # Only one plugging will be called to extend before_register
                                if continue_registration:
                                    added, error_message = register_user(
                                        self.request, data
                                    )
                                    if not added:
                                        self.append_to_errors(error_message)
                                    else:
                                        # Load connected plugins so they perform actions after the registration
                                        # is performed
                                        next_page = self.request.route_url("home")
                                        plugin_next_page = ""
                                        for plugin in p.PluginImplementations(
                                            p.IRegistration
                                        ):
                                            plugin_next_page = plugin.after_register(
                                                self.request, data
                                            )
                                            break  # Only one plugging will be called to extend after_register
                                        if plugin_next_page is not None:
                                            if plugin_next_page != "":
                                                if plugin_next_page != next_page:
                                                    next_page = plugin_next_page
                                        if next_page == self.request.route_url("home"):
                                            login_data = {
                                                "login": data["user_id"],
                                                "group": "mainApp",
                                            }
                                            headers = remember(
                                                self.request,
                                                str(login_data),
                                                policies=["main"],
                                            )
                                            self.returnRawViewResult = True
                                            return HTTPFound(
                                                location=self.request.route_url("home"),
                                                headers=headers,
                                            )
                                        else:
                                            self.returnRawViewResult = True
                                            return HTTPFound(next_page)
                            else:
                                self.append_to_errors(
                                    self._(
                                        "The password must be less than 50 characters"
                                    )
                                )
                        else:
                            log.error(
                                "Password {} and confirmation {} are not the same".format(
                                    data["user_password"], data["user_password2"]
                                )
                            )
                            self.append_to_errors(
                                self._(
                                    "The password and its confirmation are not the same"
                                )
                            )
                    else:
                        log.error(
                            "Registering user {} has invalid characters".format(
                                data["user_id"]
                            )
                        )
                        self.append_to_errors(
                            self._(
                                "The user id has invalid characters. Only underscore "
                                "and dot are allowed"
                            )
                        )
                else:
                    log.error(
                        "Registering user {} has empty password".format(data["user_id"])
                    )
                    self.append_to_errors(self._("The password cannot be empty"))
            else:
                log.error("Invalid email {}".format(data["user_email"]))
                self.append_to_errors(self._("Invalid email"))
        return {"next": next, "userdata": data}
