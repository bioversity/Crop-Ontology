from .classes import PublicView
from pyramid.response import Response
from neo4j import GraphDatabase
import pymongo
from pyramid.httpexceptions import HTTPFound, HTTPNotFound
from cropontology.processes.elasticsearch.term_index import get_term_index_manager
from cropontology.processes.db.section import delete_section
import logging
import datetime

log = logging.getLogger("cropontology")


class DeleteOntologyView(PublicView):
    def process_view(self):
        if self.request.method == "GET":
            ontology_id = self.request.matchdict["ontology_id"]

            mongo_url = self.request.registry.settings.get("mongo.url")
            mongo_client = pymongo.MongoClient(mongo_url)
            ontology_db = mongo_client["ontologies"]
            ontology_collection = ontology_db["ontologies"]
            ontology_data = ontology_collection.find_one({"ontology_id": ontology_id})
            mongo_client.close()
            if ontology_data is None:
                raise HTTPNotFound()
            return {"ontology_data": ontology_data}

        if self.request.method == "POST":
            ontology_id = self.request.matchdict["ontology_id"]
            try:
                neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
                neo4j_user = self.request.registry.settings["neo4j.user"]
                neo4j_password = self.request.registry.settings["neo4j.password"]
                driver = GraphDatabase.driver(
                    neo4j_bolt_url, auth=(neo4j_user, neo4j_password)
                )
                db = driver.session()
                term_index = get_term_index_manager(self.request)

                # delete ontology from Neo4J
                query = "MATCH (n {ontology_id:'" + ontology_id + "'}) DETACH DELETE n"
                db.run(query)

                # delete the ontology from ES
                term_index.remove_ontology(ontology_id)

                # Delete the ontology from Mongo
                mongo_url = self.request.registry.settings.get("mongo.url")
                mongo_client = pymongo.MongoClient(mongo_url)
                ontology_db = mongo_client["ontologies"]
                ontology_collection = ontology_db["ontologies"]
                revisions_collection = ontology_db["revisions"]
                ontology_collection.delete_one({"ontology_id": ontology_id})
                revisions_collection.delete_one({"ontology_id": ontology_id})
                mongo_client.close()

                # Delete any section connected to the ontology
                delete_section(self.request, ontology_id)
                delete_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                log.error(
                    "User: {} Deleted the ontology {} on {}".format(
                        self.user.id, ontology_id, delete_date
                    )
                )
                self.request.session.flash(
                    self._("The ontology was deleted successfully")
                )
                self.returnRawViewResult = True
                return HTTPFound(location=self.request.route_url("home"))
            except Exception as e:
                delete_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                log.error(
                    "User: {} tried to delete the ontology {} on {} but with error {}".format(
                        self.user.id, ontology_id, delete_date, str(e)
                    )
                )
                self.add_error(
                    "The ontology was NOT deleted successfully. A log entry has been crated"
                )
                self.returnRawViewResult = True
                return HTTPFound(location=self.request.route_url("home"))


class DeleteTermView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True

        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        ## should be coming from the form
        term_id = self.request.matchdict["term_id"]

        ## delete ontology
        query = "MATCH (n {id:'" + term_id + "'}) DETACH DELETE n"

        cursor = db.run(query)

        response = Response(headerlist=headers, status=200)
        response.text = "ok"
        return response
