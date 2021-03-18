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
            term_id = a_term.get("id")
            new_values = {}

            term_type = "term"
            if "Method ID" in a_term.keys():
                term_type = "method"
            if "Scale ID" in a_term.keys():
                term_type = "scale"
            if "Trait ID" in a_term.keys():
                term_type = "trait"
            if "Variable ID" in a_term.keys():
                term_type = "variable"
            new_values["term_type"] = term_type

            for a_key in a_term.keys():
                if a_key != "new_values":
                    current_value = a_term[a_key]
                    if isinstance(current_value, str):
                        if current_value.find("{") >= 0:
                            try:
                                json_content = json.loads(current_value)
                                if "english" in json_content.keys():
                                    new_values[a_key.lower()] = json_content["english"]
                                else:
                                    if "undefined" in json_content.keys():
                                        new_values[a_key.lower()] = json_content[
                                            "undefined"
                                        ]  # We assume English
                                    else:
                                        first_key = list(json_content.keys())[0]
                                        new_values[a_key.lower()] = json_content[
                                            first_key
                                        ]
                            except ValueError:
                                new_values[a_key.lower()] = current_value
                        else:
                            new_values[a_key.lower()] = current_value
                    else:
                        if isinstance(current_value, list):
                            new_array = []
                            for an_item in current_value:
                                if isinstance(an_item, str):
                                    if an_item.find("{") >= 0:
                                        json_content = json.loads(an_item)
                                        if "english" in json_content.keys():
                                            new_array.append(json_content["english"])
                                        else:
                                            if "undefined" in json_content.keys():
                                                new_array.append(
                                                    json_content["undefined"]
                                                )
                                            else:
                                                first_key = list(json_content.keys())[0]
                                                new_array.append(
                                                    json_content[first_key]
                                                )
                                    else:
                                        new_array.append(an_item)
                                else:
                                    new_array.append(an_item)
                            new_values[a_key.lower()] = new_array
                        else:
                            new_values[a_key.lower()] = current_value

            # Prepare the query and the new fields. We leave the old data intact just in case we want to reformat it
            # again later on
            id_query = {"id": term_id}
            # Standardize comments = comment
            if "comment" in new_values.keys():
                new_values["comments"] = new_values["comment"]
            updated_values = {"$set": {"new_values": new_values}}
            # Update the term in the collection
            ontology_collection.update_one(id_query, updated_values)
            # a_term["new_values"] = new_values

            # result.append(a_term)

# json_data = {"result": result}
# json = json.dumps(json_data, default=str)
# if os.path.exists("./fix_lang.json"):
#     os.remove("./fix_lang.json")
# f = open("./fix_lang.json", "w")
# f.write(json)
# f.close()
