from cropontology.views.classes import PrivateView
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
import paginate
from cropontology.processes.db import (
    query_users,
    user_exists,
    email_exists,
    register_user,
    get_user_details,
    update_profile,
    update_password,
)
import re
from cropontology.config.encdecdata import encode_data
import validators
import datetime
import uuid
import logging

log = logging.getLogger("cropontology")


class UsersListView(PrivateView):
    def process_view(self):
        if self.user.super != 1:
            raise HTTPNotFound
        return {}


class APIUserSearchSelect2(PrivateView):
    def process_view(self):
        q = self.request.params.get("q", "")
        include_me = self.request.params.get("include_me", "False")
        if include_me == "False":
            include_me = False
        else:
            include_me = True
        if q == "":
            q = None
        current_page = self.request.params.get("page")
        if current_page is None:
            current_page = 1
        query_size = 10
        self.returnRawViewResult = True
        if q is not None:
            q = q.lower()
            query_result, total = query_users(self.request, q, 0, query_size)
            if total > 0:
                collection = list(range(total))
                page = paginate.Page(collection, current_page, 10)
                query_result, total = query_users(
                    self.request, q, page.first_item - 1, query_size
                )
                select2_result = []
                for result in query_result:
                    if result[0] != self.userID or include_me:
                        select2_result.append(
                            {
                                "id": result[0],
                                "text": result[1],
                                "user_email": result[2],
                            }
                        )
                with_pagination = False
                if page.page_count > 1:
                    with_pagination = True
                if not with_pagination:
                    return {"total": total, "results": select2_result}
                else:
                    return {
                        "total": total,
                        "results": select2_result,
                        "pagination": {"more": True},
                    }
            else:
                return {"total": 0, "results": []}
        else:
            return {"total": 0, "results": []}


class AddUserView(PrivateView):
    def process_view(self):
        if self.user.super != 1:
            raise HTTPNotFound

        user_details = {}
        if self.request.method == "POST":
            user_details = self.get_post_dict()
            if re.match(r"^[A-Za-z0-9._]+$", user_details["user_id"]):
                if not user_exists(self.request, user_details["user_id"], False):
                    if user_details["user_password"] != "":
                        if (
                            user_details["user_password"]
                            == user_details["user_password2"]
                        ):
                            encoded_password = encode_data(
                                self.request, user_details["user_password"]
                            )

                            email_valid = validators.email(user_details["user_email"])
                            if not email_valid:
                                self.append_to_errors(
                                    self._("This email address is not valid")
                                )
                            else:
                                if email_exists(
                                    self.request,
                                    user_details["user_id"],
                                    user_details["user_email"],
                                ):
                                    self.append_to_errors(
                                        self._(
                                            "This email address already belongs to another account"
                                        )
                                    )
                                else:
                                    if "user_super" in user_details.keys():
                                        user_details["user_super"] = 1
                                    else:
                                        user_details["user_super"] = 0
                                    user_details["user_password"] = encoded_password
                                    user_details.pop("user_password2", None)
                                    user_details["user_cdate"] = datetime.datetime.now()
                                    user_details["user_apikey"] = str(uuid.uuid4())

                                    added, error_message = register_user(
                                        self.request, user_details
                                    )
                                    if not added:
                                        self.append_to_errors(error_message)
                                    else:
                                        next_page = self.request.route_url("user_list")
                                        self.request.session.flash(
                                            self._("The user was added successfully")
                                        )
                                        self.returnRawViewResult = True
                                        return HTTPFound(location=next_page)
                        else:
                            self.append_to_errors(
                                self._(
                                    "The password and its confirmation are not the same"
                                )
                            )
                    else:
                        self.append_to_errors(self._("The password cannot be empty"))
                else:
                    self.append_to_errors(self._("This user already exists"))
            else:
                self.append_to_errors(
                    self._(
                        "The user id has invalid characters. Only underscore "
                        "and dot are allowed"
                    )
                )

        return {"userData": user_details}


class EditUserView(PrivateView):
    def process_view(self):
        if self.user.super != 1:
            raise HTTPNotFound

        user_to_modify = self.request.matchdict["userid"]
        user_data = get_user_details(self.request, user_to_modify, False)
        if self.request.method == "POST":
            action = None
            user_details = self.get_post_dict()
            if "modify" in user_details.keys():
                action = "modify"
                if "user_id" in user_details.keys():
                    user_details.pop("user_id")

                email_valid = validators.email(user_details["user_email"])
                if not email_valid:
                    self.append_to_errors(self._("This email address is not valid"))
                else:
                    if email_exists(
                        self.request, user_to_modify, user_details["user_email"]
                    ):
                        self.append_to_errors(
                            self._(
                                "This email address already belongs to another account"
                            )
                        )
                    else:
                        if "user_super" in user_details.keys():
                            user_details["user_super"] = 1
                        else:
                            user_details["user_super"] = 0

                        if "user_active" in user_details.keys():
                            user_details["user_active"] = 1
                        else:
                            user_details["user_active"] = 0

                        if user_data["user_apikey"] != user_details["user_apikey"]:
                            log.warning(
                                "Administrator {} changed the API key of user {} from {} to {}".format(
                                    self.userID,
                                    user_to_modify,
                                    user_data["user_apikey"],
                                    user_details["user_apikey"],
                                )
                            )

                        res, message = update_profile(
                            self.request, user_to_modify, user_details
                        )
                        if res:

                            self.request.session.flash(
                                self._("The user has been updated")
                            )
                            self.returnRawViewResult = True
                            return HTTPFound(
                                location=self.request.route_url("user_list")
                            )
                        else:
                            self.append_to_errors(message)

            if "changepass" in user_details.keys():
                action = "changepass"
                if user_details["user_password"] != "":
                    if user_details["user_password"] == user_details["user_password2"]:
                        encoded_password = encode_data(
                            self.request, user_details["user_password"]
                        )
                        updated, message = update_password(
                            self.request, user_to_modify, encoded_password
                        )
                        if updated:
                            log.warning(
                                "Tha administrator user {} changed the password for user {}".format(
                                    self.userID, user_to_modify
                                )
                            )
                            self.returnRawViewResult = True
                            self.request.session.flash(
                                self._(
                                    "The password for {} was modified".format(
                                        user_data["user_name"]
                                    )
                                )
                            )
                            return HTTPFound(
                                location=self.request.route_url("user_list")
                            )
                        else:
                            self.append_to_errors(message)
                    else:
                        self.append_to_errors(
                            self._("The password and its confirmation are not the same")
                        )
                else:
                    self.append_to_errors(self._("The password cannot be empty"))
        else:
            action = None
        return {"userid": self.userID, "userData": user_data, "action": action}
