import pymongo
import json
import os

mongo_client = pymongo.MongoClient("mongodb://192.168.0.101:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
# Create one collection for each ontology
ontology_keys = []


def add_key(key):
    if key.lower() not in ontology_keys:
        ontology_keys.append(key.lower())


with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        ontology_collection = ontology_db[an_ontology["ontology_id"]]
        ontology_name = an_ontology["ontology_name"]
        terms = ontology_collection.find()
        for a_term in terms:
            for a_key in a_term.keys():
                add_key(a_key)

    ontology_keys = sorted(ontology_keys)

    json_data = {"keys": ontology_keys}
    json = json.dumps(json_data, default=str)
    if os.path.exists("./all_keys.json"):
        os.remove("./all_keys.json")
    f = open("./all_keys.json", "w")
    f.write(json)
    f.close()
