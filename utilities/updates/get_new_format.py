# This process will reformat the the languages to english. Currently the languages are not standardized across
# ontologies therefore this will reformat them to English only.


import pymongo
import json
import os

mongo_client = pymongo.MongoClient("mongodb://192.168.0.100:27017/")
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
            result.append(a_term)

json_data = {"result": result}
json = json.dumps(json_data, default=str)
if os.path.exists("./fix_lang.json"):
    os.remove("./fix_lang.json")
f = open("./fix_lang.json", "w")
f.write(json)
f.close()
