import datetime
import logging

import validators
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from ...models import (
    map_to_schema,
    User,
    map_from_schema,
)

__all__ = [
    "register_user",
    "user_exists",
    "get_user_details",
    "update_profile",
    "get_user_name",
    "get_user_by_api_key",
    "update_password",
    "email_exists",
    "update_last_login",
    "get_user_id_with_email",
    "get_users",
    "query_users",
    "get_user_by_user_id"
]

log = logging.getLogger("cropontology")


def register_user(request, user_data):
    _ = request.translate
    user_data.pop("user_password2", None)
    mapped_data = map_to_schema(User, user_data)
    email_valid = validators.email(mapped_data["user_email"])
    if email_valid:
        res = (
            request.dbsession.query(User)
            .filter(User.user_email == mapped_data["user_email"])
            .first()
        )
        if res is None:
            new_user = User(**mapped_data)
            try:
                request.dbsession.add(new_user)
                request.dbsession.flush()
                return True, ""
            except IntegrityError:
                request.dbsession.rollback()
                log.error("Duplicated user {}".format(mapped_data["user_id"]))
                return False, _("Username is already taken")
            except Exception as e:
                request.dbsession.rollback()
                log.error(
                    "Error {} when inserting user {}".format(
                        str(e), mapped_data["user_id"]
                    )
                )
                return False, str(e)
        else:
            log.error("Duplicated user with email {}".format(mapped_data["user_email"]))
            return False, _("Email is invalid")
    else:
        log.error("Email {} is not valid".format(mapped_data["user_email"]))
        return False, _("Email is invalid")


def user_exists(request, user, just_active=True):
    if just_active:
        res = (
            request.dbsession.query(User)
            .filter(User.user_id == user)
            .filter(User.user_active == 1)
            .first()
        )
    else:
        res = request.dbsession.query(User).filter(User.user_id == user).first()
    if res is None:
        return False
    return True


def get_users(request):
    res = request.dbsession.query(User).all()
    res = map_from_schema(res)
    return res


def get_user_details(request, user, just_active=True):
    if just_active:
        res = (
            request.dbsession.query(User)
            .filter(User.user_id == user)
            .filter(User.user_active == 1)
            .first()
        )
    else:
        res = request.dbsession.query(User).filter(User.user_id == user).first()
    if res is not None:
        result = map_from_schema(res)
        return result
    return {}


def email_exists(request, user, email):
    res = (
        request.dbsession.query(User)
        .filter(User.user_id != user)
        .filter(func.lower(User.user_email) == func.lower(email))
        .first()
    )
    if res is None:
        return False
    else:
        return True


def get_user_name(request, user):
    res = (
        request.dbsession.query(User)
        .filter(User.user_id == user)
        .filter(User.user_active == 1)
        .first()
    )
    if res is not None:
        return res.user_name
    else:
        return None


def get_user_id_with_email(request, email):
    res = (
        request.dbsession.query(User)
        .filter(func.lower(User.user_email) == func.lower(email))
        .filter(User.user_active == 1)
        .first()
    )
    if res is not None:
        return res.user_id
    else:
        return None


def get_user_by_user_id(request, user_id):
    res = (
        request.dbsession.query(User)
        .filter(User.user_id == user_id)
        .filter(User.user_active == 1)
        .first()
    )
    if res is not None:
        return res
    else:
        return None


def update_profile(request, user, profile_data):
    mapped_data = map_to_schema(User, profile_data)
    try:
        request.dbsession.query(User).filter(User.user_id == user).update(mapped_data)
        request.dbsession.flush()
        return True, ""
    except Exception as e:
        request.dbsession.rollback()
        log.error("Error {} when updating user {}".format(str(e), user))
        return False, str(e)


def update_last_login(request, user):
    try:
        request.dbsession.query(User).filter(User.user_id == user).update(
            {"user_llogin": datetime.datetime.now()}
        )
        request.dbsession.flush()
        return True, ""
    except Exception as e:
        request.dbsession.rollback()
        log.error("Error {} when updating last login for user {}".format(str(e), user))
        return False, str(e)


def get_user_by_api_key(request, api_key):
    res = (
        request.dbsession.query(User)
        .filter(User.user_apikey == api_key)
        .filter(User.user_active == 1)
        .first()
    )
    if res is not None:
        result = map_from_schema(res)
        return result
    return None


def update_password(request, user, password):
    try:
        request.dbsession.query(User).filter(User.user_id == user).update(
            {"user_password": password}
        )
        request.dbsession.flush()
        return True, ""
    except Exception as e:
        request.dbsession.rollback()
        log.error("Error {} when changing password for user {}".format(str(e), user))
        return False, str(e)


def query_users(request, q, start, size):
    sql = "SELECT COUNT(user_id) " "FROM user WHERE UPPER(CONCAT(user_id,'|',user_name,'|',user_email)) LIKE '%{}%'".format(
        q.upper()
    ) + " LIMIT {} OFFSET {}".format(
        size, start
    )
    res = request.dbsession.execute(sql).fetchone()
    total = res[0]

    if total > 0:
        sql = "SELECT user_id,user_name,user_email " "FROM user WHERE UPPER(CONCAT(user_id,'|',user_name,'|',user_email)) LIKE '%{}%'".format(
            q.upper()
        ) + " ORDER BY user_name LIMIT {} OFFSET {}".format(
            size, start
        )
        users = request.dbsession.execute(sql).fetchall()
        return users, total
    else:
        return [], 0
