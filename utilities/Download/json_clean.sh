# Add format to Term data
jq . ./terms.json > ./terms2.json
# Remove normalized key
jq 'walk(if type == "object" and has("normalized") then del(.normalized) else . end)' ./terms2.json > ./terms3.json
# Remove obo_blob_key
jq 'walk(if type == "object" and has("obo_blob_key") then del(.obo_blob_key) else . end)' ./terms3.json > ./terms_final.json


# Add format to Ontology data
jq . ./ontology.json > ./ontology_final.json
