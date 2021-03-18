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
from ast import literal_eval

from babel import Locale
from formencode.variabledecode import variable_decode
from pyramid.httpexceptions import HTTPFound
from pyramid.httpexceptions import HTTPNotFound, exception_response
from pyramid.response import Response
from pyramid.session import check_csrf_token

from cropontology.processes.db import (
    get_user_details,
    get_user_by_api_key,
)
from .. import plugins as p
from ..config.auth import get_user_data

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
