import json

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
        for key in json_data["properties"].keys():
            if key not in keys:
                keys.append(key)
        method_class = json_data["properties"].get("obsolete", None)
        if isinstance(method_class, bool):
            if method_class:
                method_class = "True"
            else:
                method_class = "false"
        if method_class is not None:
            index = -1
            found = False
            for existing in method_classes:
                index = index + 1
                if existing["code"] == method_class.upper():
                    found = True
                    break
            if found:
                method_classes[index]["number"] = method_classes[index]["number"] + 1
            else:
                method_classes.append({"code": method_class.upper(), "number": 1})
file1.close()
print(method_classes)
