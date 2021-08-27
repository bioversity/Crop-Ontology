from .classes import PublicView
from neo4j import GraphDatabase
import pandas
from pyramid.httpexceptions import HTTPFound, HTTPNotFound
from datetime import datetime
import os
import logging
import uuid
import shutil
from cropontology.processes.elasticsearch.term_index import get_term_index_manager
import pymongo
import numpy

log = logging.getLogger("cropontology")


class TemplateLoadView(PublicView):
    def process_view(self):
        if self.request.method == "GET":
            ontology_id = self.request.matchdict["ontology_id"]
            mongo_url = self.request.registry.settings.get("mongo.url")
            mongo_client = pymongo.MongoClient(mongo_url)
            ontology_db = mongo_client["ontologies"]
            ontology_collection = ontology_db["ontologies"]
            ontology_data = ontology_collection.find_one({"ontology_id": ontology_id})
            mongo_client.close()
            if ontology_data is None:
                raise HTTPNotFound()
            return {"ontology_data": ontology_data}

        if self.request.method == "POST":
            ontology_id = self.request.matchdict["ontology_id"]
            mongo_url = self.request.registry.settings.get("mongo.url")
            mongo_client = pymongo.MongoClient(mongo_url)
            ontology_db = mongo_client["ontologies"]
            ontology_collection = ontology_db["ontologies"]
            ontology_data = ontology_collection.find_one({"ontology_id": ontology_id})
            mongo_client.close()
            if ontology_data is None:
                raise HTTPNotFound()

            repository_dir = self.request.registry.settings["repository.path"]
            uid = str(uuid.uuid4())
            paths = ["tmp", uid]
            os.makedirs(os.path.join(repository_dir, *paths))
            try:
                input_file = self.request.POST["xlsx"].file
                input_file_name = self.request.POST["xlsx"].filename.lower()
                if os.path.isabs(input_file_name):
                    input_file_name = os.path.basename(input_file_name)
                slash_index = input_file_name.find("\\")
                if slash_index >= 0:
                    input_file_name = input_file_name[slash_index + 1 :]
            except Exception as e:
                log.error("Error while reading XLS. Error: {}".format(str(e)))
                self.errors.append(
                    "There was an error while reading your file. Error: {}".format(
                        str(e)
                    )
                )
                return {"ontology_data": ontology_data}

            input_file_name = input_file_name.replace(" ", "_")
            paths = ["tmp", uid, input_file_name.lower()]
            file_name = os.path.join(repository_dir, *paths)

            input_file.seek(0)
            with open(file_name, "wb") as permanent_file:
                shutil.copyfileobj(input_file, permanent_file)
            input_file.close()

            neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
            neo4j_user = self.request.registry.settings["neo4j.user"]
            neo4j_password = self.request.registry.settings["neo4j.password"]
            driver = GraphDatabase.driver(
                neo4j_bolt_url, auth=(neo4j_user, neo4j_password)
            )
            db = driver.session()

            term_index = get_term_index_manager(self.request)

            #  read excel file - should read file uploaded
            #  CHANGE HERE
            try:
                td = pandas.read_excel(file_name, sheet_name="Template for submission")
            except Exception as e:
                log.error("Unable to read Excel File. Error: {}".format(str(e)))
                self.errors.append("Unable to read Excel File")
                return {"ontology_data": ontology_data}

            ## remove empty row
            td.replace(r"^\s*$", numpy.nan, regex=True, inplace=True)
            td.dropna(how="all", inplace=True)

            #  check that names are never empty - RETURN error if they are
            nan_cols = [i for i in td.columns if td[i].isnull().any()]
            if (
                "Variable name" in nan_cols
                or "Trait name " in nan_cols
                or "Method name" in nan_cols
                or "Scale name" in nan_cols
            ):
                self.errors.append(
                    "Variable, trait, method or scale names should not be empty"
                )
                return {"ontology_data": ontology_data}

            # fill na with empty string
            td.fillna("", inplace=True)
            # replace special characters that might fail queries
            td.replace({'"': "", "'": ""}, regex=True, inplace=True)

            term_id = 0  # to be used when an ID is empty

            date = datetime.today().strftime("%Y-%m-%d-%H:%M:%S")

            # check if ontology exists and get last term ID used
            query = (
                "MATCH (n{ontology_id:'"
                + ontology_id
                + "'}) return n.id order by n.id DESC"
            )
            cursor = db.run(query)
            for nid in cursor:
                try:
                    term_id = int(nid[0].split(":")[1])
                    if nid[0].split(":")[0] != "CO":
                        continue
                    break
                except ValueError:
                    continue
                except IndexError:
                    self.errors.append(
                        "check that IDs are formatted as follow: CO_XXX:XXXXXXX"
                    )
                    return {"ontology_data": ontology_data}

            # parse the file
            for index, row in td.iterrows():
                if index == 0:
                    # add the root if not exists
                    query = (
                        "MERGE (a:Term{id: '"
                        + ontology_id
                        + ":ROOT'}) ON CREATE SET a:Term, a.id = '"
                        + ontology_id
                        + ":ROOT', a.ontology_id = '"
                        + ontology_id
                        + "' , "
                        + " a.ontology_name = '"
                        + row["Crop"]
                        + "' , a.name = '"
                        + row["Crop"]
                        + " traits' , a.root = True , "
                        + " a.obsolete = 'false' , a.created_at = '"
                        + date
                        + "' , a.language = '"
                        + row["Language"]
                        + "' , "
                        + " a.term_type = 'term' RETURN a"
                    )
                    db.run(query)
                    es_data = {
                        "ontology_id": ontology_id,
                        "ontology_name": row["Crop"],
                        "name": row["Crop"] + " traits",
                        "root": "true",
                        "obsolete": "false",
                        "created_at": date,
                        "language": row["Language"],
                        "term_type": "term",
                        "term_id": ontology_id + ":ROOT",
                    }  # Root
                    if not term_index.term_exists(ontology_id + ":ROOT"):
                        term_index.add_term(ontology_id + ":ROOT", es_data)

                # create variable
                # check if ID is empty
                var_id = row["Variable ID"]
                if not var_id:
                    var_id = ontology_id + ":" + str(term_id + 1).zfill(7)
                    term_id += 1

                # NEED TO CHECK IF ID NOT USED IF TERM EXISTS TERM_ID -= 1

                # mandatory fields
                # ON CREATE
                query = (
                    "MERGE (a:Variable{name: '"
                    + row["Variable name"]
                    + "', ontology_id: '"
                    + ontology_id
                    + "'}) ON CREATE SET a:Variable, a.id = '"
                    + var_id
                    + "', a.variable_id = '"
                    + var_id
                    + "', "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , a.crop = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Variable name"]
                    + "' , a.variable_name = '"
                    + row["Variable name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'variable' "
                )

                # other fields - need to check if exist
                if row["Variable synonyms"]:
                    query += (
                        ", a.variable_synonyms = '" + row["Variable synonyms"] + "' "
                    )
                if row["Context of use"]:
                    query += ", a.context_of_use = '" + row["Context of use"] + "' "
                if row["Growth stage"]:
                    query += ", a.growth_stage = '" + row["Growth stage"] + "' "
                if row["Variable status"]:
                    query += ", a.variable_status = '" + row["Variable status"] + "' "
                if row["Variable Xref"]:
                    query += ", a.variable_xref = '" + row["Variable Xref"] + "' "
                if row["Institution"]:
                    query += ", a.institution = '" + row["Institution"] + "' "
                if row["Scientist"]:
                    query += ", a.scientist = '" + row["Scientist"] + "' "

                # ON MATCH
                query += (
                    " ON MATCH SET "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , a.crop = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Variable name"]
                    + "' , a.variable_name = '"
                    + row["Variable name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'variable' "
                )

                # other fields - need to check if exist
                if row["Variable synonyms"]:
                    query += (
                        ", a.variable_synonyms = '" + row["Variable synonyms"] + "' "
                    )
                if row["Context of use"]:
                    query += ", a.context_of_use = '" + row["Context of use"] + "' "
                if row["Growth stage"]:
                    query += ", a.growth_stage = '" + row["Growth stage"] + "' "
                if row["Variable status"]:
                    query += ", a.variable_status = '" + row["Variable status"] + "' "
                if row["Variable Xref"]:
                    query += ", a.variable_xref = '" + row["Variable Xref"] + "' "
                if row["Institution"]:
                    query += ", a.institution = '" + row["Institution"] + "' "
                if row["Scientist"]:
                    query += ", a.scientist = '" + row["Scientist"] + "' "

                query += " RETURN a "
                cursor = db.run(query)

                ## check if it was a on create or on match
                # need to check if the id created has been used or if term was already existing
                variable_id = cursor.single()["a"]["id"]
                if not row["Variable ID"]:
                    if var_id != variable_id:
                        term_id -= 1
                        var_id = variable_id

                es_data = {
                    "ontology_id": ontology_id,
                    "variable_id": var_id,
                    "ontology_name": row["Crop"],
                    "crop": row["Crop"],
                    "name": row["Variable name"],
                    "variable_name": row["Variable name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "variable",
                    "term_id": var_id,
                }  # Root
                if row["Variable synonyms"]:
                    es_data["variable_synonyms"] = row["Variable synonyms"]
                if row["Context of use"]:
                    es_data["context_of_use"] = row["Context of use"]
                if row["Growth stage"]:
                    es_data["growth_stage"] = row["Growth stage"]
                if row["Variable status"]:
                    es_data["variable_status"] = ["Variable status"]
                if row["Variable Xref"]:
                    es_data["variable_xref"] = ["Variable Xref"]
                if row["Institution"]:
                    es_data["institution"] = row["Institution"]
                if row["Scientist"]:
                    es_data["scientist"] = row["Scientist"]

                if not term_index.term_exists(var_id):
                    term_index.add_term(var_id, es_data)
                else:
                    term_index.update_term(var_id, es_data)

                # create trait
                trait_id = row["Trait ID"]
                if not trait_id:
                    trait_id = ontology_id + ":" + str(term_id + 1).zfill(7)
                    term_id += 1
                # mandatory fields
                # ON CREATE
                query = (
                    "MERGE (a:Trait{name:'"
                    + row["Trait name"]
                    + "', ontology_id: '"
                    + ontology_id
                    + "'}) ON CREATE SET a:Trait, a.id = '"
                    + trait_id
                    + "', a.trait_id = '"
                    + trait_id
                    + "', "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Trait name"]
                    + "' , a.trait_name = '"
                    + row["Trait name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'trait' "
                )
                # other fieds - need to check if exist
                if row["Trait class"]:
                    query += ", a.trait_class = '" + row["Trait class"] + "' "
                if row["Trait description"]:
                    query += (
                        ", a.trait_description = '" + row["Trait description"] + "' "
                    )
                if row["Trait synonyms"]:
                    query += ", a.trait_synonym = '" + row["Trait synonyms"] + "' "
                if row["Main trait abbreviation"]:
                    query += (
                        ", a.main_trait_abbreviation = '"
                        + row["Main trait abbreviation"]
                        + "' "
                    )
                if row["Alternative trait abbreviations"]:
                    query += (
                        ", a.alternative_trait_abbreviations = '"
                        + row["Alternative trait abbreviations"]
                        + "' "
                    )
                if row["Entity"]:
                    query += ", a.entity = '" + row["Entity"] + "' "
                if row["Attribute"]:
                    query += ", a.attribute = '" + row["Attribute"] + "' "
                if row["Trait status"]:
                    query += ", a.trait_status = '" + row["Trait status"] + "' "
                if row["Trait Xref"]:
                    query += ", a.trait_xref = '" + row["Trait Xref"] + "' "

                # ON MATCH
                query += (
                    " ON MATCH SET "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Trait name"]
                    + "' , a.trait_name = '"
                    + row["Trait name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'trait' "
                )
                # other fieds - need to check if exist
                if row["Trait class"]:
                    query += ", a.trait_class = '" + row["Trait class"] + "' "
                if row["Trait description"]:
                    query += (
                        ", a.trait_description = '" + row["Trait description"] + "' "
                    )
                if row["Trait synonyms"]:
                    query += ", a.trait_synonym = '" + row["Trait synonyms"] + "' "
                if row["Main trait abbreviation"]:
                    query += (
                        ", a.main_trait_abbreviation = '"
                        + row["Main trait abbreviation"]
                        + "' "
                    )
                if row["Alternative trait abbreviations"]:
                    query += (
                        ", a.alternative_trait_abbreviations = '"
                        + row["Alternative trait abbreviations"]
                        + "' "
                    )
                if row["Entity"]:
                    query += ", a.entity = '" + row["Entity"] + "' "
                if row["Attribute"]:
                    query += ", a.attribute = '" + row["Attribute"] + "' "
                if row["Trait status"]:
                    query += ", a.trait_status = '" + row["Trait status"] + "' "
                if row["Trait Xref"]:
                    query += ", a.trait_xref = '" + row["Trait Xref"] + "' "

                query += " RETURN a "
                cursor = db.run(query)

                ## check if it was a on create or on match
                # need to check if the id created has been used or if term was already existing
                tr_id = cursor.single()["a"]["id"]
                if not row["Trait ID"]:
                    if trait_id != tr_id:
                        term_id -= 1
                        trait_id = tr_id

                es_data = {
                    "ontology_id": ontology_id,
                    "trait_id": trait_id,
                    "ontology_name": row["Crop"],
                    "name": row["Trait name"],
                    "trait_name": row["Trait name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "trait",
                    "term_id": trait_id,
                }
                if row["Trait class"]:
                    es_data["trait_class"] = row["Trait class"]
                if row["Trait description"]:
                    es_data["trait_description"] = row["Trait description"]
                if row["Trait synonyms"]:
                    es_data["trait_synonym"] = row["Trait synonyms"]
                if row["Main trait abbreviation"]:
                    es_data["main_trait_abbreviation"] = row["Main trait abbreviation"]
                if row["Alternative trait abbreviations"]:
                    es_data["alternative_trait_abbreviations"] = row[
                        "Alternative trait abbreviations"
                    ]
                if row["Entity"]:
                    es_data["entity"] = row["Entity"]
                if row["Attribute"]:
                    es_data["attribute"] = row["Attribute"]
                if row["Trait status"]:
                    es_data["trait_status"] = row["Trait status"]
                if row["Trait Xref"]:
                    es_data["trait_xref"] = row["Trait Xref"]

                if not term_index.term_exists(trait_id):
                    term_index.add_term(trait_id, es_data)
                else:
                    term_index.update_term(trait_id, es_data)

                # create method
                method_id = row["Method ID"]
                if not method_id:
                    method_id = ontology_id + ":" + str(term_id + 1).zfill(7)
                    term_id += 1
                # ON CREATE
                # mandatory field
                query = (
                    "MERGE (a:Method{name: '"
                    + row["Method name"]
                    + "', ontology_id: '"
                    + ontology_id
                    + "'}) ON CREATE SET a:Method, a.id = '"
                    + method_id
                    + "', a.method_id = '"
                    + method_id
                    + "', "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Method name"]
                    + "' , a.method_name = '"
                    + row["Method name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'method' "
                )
                # other fieds - need to check if exist
                if row["Method class"]:
                    query += ", a.method_class = '" + row["Method class"] + "' "
                if row["Method description"]:
                    query += (
                        ", a.method_description = '" + row["Method description"] + "' "
                    )
                if row["Formula"]:
                    query += ", a.formula = '" + row["Formula"] + "' "
                if row["Method reference"]:
                    query += ", a.method_reference = '" + row["Method reference"] + "' "
                # ON MATCH
                # mandatory field
                query += (
                    " ON MATCH SET "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Method name"]
                    + "' , a.method_name = '"
                    + row["Method name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'method' "
                )
                # other fieds - need to check if exist
                if row["Method class"]:
                    query += ", a.method_class = '" + row["Method class"] + "' "
                if row["Method description"]:
                    query += (
                        ", a.method_description = '" + row["Method description"] + "' "
                    )
                if row["Formula"]:
                    query += ", a.formula = '" + row["Formula"] + "' "
                if row["Method reference"]:
                    query += ", a.method_reference = '" + row["Method reference"] + "' "

                query += " RETURN a "
                cursor = db.run(query)

                ## check if it was a on create or on match
                # need to check if the id created has been used or if term was already existing
                meth_id = cursor.single()["a"]["id"]
                if not row["Method ID"]:
                    if method_id != meth_id:
                        term_id -= 1
                        method_id = meth_id

                es_data = {
                    "ontology_id": ontology_id,
                    "method_id": method_id,
                    "ontology_name": row["Crop"],
                    "name": row["Method name"],
                    "method_name": row["Method name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "method",
                    "term_id": method_id,
                }
                if row["Method class"]:
                    es_data["method_class"] = row["Method class"]
                if row["Method description"]:
                    es_data["method_description"] = row["Method description"]
                if row["Formula"]:
                    es_data["formula"] = row["Formula"]
                if row["Method reference"]:
                    es_data["method_reference"] = row["Method reference"]

                if not term_index.term_exists(method_id):
                    term_index.add_term(method_id, es_data)
                else:
                    term_index.update_term(method_id, es_data)

                # create scale
                scale_id = row["Scale ID"]
                if not scale_id:
                    scale_id = ontology_id + ":" + str(term_id + 1).zfill(7)
                    term_id += 1
                # ON CREATE
                # mandatory fields
                query = (
                    "MERGE (a:Scale {name: '"
                    + row["Scale name"]
                    + "', ontology_id: '"
                    + ontology_id
                    + "'}) ON CREATE SET a:Scale, a.id = '"
                    + scale_id
                    + "', a.scale_id = '"
                    + scale_id
                    + "', "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Scale name"]
                    + "' , a.scale_name = '"
                    + row["Scale name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'scale' "
                )
                # other fieds - need to check if exist
                if row["Scale class"]:
                    query += ", a.scale_class = '" + row["Scale class"] + "' "
                if row["Decimal places"]:
                    query += (
                        ", a.decimal_places = '" + str(row["Decimal places"]) + "' "
                    )
                if row["Lower limit"]:
                    query += ", a.lower_limit = '" + str(row["Lower limit"]) + "' "
                if row["Upper limit"]:
                    query += ", a.upper_limit = '" + str(row["Upper limit"]) + "' "
                if row["Scale Xref"]:
                    query += ", a.scale_xref = '" + row["Scale Xref"] + "' "
                i = 1
                while row["Category " + str(i)]:
                    query += (
                        ", a.category_"
                        + str(i)
                        + " = '"
                        + str(row["Category " + str(i)])
                        + "' "
                    )
                    i += 1
                # ON MATCH
                query += (
                    " ON MATCH SET "
                    + " a.ontology_id = '"
                    + ontology_id
                    + "' , a.ontology_name = '"
                    + row["Crop"]
                    + "' , "
                    + " a.name = '"
                    + row["Scale name"]
                    + "' , a.scale_name = '"
                    + row["Scale name"]
                    + "' ,"
                    " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'scale' "
                )
                # other fieds - need to check if exist
                if row["Scale class"]:
                    query += ", a.scale_class = '" + row["Scale class"] + "' "
                if row["Decimal places"]:
                    query += (
                        ", a.decimal_places = '" + str(row["Decimal places"]) + "' "
                    )
                if row["Lower limit"]:
                    query += ", a.lower_limit = '" + str(row["Lower limit"]) + "' "
                if row["Upper limit"]:
                    query += ", a.upper_limit = '" + str(row["Upper limit"]) + "' "
                if row["Scale Xref"]:
                    query += ", a.scale_xref = '" + row["Scale Xref"] + "' "
                i = 1
                while row["Category " + str(i)]:
                    query += (
                        ", a.category_"
                        + str(i)
                        + " = '"
                        + str(row["Category " + str(i)])
                        + "' "
                    )
                    i += 1

                query += " RETURN a "
                cursor = db.run(query)

                ## check if it was a on create or on match
                # need to check if the id created has been used or if term was already existing
                sc_id = cursor.single()["a"]["id"]
                if not row["Scale ID"]:
                    if scale_id != sc_id:
                        term_id -= 1
                        scale_id = sc_id

                es_data = {
                    "ontology_id": ontology_id,
                    "scale_id": scale_id,
                    "ontology_name": row["Crop"],
                    "name": row["Scale name"],
                    "scale_name": row["Scale name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "scale",
                    "term_id": scale_id,
                }
                if row["Scale class"]:
                    es_data["scale_class"] = row["Scale class"]
                if row["Decimal places"]:
                    es_data["decimal_places"] = str(row["Decimal places"])
                if row["Lower limit"]:
                    es_data["lower_limit"] = str(row["Lower limit"])
                if row["Upper limit"]:
                    es_data["upper_limit"] = str(row["Upper limit"])
                if row["Scale Xref"]:
                    es_data["scale_xref"] = row["Scale Xref"]

                i = 1
                while row["Category {}".format(i)]:
                    es_data["category_{}".format(i)] = str(row["Category {}".format(i)])
                    i += 1

                if not term_index.term_exists(scale_id):
                    term_index.add_term(scale_id, es_data)
                else:
                    term_index.update_term(scale_id, es_data)

                # add relationship
                query = (
                    "MATCH (a:Variable), (b:Trait) "
                    + "WHERE a.id = '"
                    + var_id
                    + "' AND b.id = '"
                    + trait_id
                    + "' "
                    + "MERGE (a)-[r:VARIABLE_OF]->(b) "
                )
                db.run(query)
                query = (
                    "MATCH (a:Variable), (b:Method) "
                    + "WHERE a.id = '"
                    + var_id
                    + "' AND b.id = '"
                    + method_id
                    + "' "
                    + "MERGE (a)-[r:VARIABLE_OF]->(b) "
                )
                db.run(query)
                query = (
                    "MATCH (a:Variable), (b:Scale) "
                    + "WHERE a.id = '"
                    + var_id
                    + "' AND b.id = '"
                    + scale_id
                    + "' "
                    + "MERGE (a)-[r:VARIABLE_OF]->(b) "
                )
                db.run(query)
                query = (
                    "MATCH (a:Scale), (b:Method) "
                    + "WHERE a.id = '"
                    + scale_id
                    + "' AND b.id = '"
                    + method_id
                    + "' "
                    + "MERGE (a)-[r:SCALE_OF]->(b) "
                )
                db.run(query)
                query = (
                    "MATCH (a:Method), (b:Trait) "
                    + "WHERE a.id = '"
                    + method_id
                    + "' AND b.id = '"
                    + trait_id
                    + "' "
                    + "MERGE (a)-[r:METHOD_OF]->(b) "
                )
                db.run(query)

                # add trait class
                # test if class exists
                # if not create class, if the node does not exist - create it: MERGE ON CREATE SET
                query = (
                    "MERGE (a:Term {id: '"
                    + ontology_id
                    + ":"
                    + row["Trait class"]
                    + "'}) ON CREATE SET a:Term, a.id = '"
                    + ontology_id
                    + ":"
                    + row["Trait class"]
                    + "' , a.ontology_id = '"
                    + ontology_id
                    + "' , "
                    + " a.ontology_name = '"
                    + row["Crop"]
                    + "' , a.name = '"
                    + row["Trait class"]
                    + "' , "
                    + " a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'term' RETURN a"
                )
                db.run(query)

                es_data = {
                    "ontology_id": ontology_id,
                    "ontology_name": row["Crop"],
                    "name": row["Trait class"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "term",
                    "term_id": ontology_id + ":" + row["Trait class"],
                }

                if not term_index.term_exists(ontology_id + ":" + row["Trait class"]):
                    term_index.add_term(ontology_id + ":" + row["Trait class"], es_data)
                else:
                    term_index.update_term(
                        ontology_id + ":" + row["Trait class"], es_data
                    )

                query = (
                    "MATCH (a:Trait), (b:Term) "
                    + "WHERE a.id = '"
                    + trait_id
                    + "' AND b.id = '"
                    + ontology_id
                    + ":"
                    + row["Trait class"]
                    + "' "
                    + "MERGE (a)-[r:RELATED_TO]->(b) "
                )
                db.run(query)
                query = (
                    "MATCH (a:Term), (b:Term) "
                    + "WHERE a.id = '"
                    + ontology_id
                    + ":ROOT' AND b.id = '"
                    + ontology_id
                    + ":"
                    + row["Trait class"]
                    + "' "
                    + "MERGE (b)-[r:RELATED_TO]->(a) "
                )
                db.run(query)
            self.request.session.flash(self._("The file was uploaded successfully"))
            self.returnRawViewResult = True
            return HTTPFound(location=self.request.route_url("home"))
