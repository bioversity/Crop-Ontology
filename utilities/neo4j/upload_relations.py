# This will upload the relationships into Neo4J. It should be done once because Neo4J only have one database.
# Therefore clear the Docker data volume before running this process.

import pymongo
import json

# import os
from neo4j import GraphDatabase


mongo_client = pymongo.MongoClient("mongodb://192.168.0.100:27017/")
ontology_db = mongo_client["ontologies"]
collections = ontology_db.list_collection_names()
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "123"))
# Create one collection for each ontology

# result = []


def create_constraint(tx):
    unique_ids = """CREATE CONSTRAINT ON (t:Term) ASSERT t.id IS UNIQUE"""
    tx.run(unique_ids)


with driver.session() as session:
    session.write_transaction(create_constraint)


def merge_terms(tx, child, relationship, parent):
    tx.run(
        "MERGE (c:Term {id: $child}) MERGE (p:Term {id: $parent}) MERGE (c)-[:%s]->(p)"
        % relationship,
        child=child,
        parent=parent,
    )


def merge_parent(tx, parent_id, root, obsolete):
    tx.run(
        "MERGE (t:Term {id: $id}) "
        "ON CREATE SET t.root = $root, t.obsolete = $obsolete "
        "ON MATCH SET t.root = $root, t.obsolete = $obsolete",
        id=parent_id,
        root=root,
        obsolete=obsolete,
    )


with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        ontology_collection = ontology_db[an_ontology["ontology_id"]]
        terms = ontology_collection.find()
        for a_term in terms:
            term_id = a_term.get("id")

            is_a = a_term.get("new_is_a", [])
            method_of = a_term.get("new_method_of", [])
            scale_of = a_term.get("new_scale_of", [])
            variable_of = a_term.get("new_variable_of", [])
            part_of = a_term.get("new_part_of", [])
            develop_from = a_term.get("new_develop_from", [])
            related_to = a_term.get("new_related_to", [])

            if (
                len(is_a) == 0
                and len(method_of) == 0
                and len(scale_of) == 0
                and len(variable_of) == 0
                and len(part_of) == 0
                and len(develop_from) == 0
                and len(related_to) == 0
            ):
                is_root = a_term.get("new_is_root", False)
                is_obsolete = a_term.get("new_is_obsolete", False)
                with driver.session() as session:
                    session.write_transaction(
                        merge_parent, term_id, is_root, is_obsolete
                    )
            else:
                for a_related_item in is_a:
                    with driver.session() as session:
                        session.write_transaction(
                            merge_terms, term_id, "IS_A", a_related_item
                        )

                for a_related_item in method_of:
                    with driver.session() as session:
                        session.write_transaction(
                            merge_terms, term_id, "METHOD_OF", a_related_item
                        )

                for a_related_item in scale_of:
                    with driver.session() as session:
                        session.write_transaction(
                            merge_terms, term_id, "SCALE_OF", a_related_item
                        )

                for a_related_item in variable_of:
                    with driver.session() as session:
                        session.write_transaction(
                            merge_terms, term_id, "VARIABLE_OF", a_related_item
                        )

                for a_related_item in part_of:
                    with driver.session() as session:
                        session.write_transaction(
                            merge_terms, term_id, "PART_OF", a_related_item
                        )

                for a_related_item in develop_from:
                    with driver.session() as session:
                        session.write_transaction(
                            merge_terms, term_id, "DEVELOP_FROM", a_related_item
                        )

                for a_related_item in related_to:
                    with driver.session() as session:
                        session.write_transaction(
                            merge_terms, term_id, "RELATED_TO", a_related_item
                        )

driver.close()
