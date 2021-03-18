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
# Create one collection for each ontology

# result = []

with open("../Download/ontology_final.json") as json_file:
    data = json.load(json_file)
    for an_ontology in data["result"]:
        ontology_collection = ontology_db[an_ontology["ontology_id"]]
        terms = ontology_collection.find()
        for a_term in terms:
            is_root = False
            term_id = a_term.get("id")
            parents = a_term.get("parent", [])
            is_obsolete = a_term.get("is_obsolete", "false")
            if is_obsolete.find("{") >= 0:
                json_content = json.loads(is_obsolete)
                first_key = list(json_content.keys())[0]
                is_obsolete = json_content[first_key]

            if is_obsolete == "true":
                is_obsolete = True
            else:
                is_obsolete = False
            if parents is None:
                is_root = True
                parents = []

            if isinstance(parents, str):
                parents = [parents]

            is_a = a_term.get("is_a", [])
            if isinstance(is_a, str):
                is_a = [is_a]

            method_of = a_term.get("method_of", [])
            if isinstance(method_of, str):
                method_of = [method_of]

            # Fixing is_a
            indexes_to_remove = []
            items_to_add = []
            for index, an_item in enumerate(is_a):
                item_content = an_item
                try:
                    json_content = json.loads(item_content)
                    first_key = list(json_content.keys())[0]
                    item_content = json_content[first_key]
                    if isinstance(item_content, list):
                        for a_sub_item in item_content:
                            parts = a_sub_item.split(" ! ")
                            if index not in indexes_to_remove:
                                indexes_to_remove.append(index)
                            items_to_add.append(parts[0])
                    else:
                        parts = item_content.split(" ! ")
                        is_a[index] = parts[0]
                except ValueError:
                    parts = item_content.split(" ! ")
                    is_a[index] = parts[0]
            if len(indexes_to_remove) > 0:
                for idx in indexes_to_remove:
                    del is_a[idx]
                for item_to_add in items_to_add:
                    is_a.append(item_to_add)

            # Fixing method_of
            for index, an_item in enumerate(method_of):
                parts = an_item.split(" ! ")
                method_of[index] = parts[0].replace("id: ", "")

            # Removing linked parents
            parents2 = []
            for a_parent in parents:
                if a_parent not in is_a and a_parent not in method_of:
                    parents2.append(a_parent)
            parents = parents2.copy()

            relationships = a_term.get("relationship", [])
            if isinstance(relationships, str):
                relationships = [relationships]

            scale_of = []
            variable_of = []
            part_of = []
            develop_from = []
            related_to = []  # this could be changed to is_a
            for a_rel in relationships:
                parts = a_rel.split(" ")
                if len(parts) == 1:
                    if parts[0] == "scale_of":
                        for a_parent in parents:
                            scale_of.append(a_parent)
                    if parts[0] == "method_of":
                        for a_parent in parents:
                            if a_parent not in method_of:
                                method_of.append(a_parent)
                    if parts[0] == "variable_of":
                        for a_parent in parents:
                            variable_of.append(a_parent)
                else:
                    if parts[0] == "part_of":
                        part_of.append(parts[1])
                    if parts[0] == "method_of":
                        if parts[1] not in method_of:
                            method_of.append(parts[1])
                    if parts[0] == "develop_from":
                        develop_from.append(parts[1])
                    if (
                        parts[0] != "part_of"
                        and parts[0] != "method_of"
                        and parts[0] != "develop_from"
                    ):
                        related_to.append(parts[1])

            # Removing linked parents
            parents2 = []
            for a_parent in parents:
                if (
                    a_parent not in is_a
                    and a_parent not in method_of
                    and a_parent not in scale_of
                    and a_parent not in variable_of
                    and a_parent not in part_of
                    and a_parent not in develop_from
                    and a_parent not in related_to
                ):
                    parents2.append(a_parent)
            parents = parents2.copy()

            # Add not associated parents as related to. This could also be is_a
            for a_parent in parents:
                related_to.append(a_parent)

            # Prepare the query and the new fields. We leave the old data intact just in case we want to reformat it
            # again later on
            id_query = {"id": term_id}
            new_values = {
                "$set": {
                    "new_is_a": is_a,
                    "new_method_of": method_of,
                    "new_scale_of": scale_of,
                    "new_variable_of": variable_of,
                    "new_part_of": part_of,
                    "new_develop_from": develop_from,
                    "new_related_to": related_to,
                    "new_is_root": is_root,
                    "new_is_obsolete": is_obsolete,
                }
            }
            # Update the term in the collection
            ontology_collection.update_one(id_query, new_values)

            # result.append({"id": term_id, "is_a": is_a,
            #                "method_of": method_of, "scale_of": scale_of,
            #                "variable_of": variable_of, "part_of": part_of,
            #                "develop_from": develop_from, "related_to": related_to})

# json_data = {"result": result}
# json = json.dumps(json_data, default=str)
# if os.path.exists("./fixes.json"):
#     os.remove("./fixes.json")
# f = open("./fixes.json", "w")
# f.write(json)
# f.close()
