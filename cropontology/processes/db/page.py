from ...models import Page, map_to_schema, map_from_schema
from sqlalchemy.exc import IntegrityError
import logging

log = logging.getLogger("cropontology")

__all__ = [
    "add_new_page",
    "get_page_data",
    "update_page",
    "get_all_pages",
    "delete_page",
]


def add_new_page(request, page_data):
    _ = request.translate
    mapped_data = map_to_schema(Page, page_data)
    new_user = Page(**mapped_data)
    try:
        request.dbsession.add(new_user)
        request.dbsession.flush()
        return True, ""
    except IntegrityError:
        request.dbsession.rollback()
        log.error("Duplicated page {}".format(mapped_data["page_id"]))
        return False, _("Page is already taken")
    except Exception as e:
        request.dbsession.rollback()
        log.error(
            "Error {} when inserting page {}".format(str(e), mapped_data["page_id"])
        )
        return False, str(e)


def get_page_data(request, page_id):
    res = request.dbsession.query(Page).filter(Page.page_id == page_id).first()
    if res is not None:
        return map_from_schema(res)
    else:
        return None


def update_page(request, page_id, page_data):
    mapped_data = map_to_schema(Page, page_data)
    request.dbsession.query(Page).filter(Page.page_id == page_id).update(mapped_data)


def delete_page(request, page_id):
    request.dbsession.query(Page).filter(Page.page_id == page_id).delete()


def get_all_pages(request, order_by="desc"):
    if order_by == "desc":
        res = request.dbsession.query(Page).order_by(Page.page_desc.asc()).all()
    else:
        if order_by == "id":
            res = request.dbsession.query(Page).order_by(Page.page_id.asc()).all()
        else:
            if order_by == "date":
                res = (
                    request.dbsession.query(Page)
                    .order_by(Page.page_lastupdate.asc())
                    .all()
                )
            else:
                res = (
                    request.dbsession.query(Page)
                    .order_by(Page.page_lastupdate.asc())
                    .all()
                )
    if res is not None:
        return map_from_schema(res)
    else:
        return None