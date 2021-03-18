import pymongo
import json
from dateutil.parser import parse


def check_date(string):
    try:
        a_date = parse(string)
        return True, a_date

    except ValueError:
        return False, ""


mongo_client = pymongo.MongoClient("mongodb://192.168.0.100:27017/")
ontology_db = mongo_client["ontologies"]
ontology_collection = ontology_db["ontologies"]
# Create one collection for each ontology
with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        is_date, date = check_date(an_ontology["created_at"])
        an_ontology["created_at"] = date
        ontology_collection.insert_one(an_ontology)
