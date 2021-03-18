import pymongo
import json
import os

mongo_client = pymongo.MongoClient("mongodb://192.168.0.101:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
# Create one collection for each ontology
ontology_rels = []


def add_relationship(relation):
    if relation not in ontology_rels:
        ontology_rels.append(relation)


with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        ontology_collection = ontology_db[an_ontology["ontology_id"]]
        terms = ontology_collection.find()
        for a_term in terms:
            a_relationship = a_term.get("relationship", None)
            if a_relationship is not None:
                add_relationship(a_relationship)

    # ontology_rels = sorted(ontology_rels)

    json_data = {"relationships": ontology_rels}
    json = json.dumps(json_data, default=str)
    if os.path.exists("./all_rels.json"):
        os.remove("./all_rels.json")
    f = open("./all_rels.json", "w")
    f.write(json)
    f.close()
