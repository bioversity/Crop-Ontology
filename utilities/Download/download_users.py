from google.cloud import datastore
import json
import os

client = datastore.Client()
client.from_service_account_json(
    "/home/cquiros/data/projects2017/"
    "cropontology/software/key/cropontology-curationtool-6808abc20d16.json"
)
query = client.query(kind="user")
print("Fetching")
result = query.fetch()
output = list(result)
json_data = {"result": output}
print("Saving")
json = json.dumps(json_data, default=str)
if os.path.exists("./users.json"):
    os.remove("./users.json")
f = open("./users.json", "w")
f.write(json)
f.close()
