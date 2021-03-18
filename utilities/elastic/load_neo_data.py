from cropontology.processes.elasticsearch.term_index import configure_term_index_manager
import json

IndexManager = configure_term_index_manager(
    {"elasticsearch.term.index_name": "co_terms"}
)

file1 = open("./all.json", "r")
count = 0
keys = []
method_classes = []
while True:
    count += 1
    # Get next line from file
    line = file1.readline()
    if not line:
        break
    json_data = json.loads(line)
    if json_data.get("type", "none") == "node":
        term_type = json_data["labels"][0]
        data_dict = json_data["properties"]
        data_dict["term_type"] = term_type
        term_id = data_dict["id"]
        data_dict.pop("id")
        data_dict["term_id"] = term_id
        if data_dict.get("obsolete", False):
            data_dict["obsolete"] = "True"
        else:
            data_dict["obsolete"] = "False"
        data_dict.pop("root", None)
        data_dict.pop("created_at", None)
        # if data_dict.get("obsolete", False):
        #     data_dict["obsolete"] = "True"
        # else:
        #     data_dict["obsolete"] = "False"
        IndexManager.add_term(term_id, data_dict)
print("Done")
