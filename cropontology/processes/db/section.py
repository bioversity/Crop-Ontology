from ...models import Section, map_to_schema, map_from_schema
from sqlalchemy.exc import IntegrityError
import logging

log = logging.getLogger("cropontology")

__all__ = [
    "add_new_section",
    "get_section_data",
    "update_section",
    "get_all_sections",
    "delete_section",
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


def update_section(request, section_id, section_data):
    mapped_data = map_to_schema(Section, section_data)
    request.dbsession.query(Section).filter(Section.section_id == section_id).update(
        mapped_data
    )


def delete_section(request, section_id):
    request.dbsession.query(Section).filter(Section.section_id == section_id).delete()


def get_all_sections(request):
    res = request.dbsession.query(Section).all()
    if res is not None:
        return map_from_schema(res)
    else:
        return None
