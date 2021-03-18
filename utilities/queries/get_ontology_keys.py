import pymongo
import json
import os

mongo_client = pymongo.MongoClient("mongodb://192.168.0.101:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
# Create one collection for each ontology
ontology_keys = []


def key_exist(ontology, key):
    for a_ontology in ontology_keys:
        if a_ontology["name"] == ontology:
            if key in a_ontology["keys"]:
                return True
    return False


def ontology_exist(ontology):
    for a_ontology in ontology_keys:
        if a_ontology["name"] == ontology:
            return True
    return False


def add_key(ontology, name, key):
    if not ontology_exist(ontology):
        ontology_keys.append({"name": ontology, "desc": name, "keys": [key.lower()]})
    else:
        if not key_exist(ontology, key.lower()):
            for a_ontology in ontology_keys:
                if a_ontology["name"] == ontology:
                    a_ontology["keys"].append(key.lower)


with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        ontology_collection = ontology_db[an_ontology["ontology_id"]]
        ontology_name = an_ontology["ontology_name"]
        terms = ontology_collection.find()
        for a_term in terms:
            for a_key in a_term.keys():
                add_key(an_ontology["ontology_id"], ontology_name, a_key)

    for a_ontology in ontology_keys:
        a_ontology["keys"] = sorted(a_ontology["keys"])
        a_ontology["number_of_keys"] = len(a_ontology["keys"])
    json_data = {"ontologies": ontology_keys}
    json = json.dumps(json_data, default=str)
    if os.path.exists("./keys.json"):
        os.remove("./keys.json")
    f = open("./keys.json", "w")
    f.write(json)
    f.close()
