import pymongo
import json

mongo_client = pymongo.MongoClient("mongodb://192.168.0.101:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
# Create one collection for each ontology
with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for ontology in data["result"]:
        ontology_collection = ontology_db[ontology["ontology_id"]]
        print("{}|{}".format(ontology["ontology_id"], ontology_collection.count()))
