from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase
import pymongo


def to_json(data):
    return json.dumps(data, indent=4, default=str)


def get_neo_result(cursor, key):
    results = []
    for an_item in cursor:
        results.append(an_item[key])
    return results


class EBIMetadataView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        headers = [
            ("Content-Type", "application/json; charset=utf-8"),  # application/x-yaml
        ]
        response = Response(headerlist=headers, status=200)

        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        ontology_collection = ontology_db["ontologies"]
        ontologies = list(ontology_collection.find().sort([("ontology_name", 1)]))

        ret = '"@context":\n' "ontologies:\n"

        for ontology in ontologies:
            if ontology["category"] == "300-499 Phenotype and Trait Ontology":
                if "CO_" in ontology["ontology_id"]:
                    onto_id = ontology["ontology_id"]
                    onto_name = ontology["ontology_name"]
                    onto_description = ontology["ontology_summary"]
                    ret += (
                        " - id: " + onto_id + "\n"
                        "   title: " + onto_name + " ontology\n"
                        "   uri: http://www.cropontology.org/ontology/"
                        + onto_id
                        + "/"
                        + onto_name
                        + "\n"
                        '   description: "' + onto_description + '"' + "\n"
                        "   homepage: http://www.cropontology.org/ontology/"
                        + onto_id
                        + "/"
                        + onto_name
                        + "\n"
                        "   mailing_list: helpdesk@cropontology-curationtool.org\n"
                        "   definition_property:\n"
                        "     - http://www.w3.org/2004/02/skos/core#definition\n"
                        "   synonym_property:\n"
                        "     - http://www.w3.org/2004/02/skos/core#altLabel\n"
                        "     - http://www.cropontology.org/rdf/acronym\n"
                        "   hierarchical_property:\n"
                        "     - http://www.cropontology.org/rdf/method_of\n"
                        "     - http://www.cropontology.org/rdf/scale_of\n"
                        "   base_uri:\n"
                        "     - http://www.cropontology.org/rdf/" + onto_id + "\n"
                        "   ontology_purl : http://www.cropontology.org/ontology/"
                        + onto_id
                        + "/"
                        + onto_name
                        + "/owl\n"
                    )

        # json_data = to_json(ret)
        response.text = ret
        return response
