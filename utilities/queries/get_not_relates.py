import pymongo
import json
import os

mongo_client = pymongo.MongoClient("mongodb://192.168.131.246:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
# Create one collection for each ontology
result = []


with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        ontology_collection = ontology_db[an_ontology["ontology_id"]]
        terms = ontology_collection.find()
        for a_term in terms:
            if "parent" in a_term.keys():
                if a_term["parent"] is not None:
                    if (
                        "is_a" not in a_term.keys()
                        and "method_of" not in a_term.keys()
                        and "relationship" not in a_term.keys()
                    ):
                        result.append(a_term)

    # ontology_rels = sorted(ontology_rels)

    json_data = {"result": result}
    json = json.dumps(json_data, default=str)
    if os.path.exists("./no_rels.json"):
        os.remove("./no_rels.json")
    f = open("./no_rels.json", "w")
    f.write(json)
    f.close()
