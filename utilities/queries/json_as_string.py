import pymongo
import json
import os

mongo_client = pymongo.MongoClient("mongodb://192.168.0.101:27017/")
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
            for key in a_term.keys():
                try:
                    sub_data = json.loads(a_term[key])
                    if len(sub_data.keys()) > 1 and "english" not in sub_data.keys():
                        result.append(a_term)
                        break
                except ValueError:
                    pass

    json_data = {"result": result}
    json = json.dumps(json_data, default=str)
    if os.path.exists("json_as_string.json"):
        os.remove("./json_as_string.json")
    f = open("./json_as_string.json", "w")
    f.write(json)
    f.close()
