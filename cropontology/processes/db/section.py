import datetime

from ...models import Section, map_to_schema, map_from_schema, UserSection, User
from sqlalchemy.exc import IntegrityError
import logging

log = logging.getLogger("cropontology")

__all__ = [
    "add_new_section",
    "get_section_data",
    "update_section",
    "get_all_sections",
    "delete_section",
    "get_section_users",
    "add_user_to_section",
    "remove_user_from_section",
    "user_admin_section",
]


def add_new_section(request, section_data):
    _ = request.translate
    mapped_data = map_to_schema(Section, section_data)
    new_user = Section(**mapped_data)
    try:
        request.dbsession.add(new_user)
        request.dbsession.flush()
        return True, ""
    except IntegrityError:
        request.dbsession.rollback()
        log.error("Duplicated section {}".format(mapped_data["section_id"]))
        return False, _("Section is already taken")
    except Exception as e:
        request.dbsession.rollback()
        log.error(
            "Error {} when inserting section {}".format(
                str(e), mapped_data["section_id"]
            )
        )
        return False, str(e)


def get_section_data(request, section_id):
    res = (
        request.dbsession.query(Section)
        .filter(Section.section_id == section_id)
        .first()
    )
    if res is not None:
        return map_from_schema(res)
    else:
        return None


def user_admin_section(request, section_id, user_id):
    res = (
        request.dbsession.query(UserSection)
        .filter(UserSection.section_id == section_id)
        .filter(UserSection.user_id == user_id)
        .first()
    )
    if res is not None:
        return True
    else:
        return False


def add_user_to_section(request, section_id, user_id):
    _ = request.translate
    new_user = UserSection(
        user_id=user_id, section_id=section_id, access_date=datetime.datetime.now()
    )
    try:
        request.dbsession.add(new_user)
        request.dbsession.flush()
        return True, ""
    except IntegrityError:
        request.dbsession.rollback()
        log.error("Duplicated manager {} for section {}".format(user_id, section_id))
        return False, _("The manager already belongs to this section")
    except Exception as e:
        request.dbsession.rollback()
        log.error(
            "Error {} when inserting section user {} in section {}".format(
                str(e), user_id, section_id
            )
        )
        return False, str(e)


def remove_user_from_section(request, section_id, user_id):
    request.dbsession.query(UserSection).filter(
        UserSection.section_id == section_id
    ).filter(UserSection.user_id == user_id).delete()


def get_section_users(request, section_id):
    res = (
        request.dbsession.query(User.user_id, User.user_name, UserSection.access_date)
        .filter(User.user_id == UserSection.user_id)
        .filter(UserSection.section_id == section_id)
        .order_by(UserSection.access_date.asc())
        .all()
    )
    if res is not None:
        return map_from_schema(res)
    else:
        return []


def update_section(request, section_id, section_data):
    mapped_data = map_to_schema(Section, section_data)
    request.dbsession.query(Section).filter(Section.section_id == section_id).update(
        mapped_data
    )


def delete_section(request, section_id):
    request.dbsession.query(Section).filter(Section.section_id == section_id).delete()


def get_all_sections(request, order_by="desc", for_user=None):
    if for_user is None:
        if order_by == "desc":
            res = (
                request.dbsession.query(Section)
                .order_by(Section.section_desc.asc())
                .all()
            )
        else:
            if order_by == "id":
                res = (
                    request.dbsession.query(Section)
                    .order_by(Section.section_id.asc())
                    .all()
                )
            else:
                if order_by == "date":
                    res = (
                        request.dbsession.query(Section)
                        .order_by(Section.section_lastupdate.asc())
                        .all()
                    )
                else:
                    res = (
                        request.dbsession.query(Section)
                        .order_by(Section.section_desc.asc())
                        .all()
                    )
        if res is not None:
            return map_from_schema(res)
        else:
            return None
    else:
        sub_stmt = request.dbsession.query(UserSection.section_id).filter(
            UserSection.user_id == for_user
        )
        if order_by == "desc":
            res = (
                request.dbsession.query(Section)
                .filter(Section.section_id.in_(sub_stmt))
                .order_by(Section.section_desc.asc())
                .all()
            )
        else:
            if order_by == "id":
                res = (
                    request.dbsession.query(Section)
                    .filter(Section.section_id.in_(sub_stmt))
                    .order_by(Section.section_id.asc())
                    .all()
                )
            else:
                if order_by == "date":
                    res = (
                        request.dbsession.query(Section)
                        .filter(Section.section_id.in_(sub_stmt))
                        .order_by(Section.section_lastupdate.asc())
                        .all()
                    )
                else:
                    res = (
                        request.dbsession.query(Section)
                        .filter(Section.section_id.in_(sub_stmt))
                        .order_by(Section.section_desc.asc())
                        .all()
                    )
        if res is not None:
            return map_from_schema(res)
        else:
            return None
