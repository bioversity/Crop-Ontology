from .classes import PublicView
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
import pymongo
import json
from webhelpers2.html import literal
from neo4j import GraphDatabase
import requests
from pyramid.response import Response


class OntologyView(PublicView):
    def process_view(self):
        ontology_id = self.request.matchdict["ontology_id"]
        if self.request.method == "POST":
            form_data = self.get_post_dict()
            current_q = form_data.get("cypher", None)
            if current_q is not None:
                if current_q != "":
                    self.returnRawViewResult = True
                    return HTTPFound(
                        location=self.request.route_url(
                            "ontology", ontology_id=ontology_id, _query={"q": current_q}
                        )
                    )

        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        ontology_collection = ontology_db["ontologies"]
        ontology_data = ontology_collection.find_one({"ontology_id": ontology_id})
        if ontology_data is None:
            raise HTTPNotFound()
        mongo_client.close()
        return {
            "ontology_id": ontology_id,
            "ontology_data": ontology_data,
        }


class OntologyRDFView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        ontology_id = self.request.matchdict["ontology_id"]
        url = "http://localhost:7474/rdf/neo4j/cypher"
        payload = {
            "cypher": "MATCH path = (p {ontology_id: '"
            + ontology_id
            + "'})-[r]-(c) RETURN path",
            "format": "RDF/XML",
        }
        json_data = json.dumps(payload)
        result = requests.post(url, data=json_data, auth=("neo4j", "123"))
        headers = [
            ("Content-Type", "text/xml; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)
        response.text = result.text
        return response


class JSONDataView(PublicView):
    def process_view(self):
        def find_term(term_id):
            for a_term in nodes:
                if a_term["name"] == term_id:
                    return True
            return False

        self.returnRawViewResult = True
        ontology_id = self.request.matchdict["ontology_id"]

        def in_depends(term, depends):
            for a_parent in depends:
                if a_parent["name"] == term:
                    return True
            return False

        driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "123"))
        db = driver.session()

        root = db.run(
            'match(t {root: true, ontology_id: "'
            + ontology_id
            + '"}) return t.id, t.name'
        )
        root_id = ""
        root_name = ""
        for a_item in root:
            root_id = a_item["t.id"]
            root_name = a_item["t.name"]

        results = db.run(
            'match(parent {ontology_id: "'
            + ontology_id
            + '"})<-[r]-(child {ontology_id: "'
            + ontology_id
            + '"}) return parent.id as term_id, parent.term_type as term_type,'
            "parent.name as term_name,"
            'collect(child.id+"|"+child.term_type+"|"+type(r)+"|"+child.name) as children'
        )

        nodes = []
        # Add all parents and children
        for record in results:
            if not find_term(record["term_name"]):
                nodes.append(
                    {
                        "name": record["term_id"],
                        "desc": record["term_name"],
                        "type": record["term_type"],
                        "depends": [],
                    }
                )
                for a_child in record["children"]:
                    parts = a_child.split("|")
                    if not find_term(parts[0]):
                        nodes.append(
                            {
                                "name": parts[0],  # parts[0]
                                "desc": parts[3],
                                "type": parts[1],
                                "depends": [],
                            }
                        )
            else:
                for a_child in record["children"]:
                    parts = a_child.split("|")
                    if not find_term(parts[0]):
                        nodes.append(
                            {
                                "name": parts[0],
                                "desc": parts[3],
                                "type": parts[1],
                                "depends": [],
                            }
                        )

        results = db.run(
            'match(parent {ontology_id: "'
            + ontology_id
            + '"})<-[r]-(child {ontology_id: "'
            + ontology_id
            + '"}) return parent.id as term_id, parent.term_type as term_type,'
            "parent.name as term_name,"
            'collect(child.id+"|"+child.term_type+"|"+type(r)+"|"+child.name) as children'
        )

        # Set parents for each children
        for record in results:
            for a_child in record["children"]:
                parts = a_child.split("|")
                for a_node in nodes:
                    if a_node["name"] == parts[0]:
                        if not in_depends(record["term_id"], a_node["depends"]):
                            a_node["depends"].append(
                                {
                                    "name": record["term_id"],
                                    "link": parts[2],
                                    "desc": record["term_name"],
                                }
                            )

        for a_node in nodes:
            if len(a_node["depends"]) == 0:
                a_node["depends"].append(
                    {"name": root_id, "link": "RELATED_TO", "desc": root_name}
                )

        nodes.append(
            {"name": root_id, "desc": root_name, "type": "term", "depends": []}
        )

        db.close()
        json_data = nodes

        data = {}
        errors = []

        for obj in json_data:
            data[obj["name"]] = obj

        for key in data.keys():
            data[key]["dependedOnBy"] = []
            data[key]["docs"] = ""

        for key in data.keys():
            for dep_dict in data[key]["depends"]:
                if dep_dict["name"] in data.keys():
                    data[dep_dict["name"]]["dependedOnBy"].append(
                        {
                            "name": key,
                            "link": dep_dict["link"],
                            "desc": data[key]["desc"],
                        }
                    )
                else:
                    errors.append("An error")

        # with open("/home/cquiros/objects.json", "w") as outfile:
        #     json.dump({"data": data, "errors": errors}, outfile)

        return {"data": data, "errors": errors}
