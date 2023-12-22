import datetime
import uuid
from collections import OrderedDict

from cropontology.processes.db.user import get_user_by_user_id
from cropontology.views.public_views import render_template
from jinja2 import ext

from cropontology.config.jinja_extensions import jinjaEnv, extendThis
from cropontology.plugins.helpers import readble_date

from cropontology.views.classes import PublicView, PrivateView, SendEmailMixin, OntologyManageAccessUtilsMixin, \
    RevisionStatusChangeEmailMixin
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
from neo4j import GraphDatabase
import pymongo
import os
import json
from webhelpers2.html import literal
from cropontology.models import OntologyManageAccess, User
from cropontology.processes.revision.diff import generate_diff
from cropontology.processes.elasticsearch.term_index import get_term_index_manager
import logging

log = logging.getLogger("cropontology")


class TermDetailsView(PublicView):
    def process_view(self):
        term_id = self.request.matchdict["termid"]
        with_tree = self.request.params.get("with_tree", "True")
        if with_tree == "True":
            with_tree = True
        else:
            with_tree = False
        index_manager = get_term_index_manager(self.request)

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        query = "MATCH (node {id: '" + term_id + "'}) return node.term_type"
        cursor = db.run(query)
        term_type = ""
        for an_item in cursor:
            term_type = an_item["node.term_type"]
            break
        is_variable = False
        variable_parents = {}
        if term_type == "variable":
            is_variable = True
            query = (
                "match (variable:Variable{id:'"
                + term_id
                + "'})-[:VARIABLE_OF]->(trait:Trait) "
                "match (variable:Variable{id:'"
                + term_id
                + "'})-[:VARIABLE_OF]->(method:Method) "
                "match (variable:Variable{id:'"
                + term_id
                + "'})-[:VARIABLE_OF]->(scale:Scale) "
                "return trait.id, trait.name, method.id, method.name, scale.id, scale.name"
            )
            cursor = db.run(query)
            for an_item in cursor:
                variable_parents["trait_id"] = an_item["trait.id"]
                variable_parents["trait_name"] = an_item["trait.name"]
                variable_parents["method_id"] = an_item["method.id"]
                variable_parents["method_name"] = an_item["method.name"]
                variable_parents["scale_id"] = an_item["scale.id"]
                variable_parents["scale_name"] = an_item["scale.name"]
                break

        query = (
            'Match (trait {id:"'
            + term_id
            + '"})<-[:VARIABLE_OF]-(op {term_type: "variable"}) '
            'WHERE (op.is_obsolete <> "true" OR op.is_obsolete is null) return distinct op.id, op.name'
        )
        cursor = db.run(query)
        variables = []
        for an_item in cursor:
            variables.append({"id": an_item["op.id"], "name": an_item["op.name"]})

        es_query = {"query": {"match_phrase": {"term_id": term_id}}}
        res, hits = index_manager.free_query(es_query)
        if hits == 0:
            print("****************************1111")
            print("Not hits for {}".format(term_id))
            print("****************************1111")
            raise HTTPNotFound()
        results = []
        ontology_id = None
        for key, value in res["hits"]["hits"][0]["_source"].items():
            if key == "ontology_id":
                ontology_id = value
            results.append({"key": key, "value": value})

        ## sort results and don't keep all the keys
        if [r["value"] for r in results if r["key"] == "term_type"][0] == "Term":
            remove = ["obsolete", "name", "term_type"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = ["term_id", "ontology_id", "ontology_name", "language"]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "term":
            remove = ["obsolete", "root", "term_type"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = [
                "term_id",
                "name",
                "ontology_id",
                "ontology_name",
                "language",
                "created_at",
            ]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "trait":
            remove = ["obsolete", "root", "term_type", "name", "term_id", "ibfieldbook"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = [
                "trait_id",
                "trait_name",
                "ontology_id",
                "ontology_name",
                "trait_class",
                "trait_description",
                "trait_synonyms",
                "trait_synonym",
                "main_trait_abbreviation",
                "alternative_trait_abbreviations",
                "alternative_abbreviation",
                "entity",
                "attribute",
                "trait_status",
                "trait_xref",
                "language",
                "created_at",
            ]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "Trait":
            remove = ["obsolete", "root", "term_type", "name", "term_id", "ibfieldbook"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = [
                "trait_id",
                "trait_name",
                "ontology_id",
                "ontology_name",
                "trait_class",
                "trait_description",
                "trait_synonyms",
                "trait_synonym",
                "main_trait_abbreviation",
                "alternative_trait_abbreviations",
                "alternative_abbreviation",
                "entity",
                "attribute",
                "trait_status",
                "trait_xref",
                "language",
                "created_at",
            ]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "method":
            remove = ["obsolete", "root", "term_type", "name", "term_id"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = [
                "method_id",
                "method_name",
                "ontology_id",
                "ontology_name",
                "method_class",
                "method_description",
                "formula",
                "method_reference",
                "language",
                "created_at",
            ]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "Method":
            remove = ["obsolete", "root", "term_type", "name", "term_id"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = [
                "method_id",
                "method_name",
                "ontology_id",
                "ontology_name",
                "method_class",
                "method_description",
                "formula",
                "method_reference",
                "language",
                "created_at",
            ]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "scale":
            remove = ["obsolete", "root", "term_type", "name", "term_id"]
            results[:] = [r for r in results if r["key"] not in remove]
            categories = ["category_" + str(i) for i in range(1, 100)]
            sortItem = (
                [
                    "scale_id",
                    "scale_name",
                    "ontology_id",
                    "ontology_name",
                    "scale_class",
                    "decimal_places",
                    "lower_limit",
                    "upper_limit",
                    "scale_xref",
                ]
                + categories
                + ["language", "created_at"]
            )
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "Scale":
            remove = ["obsolete", "root", "term_type", "name", "term_id"]
            results[:] = [r for r in results if r["key"] not in remove]
            categories = ["category_" + str(i) for i in range(1, 100)]
            sortItem = (
                [
                    "scale_id",
                    "scale_name",
                    "ontology_id",
                    "ontology_name",
                    "scale_class",
                    "decimal_places",
                    "lower_limit",
                    "upper_limit",
                    "scale_xref",
                ]
                + categories
                + ["language", "created_at"]
            )
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "variable":
            remove = ["obsolete", "root", "term_type", "name", "term_id", "curation"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = [
                "variable_id",
                "variable_name",
                "variable_label",
                "ontology_id",
                "ontology_name",
                "variable_synonyms",
                "context_of_use",
                "growth_stage",
                "variable_status",
                "variable_xref",
                "institution",
                "scientist",
                "date",
                "crop",
                "language",
                "created_at",
            ]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))
        elif [r["value"] for r in results if r["key"] == "term_type"][0] == "Variable":
            remove = ["obsolete", "root", "term_type", "name", "term_id","curation"]
            results[:] = [r for r in results if r["key"] not in remove]
            sortItem = [
                "variable_id",
                "variable_name",
                "variable_label",
                "ontology_id",
                "ontology_name",
                "variable_synonyms",
                "context_of_use",
                "growth_stage",
                "variable_status",
                "variable_xref",
                "institution",
                "scientist",
                "date",
                "crop",
                "language",
                "created_at",
            ]
            results = sorted(results, key=lambda k: sortItem.index(k["key"]))

        ontology_name = ''
        if results:
            for item in results:
                if item.get('key') == 'ontology_name':
                    ontology_name = item.get('value')
                    break

        return {
            "results": results,
            "term_id": term_id,
            "ontology_name": ontology_name,
            "with_tree": with_tree,
            "variables": variables,
            "ontology_id": ontology_id,
            "is_variable": is_variable,
            "variable_parents": variable_parents,
        }


class TermEditorView(PrivateView, SendEmailMixin):

    def _send_email(self, text, email_to, subject, target):
        jinjaEnv.add_extension(ext.i18n)
        jinjaEnv.add_extension(extendThis)
        email_from = self.request.registry.settings.get("email.from", None)

        self.send_email(email_from, email_to, subject, text, target)

    def send_term_revisions_notification_email(self, email_to, user_name, ontology_name, id_label, review_url):
        reset_url = self.request.route_url("revisions")
        text = render_template(
            "email/term_revisions_notification_email.jinja2",
            {
                "revisions_url": reset_url,
                "_": self.request.translate,
                "ontology_name": ontology_name,
                "id_label": id_label,
                "review_url": review_url
            },
        )

        self._send_email(text, email_to, "Crop Ontology Helpdesk - New Revisions Request", user_name)

    def send_active_user_revision_notification_email(self, user_email, userID, ontology_name, id_label, review_url):
        text = render_template(
            "email/term_revision_submitter_notification.jinja2",
            {
                "_": self.request.translate,
                "ontology_name": ontology_name,
                "id_label": id_label,
                "review_url": review_url
            },
        )

        self._send_email(text, user_email, "Crop Ontology Helpdesk - New Revisions Submitted", userID)

    def send_notification_email(self, ontology_name, revision):
        termid = self.request.matchdict.get('termid').split(':')[0]

        emails_sent = []

        fields = [item['name'] for item in revision['data'] if 'new_value' in item]

        if len(fields) == 1:
            field = fields[0]
        else:
            field = ', '.join(fields)

        id_label = f'{revision["for_term"]} in ontology {ontology_name}: Fields ({field})'

        review_url = self.request.route_url("compare_revision", revisionid=revision['revision'])

        ontology_manager_access = self.request.dbsession.query(OntologyManageAccess).filter(
            OntologyManageAccess.ontology_id == termid).all()

        for ontology in ontology_manager_access:
            if ontology.user.user_email not in emails_sent:
                self.send_term_revisions_notification_email(ontology.user.user_email, ontology.user.user_name,
                                                            ontology_name, id_label, review_url)
                emails_sent.append(ontology.user.user_email)

        # notify all super_admins

        super_admins = self.request.dbsession.query(User).filter(
            User.user_super == "1").all()

        for sa in super_admins:
            if sa.user_email not in emails_sent:
                self.send_term_revisions_notification_email(sa.user_email, sa.user_name, ontology_name, id_label, review_url)
                emails_sent.append(sa.user_email)

        self.send_active_user_revision_notification_email(self.user.email, self.userID, ontology_name, id_label, review_url)

    def process_view(self):
        def set_key_settings(keys):
            for a_key in keys:
                if a_key["name"] == "term_type":
                    a_key["type"] = "options"
                    a_key["options"].append({"code": "term", "desc": "Term"})
                    a_key["options"].append({"code": "trait", "desc": "Trait"})
                    a_key["options"].append({"code": "method", "desc": "Method"})
                    a_key["options"].append({"code": "scale", "desc": "Scale"})
                    a_key["options"].append({"code": "variable", "desc": "Variable"})
                if a_key["name"] == "ontology_id" or a_key["name"] == "ontology_name":
                    a_key["read_only"] = True
                if (
                    a_key["name"] == "id"
                    or a_key["name"] == "root"
                    or a_key["name"] == "created_at"
                ):
                    a_key["read_only"] = True
                if a_key["name"] == "obsolete":
                    a_key["type"] = "options"
                    a_key["value"] = str(a_key["value"])
                    a_key["options"].append({"code": "True", "desc": "True"})
                    a_key["options"].append({"code": "False", "desc": "False"})

        term_id = self.request.matchdict["termid"]
        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        query = "MATCH (n) WHERE n.id='" + term_id + "' RETURN keys(n) as key_name"
        cursor = db.run(query)
        keys = []
        fields = []
        for a_row in cursor:
            for an_item in a_row["key_name"]:
                keys.append(
                    {
                        "name": an_item,
                        "desc": "",
                        "read_only": False,
                        "type": "text",
                        "options": [],
                    }
                )
                fields.append("n." + an_item)
        query = "MATCH (n) WHERE n.id='" + term_id + "' RETURN " + ",".join(fields)
        cursor = db.run(query)
        ontology_id = ""
        for an_item in cursor:
            for a_key in keys:
                a_key["value"] = an_item["n." + a_key["name"]]
                if a_key["name"] == "ontology_id":
                    ontology_id = a_key["value"]
        if self.request.method == "GET":
            set_key_settings(keys)
            return {"keys": keys}
        else:
            form_data = self.get_post_dict()
            revision_notes = form_data.get("revision_notes", None)
            if revision_notes is not None:
                form_data.pop("revision_notes", None)
            data_changed = False
            for a_field in form_data.keys():
                for a_key in keys:
                    if a_key["name"] == a_field:
                        if a_key["value"] != form_data[a_field]:
                            a_key["new_value"] = form_data[a_field]
                            data_changed = True
                        break
            if data_changed:
                mongo_url = self.request.registry.settings.get("mongo.url")
                mongo_client = pymongo.MongoClient(mongo_url)
                ontology_db = mongo_client["ontologies"]
                revisions_collection = ontology_db["revisions"]
                ontology_collection = ontology_db["ontologies"]
                ontology_data = ontology_collection.find_one(
                    {"ontology_id": ontology_id}
                )
                ontology_name = ""
                if ontology_data:
                    ontology_name = ontology_data["ontology_name"]
                revision = {
                    "revision": str(uuid.uuid4()),
                    "for_term": term_id,
                    "ontology_id": ontology_id,
                    "ontology_name": ontology_name,
                    "created_on": datetime.datetime.now(),
                    "created_by": self.userID,
                    "status": 0,
                    "reviewed_by": None,
                    "reviewed_on": None,
                    "error_message": None,
                    "revision_notes": revision_notes,
                    "review_notes": None,
                    "data": keys,
                }

                revisions_collection.insert_one(revision)
                self.send_notification_email(ontology_name, revision)
                self.returnRawViewResult = True
                return HTTPFound(location=self.request.route_url("term_details", termid=term_id))
            else:
                self.errors.append(self._("Nothing to change"))
                set_key_settings(keys)
                return {"keys": keys, "revision_notes": ""}


class TermRevisionListView(PrivateView, OntologyManageAccessUtilsMixin):

    def process_view(self):
        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        revisions_collection = ontology_db["revisions"]

        status = self.request.params.get("status", None)
        user_to_query = self.request.params.get("user", None)
        if status is None:
            session = self.request.session
            if "clean_status" in session:
                status = session["clean_status"]
            else:
                status = "all"
                session["clean_status"] = "all"
        status_code = None
        if status == "pending":
            status_code = 0
        if status == "approved":
            status_code = 1
        if status == "rejected":
            status_code = -1
        if status == "disregarded":
            status_code = 2
        if status == "error":
            status_code = -2

        revision_query = {}

        if status_code is not None:
            revision_query["status"] = status_code

        if self.user.super == 0:
            ontologies_manager_access = self.get_manager_access(self.userID)
            revision_query = {"$and": [revision_query, {"ontology_id": {'$in': ontologies_manager_access}}]}
        else:
            if user_to_query is not None:
                revision_query["created_by"] = user_to_query

        revisions = revisions_collection.find(revision_query).sort("created_on", -1)
        return {"revisions": revisions, "status": status}


class CompareRevisionView(PrivateView):
    def process_view(self):
        revision_id = self.request.matchdict["revisionid"]
        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        revisions_collection = ontology_db["revisions"]
        revision_data = revisions_collection.find_one({"revision": revision_id})
        if revision_data is None:
            raise HTTPNotFound()
        else:
            revision_date = revision_data["created_on"]
            term_id = revision_data["for_term"]
            if "ontology_name" in revision_data.keys():
                ontology_name = revision_data["ontology_name"]
            else:
                ontology_name = ""
            revision_by = revision_data["created_by"]
            revision_notes = revision_data["revision_notes"]
            data_a = OrderedDict()
            data_b = OrderedDict()
            for a_field in revision_data["data"]:
                data_a[a_field["name"]] = a_field["value"]
                if a_field.get("new_value", None) is None:
                    data_b[a_field["name"]] = a_field["value"]
                else:
                    data_b[a_field["name"]] = a_field["new_value"]

            repository_path = self.request.registry.settings.get("repository.path")
            paths = ["revision", revision_id]
            revision_path = os.path.join(repository_path, *paths)
            if not os.path.exists(revision_path):
                os.makedirs(revision_path)

            file_a = os.path.join(revision_path, *["file_a.json"])
            file_b = os.path.join(revision_path, *["file_b.json"])
            with open(file_a, "w") as f:
                f.write(json.dumps(data_a, indent=4, default=str))

            with open(file_b, "w") as f:
                f.write(json.dumps(data_b, indent=4, default=str))

            error, diff = generate_diff(self.request, revision_id, file_b, file_a)
            if error != 0:
                diff = None
            else:
                diff = literal(diff)

            return {
                "revision_id": revision_id,
                "revision_date": revision_date,
                "revision_by": revision_by,
                "diff": diff,
                "revision_notes": revision_notes,
                "term_id": term_id,
                "ontology_name": ontology_name,
            }


class DisregardRevisionView(PrivateView, RevisionStatusChangeEmailMixin):

    def process_view(self):
        revision_id = self.request.matchdict["revisionid"]
        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        revisions_collection = ontology_db["revisions"]
        revision_data = revisions_collection.find_one({"revision": revision_id})
        if revision_data is None:
            raise HTTPNotFound()
        else:
            revision_query = {"revision": revision_id}
            new_status = {"$set": {"status": 2}}
            revisions_collection.update_one(revision_query, new_status)
            self.returnRawViewResult = True
            created_by = revision_data.get('created_by')
            self.send_revision_status_update_email(created_by, 'Disregarded', revision_data)

            return HTTPFound(location=self.request.route_url("revisions"))


class RejectRevisionView(PrivateView, RevisionStatusChangeEmailMixin):
    def process_view(self):
        revision_id = self.request.matchdict["revisionid"]
        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        revisions_collection = ontology_db["revisions"]
        revision_data = revisions_collection.find_one({"revision": revision_id})
        if revision_data is None:
            raise HTTPNotFound()
        else:
            revision_query = {"revision": revision_id}
            new_status = {
                "$set": {
                    "status": -1,
                    "reviewed_by": self.userID,
                    "reviewed_on": datetime.datetime.now(),
                }
            }
            revisions_collection.update_one(revision_query, new_status)
            self.returnRawViewResult = True
            created_by = revision_data.get('created_by')
            self.send_revision_status_update_email(created_by, 'Rejected', revision_data)

            return HTTPFound(location=self.request.route_url("revisions"))


class ApproveRevisionView(PrivateView, RevisionStatusChangeEmailMixin):
    def process_view(self):
        revision_id = self.request.matchdict["revisionid"]
        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        revisions_collection = ontology_db["revisions"]
        revision_data = revisions_collection.find_one({"revision": revision_id})
        if revision_data is None:
            raise HTTPNotFound()
        else:
            revision_query = {"revision": revision_id}
            new_status = {
                "$set": {
                    "status": 1,
                    "reviewed_by": self.userID,
                    "reviewed_on": datetime.datetime.now(),
                }
            }

            new_es_data = {}
            new_neo_data = []
            old_es_data = {}
            old_neo_data = []
            for a_field in revision_data["data"]:
                if a_field.get("new_value", None) is not None:
                    if a_field["value"] != a_field["new_value"]:
                        new_es_data[a_field["name"]] = a_field["new_value"]
                        old_es_data[a_field["name"]] = a_field["value"]
                        new_neo_data.append(
                            {"name": a_field["name"], "value": a_field["new_value"]}
                        )
                        old_neo_data.append(
                            {"name": a_field["name"], "value": a_field["value"]}
                        )

            error_message = ""
            es_updated = False
            index_manager = get_term_index_manager(self.request)
            term_id = revision_data["for_term"]
            try:
                index_manager.update_term(term_id, new_es_data)
                es_updated = True
            except Exception as e:
                error_message = "Error {} while updating term {} in ES".format(
                    str(e), term_id
                )
                log.error(error_message)
                self.errors.append(error_message)

            neo4j_updated = False
            if es_updated:
                neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
                neo4j_user = self.request.registry.settings["neo4j.user"]
                neo4j_password = self.request.registry.settings["neo4j.password"]
                driver = GraphDatabase.driver(
                    neo4j_bolt_url, auth=(neo4j_user, neo4j_password)
                )
                db = driver.session()
                for a_change in new_neo_data:
                    neo_query = (
                        "MATCH (t {id: '" + term_id + "'}) "
                        "SET t."
                        + a_change["name"]
                        + " = '"
                        + a_change["value"]
                        + "' RETURN t"
                    )
                    try:
                        db.run(neo_query)
                        neo4j_updated = True
                    except Exception as e:
                        error_message = "Error {} while updating term {} in Neo7J for key {}".format(
                            str(e), term_id, a_change["name"]
                        )
                        log.error(error_message)
                        self.errors.append(error_message)
                        neo4j_updated = False
                        break
                if not neo4j_updated:
                    # Try to rollback Neo4j
                    for a_change in old_neo_data:
                        neo_query = (
                            "MATCH (t {id: '" + term_id + "'}) "
                            "SET t."
                            + a_change["name"]
                            + " = '"
                            + a_change["value"]
                            + "' RETURN t"
                        )
                        try:
                            db.run(neo_query)
                        except Exception as e:
                            error_message = "Error {} while rollback term {} in Neo7J for key {}".format(
                                str(e), term_id, a_change["name"]
                            )
                            log.error(error_message)
                    # Try to rollback ES
                    try:
                        index_manager.update_term(term_id, old_es_data)
                    except Exception as e:
                        error_message = (
                            "Error {} while rollback ES data for term {}".format(
                                str(e), term_id
                            )
                        )
                        log.error(error_message)
            if es_updated and neo4j_updated:
                revisions_collection.update_one(revision_query, new_status)
            else:
                new_status = {
                    "$set": {
                        "status": -2,
                        "reviewed_by": self.userID,
                        "reviewed_on": datetime.datetime.now(),
                        "error_message": error_message,
                    }
                }
                revisions_collection.update_one(revision_query, new_status)
            self.returnRawViewResult = True
            created_by = revision_data.get('created_by')
            self.send_revision_status_update_email(created_by, 'Approved', revision_data)

            return HTTPFound(location=self.request.route_url("revisions"))
