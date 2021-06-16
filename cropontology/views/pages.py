from cropontology.views.classes import PrivateView, PublicView
from cropontology.processes.db import (
    add_new_page,
    get_page_data,
    update_page,
    get_all_pages,
    delete_page,
)
import re
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
import os
import uuid
import shutil
import mimetypes
import datetime
from pyramid.response import FileResponse


class PageListView(PrivateView):
    def process_view(self):
        list_order = self.request.params.get("order", "desc")
        pages = get_all_pages(self.request, list_order)
        return {"pages": pages}


class PageAddView(PrivateView):
    def process_view(self):
        form_data = {}
        if self.request.method == "POST":
            form_data = self.get_post_dict()
            if form_data.get("page_id", None) is not None:
                if re.match(r"^[A-Za-z0-9_]+$", form_data.get("page_id")):
                    if form_data.get("page_desc", None) is not None:
                        form_data["page_lastupdate"] = datetime.datetime.now()
                        added, message = add_new_page(self.request, form_data)
                        if not added:
                            self.append_to_errors(message)
                        else:
                            self.returnRawViewResult = True
                            return HTTPFound(
                                location=self.request.route_url(
                                    "page_edit", pageid=form_data.get("page_id")
                                )
                            )
                    else:
                        self.append_to_errors(
                            self._("The page description cannot be empty")
                        )
                else:
                    self.append_to_errors(self._("The page ID has invalid characters"))
            else:
                self.append_to_errors(self._("The page ID cannot be empty"))

        return {"form_data": form_data}


class PageEditView(PrivateView):
    def process_view(self):
        page_id = self.request.matchdict["pageid"]
        if self.request.method == "GET":
            form_data = get_page_data(self.request, page_id)
            if form_data is None:
                raise HTTPNotFound()
        else:
            form_data = self.get_post_dict()
            form_data["page_lastupdate"] = datetime.datetime.now()
            update_page(self.request, page_id, form_data)

        return {"form_data": form_data, "pageid": page_id}


class PageDeleteView(PrivateView):
    def process_view(self):
        page_id = self.request.matchdict["pageid"]
        if self.request.method == "GET":
            raise HTTPNotFound()
        else:
            delete_page(self.request, page_id)

            self.returnRawViewResult = True
            return HTTPFound(location=self.request.route_url("page_list"))


class ViewPageView(PublicView):
    def process_view(self):
        page_id = self.request.matchdict["pageid"]
        form_data = get_page_data(self.request, page_id)
        if form_data is None:
            raise HTTPNotFound()

        return {"pageid": page_id, "pagedesc": form_data["page_desc"]}


class PageUploadImageView(PrivateView):
    def __init__(self, request):
        PrivateView.__init__(self, request)
        self.checkCRF = False

    def process_view(self):
        self.checkCRF = False
        self.returnRawViewResult = True

        uid = str(uuid.uuid4())
        input_file = self.request.POST["upload"].file
        input_file_name = self.request.POST["upload"].filename.lower()
        name, extension = os.path.splitext(input_file_name)
        repository_path = self.request.registry.settings.get("repository.path")

        paths = [repository_path, "upload"]
        upload_path = os.path.join(repository_path, *paths)
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)

        paths = [repository_path, "upload", uid + extension]
        target_file = os.path.join(repository_path, *paths)
        input_file.seek(0)
        with open(target_file, "wb") as permanent_file:
            shutil.copyfileobj(input_file, permanent_file)
        return {
            "uploaded": 1,
            "url": self.request.route_url(
                "page_image_request", imageid=uid + extension
            ),
        }

    #     return {
    # "uploaded": 0,
    # "error": {
    #     "message": "The file is far too big!"
    # }


class PageGetImageView(PublicView):
    def process_view(self):
        image_id = self.request.matchdict["imageid"]
        repository_path = self.request.registry.settings.get("repository.path")
        paths = [repository_path, "upload", image_id]

        file_path = os.path.join(repository_path, *paths)
        content_type, content_enc = mimetypes.guess_type(file_path)
        response = FileResponse(
            file_path, request=self.request, content_type=content_type
        )
        self.returnRawViewResult = True
        return response
