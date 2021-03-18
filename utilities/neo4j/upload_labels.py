# This will upload the relationships into Neo4J. It should be done once after reformatting the languages.

import pymongo
import json

# import os
from neo4j import GraphDatabase
from dateutil.parser import parse


mongo_client = pymongo.MongoClient("mongodb://192.168.0.101:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "123"))
# Create one collection for each ontology

# result = []


def check_date(string):
    try:
        a_date = parse(string)
        return True, a_date

    except ValueError:
        return False, ""


def fix_string(value):
    res = value.replace('"', "'")
    res = res.replace("\\", "")
    # res = res.replace("(", "")
    # res = res.replace(")", "")
    # res = res.replace("=", "-")
    # res = res.replace(",", "")
    # res = res.replace(".", "")
    return res


def fix_key(value):
    res = value.replace(" ", "_")
    res = res.replace("(", "")
    res = res.replace(")", "")
    res = res.replace(",", "")
    res = res.replace(".", "")
    res = res.replace("?", "")
    res = res.replace(":", "")
    res = res.replace("-", "")
    res = res.replace("=", "")
    return res


def check_number(value):
    if value.lower() != "inf":
        try:
            res = float(value)
            return True, res
        except ValueError:
            return False, value
    else:
        return False, value


keys_to_ignore = [
    "excel_blob_key",
    "id",
    "parent",
    "relationship",
    "is_a",
    "method_of",
    "new_is_root",
    "new_is_obsolete",
    "comment",
]


def set_properties(tx, term_to_find, values):

    term_type = ""
    for a_key in values.keys():
        if a_key not in keys_to_ignore:
            if a_key == "term_type":
                term_type = values[a_key]

    update_string = "MATCH (t) WHERE t.id = $id REMOVE t:Term SET t:{} return t".format(
        term_type
    )
    print("****************99")
    print(update_string)
    print("****************99")
    tx.run(update_string, id=term_to_find)


with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        ontology_collection = ontology_db[an_ontology["ontology_id"]]
        terms = ontology_collection.find()
        for a_term in terms:
            term_id = a_term.get("id")
            with driver.session() as session:
                session.write_transaction(set_properties, term_id, a_term["new_values"])

driver.close()
