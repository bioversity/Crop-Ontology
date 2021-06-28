from cropontology.views.classes import PrivateView
from cropontology.processes.db.section import (
    add_new_section,
    get_section_data,
    update_section,
    get_all_sections,
    delete_section,
    get_section_users,
    add_user_to_section,
    remove_user_from_section,
    user_admin_section,
)
import re
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
import os
import uuid
import shutil
import mimetypes
import datetime
import pymongo
from pyramid.response import FileResponse


class SectionListView(PrivateView):
    def process_view(self):
        list_order = self.request.params.get("order", "desc")
        if self.user.super == 1:
            sections = get_all_sections(self.request, list_order)
        else:
            sections = get_all_sections(self.request, list_order, self.userID)
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
        if self.user.super == 0:
            if not user_admin_section(self.request, section_id, self.userID):
                raise HTTPNotFound()

        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        ontology_collection = ontology_db["ontologies"]
        for_ontology = False
        ontology_data = ontology_collection.find_one({"ontology_id": section_id})
        ontology_desc = ""
        if ontology_data:
            for_ontology = True
            if "ontology_summary" in ontology_data.keys():
                ontology_desc = ontology_data["ontology_summary"]

        if self.request.method == "GET":
            form_data = get_section_data(self.request, section_id)
            if form_data is None:
                raise HTTPNotFound()
        else:
            form_data = self.get_post_dict()
            update_ontology = False
            if "ontology_desc" in form_data.keys():
                ontology_desc = form_data["ontology_desc"]
                form_data.pop("ontology_desc", None)
                update_ontology = True

            form_data["section_lastupdate"] = datetime.datetime.now()
            update_section(self.request, section_id, form_data)

            if update_ontology:
                ontology_collection.update_one(
                    {"ontology_id": section_id},
                    {"$set": {"ontology_summary": ontology_desc}},
                )

        return {
            "form_data": form_data,
            "sectionid": section_id,
            "for_ontology": for_ontology,
            "ontology_desc": ontology_desc,
        }


class SectionUsersView(PrivateView):
    def process_view(self):
        section_id = self.request.matchdict["sectionid"]
        if self.request.method == "GET":
            users = get_section_users(self.request, section_id)
        else:
            new_user_data = self.get_post_dict()
            added, message = add_user_to_section(
                self.request, section_id, new_user_data["user"]
            )
            if not added:
                self.append_to_errors(message)
            else:
                self.returnRawViewResult = True
                return HTTPFound(
                    location=self.request.route_url(
                        "section_users",
                        sectionid=section_id,
                    )
                )
            users = get_section_users(self.request, section_id)
        form_data = get_section_data(self.request, section_id)
        if form_data is None:
            raise HTTPNotFound()
        return {"section_users": users, "sectionid": section_id, "form_data": form_data}


class SectionRemoveUserView(PrivateView):
    def process_view(self):
        self.returnRawViewResult = True
        self.checkCrossPost = False
        section_id = self.request.matchdict["sectionid"]
        user_id = self.request.matchdict["userid"]
        if self.request.method == "GET":
            raise HTTPNotFound()
        else:
            try:
                remove_user_from_section(self.request, section_id, user_id)
            except Exception as e:
                self.append_to_errors("Unable to delete section: {}".format(str(e)))

            return HTTPFound(
                location=self.request.route_url(
                    "section_users",
                    sectionid=section_id,
                )
            )


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
