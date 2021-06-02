from cropontology.views.classes import PrivateView
from cropontology.processes.db.section import (
    add_new_section,
    get_section_data,
    update_section,
    get_all_sections,
    delete_section,
)
import re
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
import os
import uuid
import shutil
import mimetypes
import datetime
from pyramid.response import FileResponse


class SectionListView(PrivateView):
    def process_view(self):
        sections = get_all_sections(self.request)
        return {"sections": sections}


class SectionAddView(PrivateView):
    def process_view(self):
        form_data = {}
        if self.request.method == "POST":
            form_data = self.get_post_dict()
            if form_data.get("section_id", None) is not None:
                if re.match(r"^[A-Za-z0-9_]+$", form_data.get("section_id")):
                    if form_data.get("section_desc", None) is not None:
                        form_data["section_lastupdate"] = datetime.datetime.now()
                        added, message = add_new_section(self.request, form_data)
                        if not added:
                            self.append_to_errors(message)
                        else:
                            self.returnRawViewResult = True
                            return HTTPFound(
                                location=self.request.route_url(
                                    "section_edit",
                                    sectionid=form_data.get("section_id"),
                                )
                            )
                    else:
                        self.append_to_errors(
                            self._("The section description cannot be empty")
                        )
                else:
                    self.append_to_errors(
                        self._("The section ID has invalid characters")
                    )
            else:
                self.append_to_errors(self._("The section ID cannot be empty"))

        return {"form_data": form_data}


class SectionEditView(PrivateView):
    def process_view(self):
        section_id = self.request.matchdict["sectionid"]
        if self.request.method == "GET":
            form_data = get_section_data(self.request, section_id)
            if form_data is None:
                raise HTTPNotFound()
        else:
            form_data = self.get_post_dict()
            form_data["section_lastupdate"] = datetime.datetime.now()
            update_section(self.request, section_id, form_data)

        return {"form_data": form_data, "sectionid": section_id}


class SectionDeleteView(PrivateView):
    def process_view(self):
        self.returnRawViewResult = True
        self.checkCrossPost = False
        section_id = self.request.matchdict["sectionid"]
        if self.request.method == "GET":
            raise HTTPNotFound()
        else:
            form_data = get_section_data(self.request, section_id)
            if form_data is None:
                raise HTTPNotFound()
            try:
                delete_section(self.request, section_id)
            except Exception as e:
                self.append_to_errors("Unable to delete section: {}".format(str(e)))

            return HTTPFound(
                location=self.request.route_url(
                    "section_list",
                )
            )


class SectionUploadImageView(PrivateView):
    def __init__(self, request):
        PrivateView.__init__(self, request)
        self.checkCRF = False

    def process_view(self):
        self.returnRawViewResult = True
        section_id = self.request.matchdict["sectionid"]

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
            "uploaded": True,
            "url": self.request.route_url(
                "section_image_request", sectionid=section_id, imageid=uid + extension
            ),
        }


class SectionGetImageView(PrivateView):
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
