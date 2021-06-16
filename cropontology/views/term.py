from .classes import PublicView, PrivateView
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
            'WHERE (op.is_obsolete <> "true" OR op.is_obsolete is null) return distinct op.id, op.name'
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


class TermEditorView(PrivateView):
    def process_view(self):
        def set_key_settings(kes):
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
        if self.request.method == "GET":
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
            for an_item in cursor:
                for a_key in keys:
                    a_key["value"] = an_item["n." + a_key["name"]]
            set_key_settings(keys)
            return {"keys": keys}
        else:
            return {}
