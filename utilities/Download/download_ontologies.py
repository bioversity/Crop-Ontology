from google.cloud import datastore
import json
import os

client = datastore.Client()
client.from_service_account_json(
    "/home/cquiros/data/projects2017/"
    "cropontology/software/key/cropontology-curationtool-6808abc20d16.json"
)
query = client.query(kind="ontology")
print("Fetching")
result = query.fetch()
output = list(result)
json_data = {"result": output}
print("Saving")
json = json.dumps(json_data, default=str)
if os.path.exists("./ontology.json"):
    os.remove("./ontology.json")
f = open("./ontology.json", "w")
f.write(json)
f.close()
