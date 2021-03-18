# This process will reformat the relationships between nodes based on the current fields: is_a, method_of and
# relationship to place them in arrays called: new_is_as, new_method_of, new_scale_of, new_variable_of,
# new_part_of, new_develop_from and new_related_to.
# This is helpful for later on when creating the basic relational tree in either Neo4J or AllegroGraph


import pymongo
import json

# import os

mongo_client = pymongo.MongoClient("mongodb://192.168.0.100:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
ontology_collection = ontology_db["ontologies"]
ontologies = ontology_collection.find()
obo_ontologies = [
    "CO_020",
    "CO_010",
    "CO_040",
    "SP",
    "SOY",
    "CO_500",
    "CO_705",
    "CO_715",
    "CO_125",
    "CO_121",
]
for an_ontology in ontologies:
    id_query = {"ontology_id": an_ontology["ontology_id"]}
    ontology_type = "trait"
    if an_ontology["ontology_id"] in obo_ontologies:
        ontology_type = "obo"
    new_values = {
        "$set": {
            "ontology_type": ontology_type,
        }
    }
    # Update the term in the collection
    ontology_collection.update_one(id_query, new_values)
