import json

_mappings = {
    "settings": {
        "index": {
            "number_of_shards": 5,
            "number_of_replicas": 1,
        }
    },
    "mappings": {
        "properties": {
            "all_data": {"type": "text", "analyzer": "standard"},
            "term_id": {"type": "text", "copy_to": "all_data"},
        }
    },
}
with open("./keys_for_elastic.json") as json_file:
    data = json.load(json_file)
    for a_key in data["keys"]:
        if a_key["type"] == "text":
            _mappings["mappings"]["properties"][a_key["value"]] = {"type": "text"}
        if a_key["type"] == "copy":
            _mappings["mappings"]["properties"][a_key["value"]] = {
                "type": "text",
                "copy_to": "all_data",
            }
        if a_key["type"] == "Facet":
            _mappings["mappings"]["properties"][a_key["value"]] = {
                "type": "text",
                "copy_to": "all_data",
                "fields": {"keyword": {"type": "keyword"}},
            }
    with open("./mappings.json", "w") as outfile:
        json.dump(_mappings, outfile)
