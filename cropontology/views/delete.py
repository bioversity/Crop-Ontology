from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase


class DeleteOntologyView(PublicView):
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
        ontology_id = self.request.matchdict["ontology_id"]

        ## delete ontology
        query = "MATCH (n {ontology_id:'" + ontology_id + "'}) DETACH DELETE n"

        cursor = db.run(query)

        response = Response(headerlist=headers, status=200)
        response.text = "ok"
        return response


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
