# -*- coding: utf-8 -*-
"""
    cropontology.resources.resources
    ~~~~~~~~~~~~~~~~~~

    Provides the basic view classes for cropontology and
    the Digest Authorization for ODK

    :copyright: (c) 2017 by QLands Technology Consultants.
    :license: AGPL, see LICENSE for more details.
"""

import json
import logging
import smtplib
from ast import literal_eval
import os
from time import time
from email import utils
from email.header import Header
from email.mime.text import MIMEText

from babel import Locale
from formencode.variabledecode import variable_decode
from pyramid.httpexceptions import HTTPFound
from pyramid.httpexceptions import HTTPNotFound, exception_response
from pyramid.response import Response
from pyramid.session import check_csrf_token
from webhelpers2.html import literal
from cropontology.processes.db import (
    get_user_details,
    get_user_by_api_key,
)
from .. import plugins as p
from ..config.auth import get_user_data
from cropontology.models import OntologyManageAccess
from cropontology.processes.db.user import get_user_by_user_id


log = logging.getLogger("cropontology")


class PrivateView(object):
    def __init__(self, request):
        self.request = request
        self.user = None
        self._ = self.request.translate
        self.errors = []
        self.userID = ""
        self.classResult = {}
        self.viewResult = {}
        self.publicView = False
        self.returnRawViewResult = False
        self.checkCrossPost = True
        self.checkCRF = True
        locale = Locale(request.locale_name)
        if locale.character_order == "left-to-right":
            self.classResult["rtl"] = False
        else:
            self.classResult["rtl"] = True
        self.classResult["userLogged"] = False

    def append_to_errors(self, error):
        self.request.response.headers["cropontology_error"] = "true"
        self.errors.append(error)

    def get_policy(self, policy_name):
        policies = self.request.policies()
        for policy in policies:
            if policy["name"] == policy_name:
                return policy["policy"]
        return None

    def check_post_put_delete(self):
        if (
            self.request.method == "POST"
            or self.request.method == "PUT"
            or self.request.method == "DELETE"
        ):
            if (
                self.request.registry.settings.get("perform_post_checks", "true")
                == "true"
            ):
                safe = check_csrf_token(self.request, raises=False)
                if not safe:
                    if self.checkCRF:
                        self.request.session.pop_flash()
                        log.error("SECURITY-CSRF error at {} ".format(self.request.url))
                        raise HTTPFound(self.request.route_url("refresh"))
                else:
                    if self.checkCrossPost:
                        if self.request.referer != self.request.url:
                            self.request.session.pop_flash()
                            log.error(
                                "SECURITY-CrossPost error. Posting at {} from {} ".format(
                                    self.request.url, self.request.referer
                                )
                            )
                            raise HTTPNotFound()

    def check_authorization(self):
        policy = self.get_policy("main")
        login_data = policy.authenticated_userid(self.request)
        if login_data is not None:
            login_data = literal_eval(login_data)
            if login_data["group"] == "mainApp":
                self.user = get_user_data(login_data["login"], self.request)
                self.userID = login_data["login"]
                self.classResult["activeUser"] = self.user
                if self.user is None:
                    if not self.publicView:
                        raise HTTPFound(
                            location=self.request.route_url(
                                "login", _query={"next": self.request.url}
                            )
                        )
                else:
                    self.classResult["userLogged"] = True
                self.check_post_put_delete()
            else:
                if not self.publicView:
                    raise HTTPFound(
                        location=self.request.route_url(
                            "login", _query={"next": self.request.url}
                        )
                    )
        else:
            if not self.publicView:
                raise HTTPFound(
                    location=self.request.route_url(
                        "login", _query={"next": self.request.url}
                    )
                )

    def __call__(self):
        def build_menu(menu_items, lines):
            for a_menu_item in menu_items:
                if "children" in a_menu_item.keys():
                    lines.append(
                        '<li class="nav-item dropdown"><a id="id_'
                        + a_menu_item["text"].lower()
                        + '" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" '
                        'class="nav-link dropdown-toggle">'
                        + a_menu_item["text"]
                        + '</a><ul aria-labelledby="id_'
                        + a_menu_item["text"].lower()
                        + '" class="dropdown-menu border-0 shadow">'
                    )
                    build_menu(a_menu_item["children"], lines)
                    lines.append("</ul></li>")
                else:
                    lines.append(
                        '<li class="nav-item"><a target="'
                        + a_menu_item["target"]
                        + '" href="'
                        + a_menu_item["href"]
                        + '" class="nav-link">'
                        + a_menu_item["text"]
                        + "</a></li>"
                    )

        error = self.request.session.pop_flash(queue="error")
        if len(error) > 0:
            self.append_to_errors(error[0].replace("|error", ""))

        i_user_authorization = p.PluginImplementations(p.IUserAuthorization)
        continue_authorization = True
        for plugin in i_user_authorization:
            continue_authorization = plugin.before_check_authorization(self.request)
            break  # Only only plugin will be called for before_check_authorization
        if continue_authorization:
            self.check_authorization()
        else:
            authorized = False
            user_authorized = ""
            for plugin in i_user_authorization:
                authorized, user_authorized = plugin.custom_authorization(self.request)
                break  # Only only plugin will be called for custom_authorization
            if authorized:
                self.user = get_user_data(user_authorized, self.request)
                self.classResult["activeUser"] = self.user
                if self.user is None:
                    if not self.publicView:
                        raise HTTPFound(
                            location=self.request.route_url(
                                "login", _query={"next": self.request.url}
                            )
                        )
                else:
                    self.classResult["userLogged"] = True
                self.check_post_put_delete()
            else:
                if not self.publicView:
                    raise HTTPFound(
                        location=self.request.route_url(
                            "login", _query={"next": self.request.url}
                        )
                    )

        self.classResult["errors"] = self.errors

        if not self.publicView:
            i_private_view_implementations = p.PluginImplementations(p.IPrivateView)
            for plugin in i_private_view_implementations:
                plugin.before_processing(
                    self.request,
                    {
                        "returnRawViewResult": self.returnRawViewResult,
                        "checkCrossPost": self.checkCrossPost,
                        "user": self.user,
                    },
                )
        else:
            i_public_view_implementations = p.PluginImplementations(p.IPublicView)
            for plugin in i_public_view_implementations:
                plugin.before_processing(
                    self.request,
                )

        repository_path = self.request.registry.settings.get("repository.path")
        paths = ["menu.json"]
        menu_json_file = os.path.join(repository_path, *paths)
        if os.path.exists(menu_json_file):
            with open(menu_json_file) as f:
                menu_data = json.load(f)
        else:
            menu_data = [
                {
                    "text": "About",
                    "icon": "",
                    "href": self.request.route_url("about"),
                    "target": "_self",
                    "title": "About this site",
                },
                {
                    "text": "Feedback",
                    "icon": "empty",
                    "href": self.request.route_url("feedback"),
                    "target": "_self",
                    "title": "Tell us what you think",
                },
                {
                    "text": "Help",
                    "icon": "empty",
                    "href": self.request.route_url("help"),
                    "target": "_self",
                    "title": "Help about this site",
                },
                {
                    "text": "API",
                    "icon": "empty",
                    "href": self.request.route_url("api_help"),
                    "target": "_self",
                    "title": "API information",
                },
            ]
            with open(menu_json_file, "w") as json_file:
                json.dump(menu_data, json_file)

        html_lines = []
        build_menu(menu_data, html_lines)
        menu_string = ""
        for a_line in html_lines:
            menu_string = menu_string + a_line + "\n"
        self.classResult["menu_string"] = literal(menu_string)

        self.viewResult = self.process_view()

        if not self.publicView:
            i_private_view_implementations = p.PluginImplementations(p.IPrivateView)
            process_dict = {}
            for plugin in i_private_view_implementations:
                process_dict = plugin.after_processing(self.request, self.viewResult)

            if not self.returnRawViewResult:
                self.viewResult.update(process_dict)
        else:
            i_public_view_implementations = p.PluginImplementations(p.IPublicView)
            process_dict = {}
            for plugin in i_public_view_implementations:
                process_dict = plugin.after_processing(self.request, self.viewResult)

            if not self.returnRawViewResult:
                self.viewResult.update(process_dict)
        if not self.returnRawViewResult:
            self.classResult.update(self.viewResult)
            return self.classResult
        else:
            return self.viewResult

    def process_view(self):
        return {"activeUser": self.user}

    def get_post_dict(self):
        dct = variable_decode(self.request.POST)
        return dct

    def reload_user_details(self):
        self.classResult["userDetails"] = get_user_details(self.request, self.userID)

    def add_error(self, message):
        self.request.session.flash("{}|error".format(message), queue="error")


class PublicView(PrivateView):
    def __init__(self, request):
        PrivateView.__init__(self, request)
        self.publicView = True


class APIView(object):
    def __init__(self, request):
        self.request = request
        self.user = None
        self.api_key = ""
        self._ = self.request.translate
        self.error = False

    def __call__(self):
        if self.request.method == "GET":
            self.api_key = self.request.params.get("apikey", None)
        else:
            self.api_key = self.request.POST.get("apikey", None)
        if self.api_key is not None:
            self.user = get_user_by_api_key(self.request, self.api_key)
            if self.user is None:
                response = Response(
                    content_type="application/json",
                    status=401,
                    body=json.dumps(
                        {
                            "error": self._(
                                "This API key does not exist or is inactive"
                            ),
                            "error_type": "authentication",
                        }
                    ).encode(),
                )
                return response
        else:
            response = Response(
                content_type="application/json",
                status=401,
                body=json.dumps(
                    {
                        "error": self._("You need to specify an API key"),
                        "error_type": "api_key_missing",
                    }
                ).encode(),
            )
            return response

        res = self.process_view()
        if not self.error:
            return res
        else:
            response = Response(
                content_type="application/json",
                status=400,
                body=json.dumps(res).encode(),
            )
            return response

    def process_view(self):
        return {"key": self.api_key}

    def check_keys(self, key_list):
        not_found_keys = []
        for a_key in key_list:
            if a_key not in self.request.POST.keys():
                not_found_keys.append(a_key)
        if not_found_keys:
            json_result = {
                "error": self._(
                    "The following keys were not present in the submitted JSON"
                ),
                "keys": [],
                "error_type": "missing_key",
            }
            for a_key in not_found_keys:
                json_result["keys"].append(a_key)

            response = exception_response(
                400,
                content_type="application/json",
                body=json.dumps(json_result).encode(),
            )
            raise response

    def return_error(self, error_type, error_message):
        response = exception_response(
            400,
            content_type="application/json",
            body=json.dumps(
                {"error": error_message, "error_type": error_type}
            ).encode(),
        )
        raise response


class SendEmailMixin(object):
    smtp_port = 587

    @property
    def smtp_server(self):
        return self.request.registry.settings.get(
            "email.server", "localhost"
        )

    @property
    def smtp_user(self):
        return self.request.registry.settings.get("email.user")

    @property
    def smtp_password(self):
        return self.request.registry.settings.get("email.password")

    def send_email(self, from_email, to_email, subject, body, target_name=''):

        smtp_server = self.smtp_server

        if not smtp_server:
            log.error('Cannot send emails')
            return

        msg = MIMEText(body.encode("utf-8"), "plain", "utf-8")
        _subject = Header(subject.encode("utf-8"), "utf-8")
        msg["Subject"] = _subject
        msg["From"] = "{} <{}>".format("Crop Ontology: ", from_email)
        msg["To"] = "{} <{}>".format(target_name, to_email)
        msg["Date"] = utils.formatdate(time())
        try:

            server = smtplib.SMTP(smtp_server, self.smtp_port)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(self.smtp_user, self.smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())
            server.quit()

        except Exception as e:
            log.error(f'SendEmailMixin error: {e}')


class OntologyManageAccessUtilsMixin(object):

    def get_manager_access(self, user_id):
        ontology_manager_access = self.request.dbsession.query(OntologyManageAccess).filter(
            OntologyManageAccess.user_id == user_id).all()
        result = []
        for access in ontology_manager_access:
            result.append(access.ontology_id)
        return result


class RevisionStatusChangeEmailMixin(SendEmailMixin):

    def _send_email(self, text, email_to, subject, target):
        from cropontology.config.jinja_extensions import jinjaEnv, extendThis
        from jinja2 import ext
        jinjaEnv.add_extension(ext.i18n)
        jinjaEnv.add_extension(extendThis)
        email_from = self.request.registry.settings.get("email.from", None)

        self.send_email(email_from, email_to, subject, text, target)

    def send_revision_status_update_email(self, created_by, current_status):
        from cropontology.views.public_views import render_template

        if not created_by:
            return

        submitter_user = get_user_by_user_id(self.request, created_by)
        if not submitter_user:
            return

        email_to = submitter_user.user_email

        text = render_template(
            "email/term_revision_status_update.jinja2",
            {
                "current_status": current_status,
                "_": self.request.translate,
            },
        )

        self._send_email(text, email_to, "Crop Ontology - New Revisions Status Update", '')
