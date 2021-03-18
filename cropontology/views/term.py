from .classes import PublicView
from cropontology.processes.elasticsearch.term_index import get_term_index_manager
from pyramid.httpexceptions import HTTPNotFound
from neo4j import GraphDatabase


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

        query = (
            'Match (trait {id:"' + term_id + '"})<-[*]-(op {term_type: "variable"}) '
            "return distinct op.id, op.name"
        )
        cursor = db.run(query)
        variables = []
        for an_item in cursor:
            variables.append({"id": an_item["op.id"], "name": an_item["op.name"]})

        es_query = {"query": {"match_phrase": {"term_id": term_id}}}
        res, hits = index_manager.free_query(es_query)
        if hits == 0:
            raise HTTPNotFound()
        results = []
        ontology_id = None
        for key, value in res["hits"]["hits"][0]["_source"].items():
            if key == "ontology_id":
                ontology_id = value
            results.append({"key": key, "value": value})
        return {
            "results": results,
            "term_id": term_id,
            "with_tree": with_tree,
            "variables": variables,
            "ontology_id": ontology_id,
        }
