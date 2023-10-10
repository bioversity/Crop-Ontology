from cropontology.utils.utils import update_github_file

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
from pyramid.response import Response
import json

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
                self.errors.append(
                    "Unable to read Excel File. Please check that the data are in a sheet named 'Template for submission'"
                )
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
            ## all the columns have the same dtype
            td = td.astype("object")

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
                    if nid[0].split("_")[0] != "CO":
                        continue
                    break
                except ValueError:
                    continue
                except IndexError:
                    self.errors.append(
                        "check that IDs are formatted as follow: CO_XXX:XXXXXXX"
                    )
                    return {"ontology_data": ontology_data}

            ## VERSIONING
            # if ontology exists, archive the ontology
            query = (
                "MATCH (n{ontology_id:'"
                + ontology_id
                + "'}) SET n.ontology_id = '"
                + ontology_id
                + "_"
                + date
                + "', n.term_id=n.id REMOVE n.id return n "
            )
            db.run(query)
            # END VERSIONING

            ###### improving loading time
            ###### add unique IDs when ID column is empty
            ###### create unique list of variable, trait, method, scale
            ###### add the terms
            ###### add the links
            ###### refresh ES index

            ## check if unique IDs needs to be generated
            for index, row in td.iterrows():
                if not row["Variable ID"]:
                    row["Variable ID"] = ontology_id + ":" + str(term_id + 1).zfill(7)
                    term_id += 1
                if not row["Trait ID"]:
                    if td["Trait ID"][td["Trait name"] == row["Trait name"]].tolist()[
                        0
                    ]:
                        row["Trait ID"] = td["Trait ID"][
                            td["Trait name"] == row["Trait name"]
                        ].tolist()[0]
                    else:
                        row["Trait ID"] = ontology_id + ":" + str(term_id + 1).zfill(7)
                        term_id += 1
                if not row["Method ID"]:
                    if td["Method ID"][
                        td["Method name"] == row["Method name"]
                    ].tolist()[0]:
                        row["Method ID"] = td["Method ID"][
                            td["Method name"] == row["Method name"]
                        ].tolist()[0]
                    else:
                        row["Method ID"] = ontology_id + ":" + str(term_id + 1).zfill(7)
                        term_id += 1
                if not row["Scale ID"]:
                    if td["Scale ID"][td["Scale name"] == row["Scale name"]].tolist()[
                        0
                    ]:
                        row["Scale ID"] = td["Scale ID"][
                            td["Scale name"] == row["Scale name"]
                        ].tolist()[0]
                    else:
                        row["Scale ID"] = ontology_id + ":" + str(term_id + 1).zfill(7)
                        term_id += 1

            ## prepare df
            df_var = td.loc[:, "Variable ID":"Crop"]
            df_trait = td.loc[:, "Language":"Trait Xref"].drop_duplicates()
            df_method = pandas.concat(
                [
                    td.loc[:, "Method ID":"Method reference"],
                    td.loc[:, "Language":"Crop"],
                ],
                axis=1,
            ).drop_duplicates()
            df_scale = pandas.concat(
                [td.loc[:, "Scale ID":], td.loc[:, "Language":"Crop"]], axis=1
            ).drop_duplicates()
            df_traitClass = pandas.concat(
                [td[["Trait class"]], td.loc[:, "Language":"Crop"]], axis=1
            ).drop_duplicates()
            df_link_var = td[["Variable ID", "Trait ID", "Method ID", "Scale ID"]]
            df_link_scaleof = td[["Method ID", "Scale ID"]].drop_duplicates()
            df_link_methodof = td[["Trait ID", "Method ID"]].drop_duplicates()
            df_link_trait = td[["Trait ID", "Trait class"]].drop_duplicates()
            # df_link_method = td[['Method ID', 'Method class']].drop_duplicates()
            # df_link_scale = td[['Scale ID', 'Scale class']].drop_duplicates()

            crop = df_var["Crop"].tolist()[0]
            language = df_var["Language"].tolist()[0]

            ## insert data

            ### variable
            for index, row in df_var.iterrows():
                query = (
                    "MERGE (a:Variable {id: '"
                    + row["Variable ID"]
                    + "' }) "
                    + "SET a.id = '"
                    + row["Variable ID"]
                    + "' "
                    + "SET a.variable_id = '"
                    + row["Variable ID"]
                    + "' "
                    + "SET a.name = '"
                    + row["Variable name"]
                    + "' "
                    + "SET a.variable_name = '"
                    + row["Variable name"]
                    + "' "
                    + "SET a.created_at = '"
                    + date
                    + "' "
                    + "SET a.language = '"
                    + row["Language"]
                    + "' "
                    + "SET a.term_type = 'variable' "
                    + "SET a.ontology_name = '"
                    + row["Crop"]
                    + "' "
                    + "SET a.crop = '"
                    + row["Crop"]
                    + "' "
                    + "SET a.ontology_id = '"
                    + ontology_id
                    + "' "
                    + "SET a.variable_synonyms = CASE trim('"
                    + row["Variable synonyms"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Variable synonyms"]
                    + "' END "
                    + "SET a.context_of_use = CASE trim('"
                    + row["Context of use"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Context of use"]
                    + "' END "
                    + "SET a.growth_stage = CASE trim('"
                    + row["Growth stage"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Growth stage"]
                    + "' END "
                    + "SET a.variable_status = CASE trim('"
                    + row["Variable status"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Variable status"]
                    + "' END "
                    + "SET a.variable_xref = CASE trim('"
                    + row["Variable Xref"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Variable Xref"]
                    + "' END "
                    + "SET a.institution = CASE trim('"
                    + row["Institution"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Institution"]
                    + "' END "
                    + "SET a.scientist = CASE trim('"
                    + row["Scientist"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Scientist"]
                    + "' END "
                    + "SET a.date = CASE trim('"
                    + str(row["Date"])
                    + "') WHEN '' THEN null ELSE '"
                    + str(row["Date"])
                    + "' END "
                )
                cursor = db.run(query)

                es_data = {
                    "ontology_id": ontology_id,
                    "variable_id": row["Variable ID"],
                    "ontology_name": row["Crop"],
                    "crop": row["Crop"],
                    "name": row["Variable name"],
                    "variable_name": row["Variable name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "variable",
                    "term_id": row["Variable ID"],
                }  # Root
                if row["Variable synonyms"]:
                    es_data["variable_synonyms"] = row["Variable synonyms"]
                if row["Context of use"]:
                    es_data["context_of_use"] = row["Context of use"]
                if row["Growth stage"]:
                    es_data["growth_stage"] = row["Growth stage"]
                if row["Variable status"]:
                    es_data["variable_status"] = row["Variable status"]
                if row["Variable Xref"]:
                    es_data["variable_xref"] = row["Variable Xref"]
                if row["Institution"]:
                    es_data["institution"] = row["Institution"]
                if row["Scientist"]:
                    es_data["scientist"] = row["Scientist"]
                if row["Date"]:
                    es_data["date"] = row["Date"]

                if not term_index.term_exists(row["Variable ID"]):
                    term_index.add_term(row["Variable ID"], es_data)
                else:
                    term_index.update_term(row["Variable ID"], es_data)
            ### Trait
            for index, row in df_trait.iterrows():
                ## Trait
                query = (
                    "MERGE (a:Trait {id: '"
                    + row["Trait ID"]
                    + "' }) "
                    + "SET a.id = '"
                    + row["Trait ID"]
                    + "' "
                    + "SET a.trait_id = '"
                    + row["Trait ID"]
                    + "' "
                    + "SET a.name = '"
                    + row["Trait name"]
                    + "' "
                    + "SET a.trait_name = '"
                    + row["Trait name"]
                    + "' "
                    + "SET a.created_at = '"
                    + date
                    + "' "
                    + "SET a.language = '"
                    + row["Language"]
                    + "' "
                    + "SET a.term_type = 'trait' "
                    + "SET a.ontology_name = '"
                    + row["Crop"]
                    + "' "
                    + "SET a.ontology_id = '"
                    + ontology_id
                    + "' "
                    + "SET a.trait_class = CASE trim('"
                    + row["Trait class"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Trait class"]
                    + "' END "
                    + "SET a.trait_description = CASE trim('"
                    + row["Trait description"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Trait description"]
                    + "' END "
                    + "SET a.trait_synonym = CASE trim('"
                    + row["Trait synonyms"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Trait synonyms"]
                    + "' END "
                    + "SET a.main_trait_abbreviation = CASE trim('"
                    + row["Main trait abbreviation"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Main trait abbreviation"]
                    + "' END "
                    + "SET a.alternative_trait_abbreviations = CASE trim('"
                    + row["Alternative trait abbreviations"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Alternative trait abbreviations"]
                    + "' END "
                    + "SET a.entity = CASE trim('"
                    + row["Entity"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Entity"]
                    + "' END "
                    + "SET a.attribute = CASE trim('"
                    + row["Attribute"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Attribute"]
                    + "' END "
                    + "SET a.trait_status = CASE trim('"
                    + row["Trait status"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Trait status"]
                    + "' END "
                    + "SET a.trait_xref = CASE trim('"
                    + row["Trait Xref"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Trait Xref"]
                    + "' END "
                )
                cursor = db.run(query)

                ## Trait
                es_data = {
                    "ontology_id": ontology_id,
                    "trait_id": row["Trait ID"],
                    "ontology_name": row["Crop"],
                    "name": row["Trait name"],
                    "trait_name": row["Trait name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "trait",
                    "term_id": row["Trait ID"],
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

                if not term_index.term_exists(row["Trait ID"]):
                    term_index.add_term(row["Trait ID"], es_data)
                else:
                    term_index.update_term(row["Trait ID"], es_data)
            ### Method
            for index, row in df_method.iterrows():
                query = (
                    "MERGE (a:Method {id: '"
                    + row["Method ID"]
                    + "' }) "
                    + "SET a.id = '"
                    + row["Method ID"]
                    + "' "
                    + "SET a.method_id = '"
                    + row["Method ID"]
                    + "' "
                    + "SET a.name = '"
                    + row["Method name"]
                    + "' "
                    + "SET a.method_name = '"
                    + row["Method name"]
                    + "' "
                    + "SET a.created_at = '"
                    + date
                    + "' "
                    + "SET a.language = '"
                    + row["Language"]
                    + "' "
                    + "SET a.term_type = 'method' "
                    + "SET a.ontology_name = '"
                    + row["Crop"]
                    + "' "
                    + "SET a.ontology_id = '"
                    + ontology_id
                    + "' "
                    + "SET a.method_reference = CASE trim('"
                    + row["Method reference"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Method reference"]
                    + "' END "
                    + "SET a.method_class = CASE trim('"
                    + row["Method class"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Method class"]
                    + "' END "
                    + "SET a.method_description = CASE trim('"
                    + row["Method description"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Method description"]
                    + "' END "
                    + "SET a.formula = CASE trim('"
                    + str(row["Formula"])
                    + "') WHEN '' THEN null ELSE '"
                    + str(row["Formula"])
                    + "' END "
                )
                cursor = db.run(query)
                es_data = {
                    "ontology_id": ontology_id,
                    "method_id": row["Method ID"],
                    "ontology_name": row["Crop"],
                    "name": row["Method name"],
                    "method_name": row["Method name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "method",
                    "term_id": row["Method ID"],
                }
                if row["Method class"]:
                    es_data["method_class"] = row["Method class"]
                if row["Method description"]:
                    es_data["method_description"] = row["Method description"]
                if row["Formula"]:
                    es_data["formula"] = row["Formula"]
                if row["Method reference"]:
                    es_data["method_reference"] = row["Method reference"]

                if not term_index.term_exists(row["Method ID"]):
                    term_index.add_term(row["Method ID"], es_data)
                else:
                    term_index.update_term(row["Method ID"], es_data)
            ### Scale
            for index, row in df_scale.iterrows():
                query = (
                    "MERGE (a:Scale {id: '"
                    + row["Scale ID"]
                    + "' }) "
                    + "SET a.id = '"
                    + row["Scale ID"]
                    + "' "
                    + "SET a.scale_id = '"
                    + row["Scale ID"]
                    + "' "
                    + "SET a.name = '"
                    + row["Scale name"]
                    + "' "
                    + "SET a.scale_name = '"
                    + row["Scale name"]
                    + "' "
                    + "SET a.created_at = '"
                    + date
                    + "' "
                    + "SET a.language = '"
                    + row["Language"]
                    + "' "
                    + "SET a.term_type = 'scale' "
                    + "SET a.ontology_name = '"
                    + row["Crop"]
                    + "' "
                    + "SET a.ontology_id = '"
                    + ontology_id
                    + "' "
                    + "SET a.scale_class = CASE trim('"
                    + row["Scale class"]
                    + "') WHEN '' THEN null ELSE '"
                    + row["Scale class"]
                    + "' END "
                    ##+ "SET a.decimal_places = CASE trim('"
                    ##+ str(row["Decimal places"])
                    ##+ "') WHEN '' THEN null ELSE '"
                    ##+ str(row["Decimal places"])
                    ##+ "' END "
                    ##+ "SET a.lower_limit = CASE trim('"
                    ##+ str(row["Lower limit"])
                    ##+ "') WHEN '' THEN null ELSE '"
                    ##+ str(row["Lower limit"])
                    ##+ "' END "
                    ##+ "SET a.upper_limit = CASE trim('"
                    ##+ str(row["Upper limit"])
                    ##+ "') WHEN '' THEN null ELSE '"
                    ##+ str(row["Upper limit"])
                    ##+ "' END "
                    + "SET a.scale_xref = CASE trim('"
                    + str(row["Scale Xref"])
                    + "') WHEN '' THEN null ELSE '"
                    + str(row["Scale Xref"])
                    + "' END "
                )
                ## old vs new TD 5
                if "Category 1" in row:
                    i = 1
                    while "Category " + str(i) in row:
                        if row["Category " + str(i)]:
                            query += (
                                "SET a.category_"
                                + str(i)
                                + " = '"
                                + str(row["Category " + str(i)])
                                + "' "
                            )
                        i += 1
                else: 
                    i = 1
                    while "Cat " + str(i) + " code" in row:
                        if row["Cat " + str(i) + " code"]:
                            query += (
                                "SET a.category_"
                                + str(i)
                                + " = '"
                                + str(row["Cat " + str(i) + " code"]) + "=" + str(row["Cat " + str(i) + " description"])
                                + "' "
                            )
                        i += 1
                cursor = db.run(query)
                es_data = {
                    "ontology_id": ontology_id,
                    "scale_id": row["Scale ID"],
                    "ontology_name": row["Crop"],
                    "name": row["Scale name"],
                    "scale_name": row["Scale name"],
                    "root": "false",
                    "obsolete": "false",
                    "created_at": date,
                    "language": row["Language"],
                    "term_type": "scale",
                    "term_id": row["Scale ID"],
                }
                if row["Scale class"]:
                    es_data["scale_class"] = row["Scale class"]
                ##if row["Decimal places"]:
                    ##es_data["decimal_places"] = str(row["Decimal places"])
                ##if row["Lower limit"]:
                    ##es_data["lower_limit"] = str(row["Lower limit"])
                ##if row["Upper limit"]:
                    ##es_data["upper_limit"] = str(row["Upper limit"])
                if row["Scale Xref"]:
                    es_data["scale_xref"] = row["Scale Xref"]

                
                if "Category 1" in row:
                    i = 1
                    while "Category {}".format(i) in row:
                        if row["Category {}".format(i)]:
                            es_data["category_{}".format(i)] = str(
                                row["Category {}".format(i)]
                            )
                        i += 1
                else:
                    i = 1
                    while "Cat " + str(i) + " code" in row:
                        if row["Cat " + str(i) + " code"]:
                            es_data["category_{}".format(i)] = str(
                                str(row["Cat " + str(i) + " code"]) + "=" + str(row["Cat " + str(i) + " description"])
                            )
                        i += 1

                if not term_index.term_exists(row["Scale ID"]):
                    term_index.add_term(row["Scale ID"], es_data)
                else:
                    term_index.update_term(row["Scale ID"], es_data)
            ### Trait Class
            for index, row in df_traitClass.iterrows():
                ## ROOT
                if index == 0:
                    # add the root if not exists
                    query = (
                        "MERGE (a:Term{id: '"
                        + ontology_id
                        + ":ROOT', ontology_id: '"
                        + ontology_id
                        + "'}) ON CREATE SET a:Term, a.id = '"
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
                ## Trait Class
                query = (
                    "MERGE (a:Term {id: '"
                    + ontology_id
                    + ":"
                    + row["Trait class"]
                    + "' }) "
                    + "SET a.id = '"
                    + ontology_id
                    + ":"
                    + row["Trait class"]
                    + "' "
                    + "SET a.name = '"
                    + row["Trait class"]
                    + "' "
                    + "SET a.created_at = '"
                    + date
                    + "' "
                    + "SET a.language = '"
                    + row["Language"]
                    + "' "
                    + "SET a.term_type = 'term' "
                    + "SET a.ontology_name = '"
                    + row["Crop"]
                    + "' "
                    + "SET a.ontology_id = '"
                    + ontology_id
                    + "' "
                )
                cursor = db.run(query)

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
            ### adding links to variable
            for index, row in df_link_var.iterrows():
                query = (
                    "MATCH (a:Variable), (b:Trait) "
                    + "WHERE a.id = '"
                    + row["Variable ID"]
                    + "' AND b.id = '"
                    + row["Trait ID"]
                    + "' "
                    + "MERGE (a)-[r:VARIABLE_OF]->(b) "
                )
                db.run(query)
                query = (
                    "MATCH (a:Variable), (b:Method) "
                    + "WHERE a.id = '"
                    + row["Variable ID"]
                    + "' AND b.id = '"
                    + row["Method ID"]
                    + "' "
                    + "MERGE (a)-[r:VARIABLE_OF]->(b) "
                )
                db.run(query)
                query = (
                    "MATCH (a:Variable), (b:Scale) "
                    + "WHERE a.id = '"
                    + row["Variable ID"]
                    + "' AND b.id = '"
                    + row["Scale ID"]
                    + "' "
                    + "MERGE (a)-[r:VARIABLE_OF]->(b) "
                )
                db.run(query)
            ### adding scale of links
            for index, row in df_link_scaleof.iterrows():
                query = (
                    "MATCH (a:Scale), (b:Method) "
                    + "WHERE a.id = '"
                    + row["Scale ID"]
                    + "' AND b.id = '"
                    + row["Method ID"]
                    + "' "
                    + "MERGE (a)-[r:SCALE_OF]->(b) "
                )
                db.run(query)
            ### adding method of links
            for index, row in df_link_methodof.iterrows():
                query = (
                    "MATCH (a:Method), (b:Trait) "
                    + "WHERE a.id = '"
                    + row["Method ID"]
                    + "' AND b.id = '"
                    + row["Trait ID"]
                    + "' "
                    + "MERGE (a)-[r:METHOD_OF]->(b) "
                )
                db.run(query)
            ### adding trait class links
            for index, row in df_link_trait.iterrows():
                ## link trait - trait class - root
                query = (
                    "MATCH (a:Trait), (b:Term) "
                    + "WHERE a.id = '"
                    + row["Trait ID"]
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

            # ## save df as csv and insert
            repository_path = self.request.registry.settings.get("repository.path")
            paths = ["tmp"]
            temp_path = os.path.join(repository_path, *paths)
            if not os.path.exists(temp_path):
                os.makedirs(temp_path)

            ontology_name = ontology_data['ontology_name'].lower().replace(" ", "_")
            repo_name = f'{ontology_id}-{ontology_name}-traits'
            file_name = f"{ontology_name}_TD.csv"
            paths = ["tmp", str(uuid.uuid4()) + ".csv"]
            csv_path = os.path.join(repository_path, *paths)

            df_var.to_csv(csv_path, encoding='utf-8', index=False)

            github_token = self.request.registry.settings.get("github_token")

            update_github_file(csv_path, file_name, repo_name, github_token)

            # query = ("USING PERIODIC COMMIT 500 LOAD CSV WITH HEADERS FROM 'file:///"+csv+"' AS row "+
            #     "MERGE (m:Variable {id: row.Variable_ID, variable_id: row.Variable_ID, name: row.Variale_name,  variable_name: row.Variale_name, "+
            #     "ontology_id: '"+ontology_id+"', ontology_name: '"+crop+"', crop: '"+crop+"', created_at: '"+date+"', language: '"+language+"', term_type: row.variable }) " +
            #     "SET m.variable_synonyms = CASE trim(row.Variable_synonyms) WHEN '' THEN null ELSE row.Variable_synonyms END"
            #     )
            # cursor = db.run(query)

            self.request.session.flash(self._("The file was uploaded successfully"))
            self.returnRawViewResult = True
            return HTTPFound(location=self.request.route_url("home"))


class OntologyVersionView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True

        ontology_id = self.request.matchdict["ontology_id"]

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        query = (
            "MATCH (n) WHERE n.ontology_id CONTAINS '"
            + ontology_id
            + "'  RETURN DISTINCT n.ontology_id ORDER BY n.ontology_id DESC"
        )

        cursor = db.run(query)

        ret = {}

        for an_item in cursor:
            if len(an_item["n.ontology_id"].split("_")) > 2:
                ret["version " + an_item["n.ontology_id"].split("_")[-1]] = an_item[
                    "n.ontology_id"
                ]
            else:
                ret["current version"] = an_item["n.ontology_id"]

        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)
        json_data = json.dumps(ret, indent=4, default=str)
        response.text = json_data
        return response


class CompareVersionView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True

        ##these are ontology IDs
        version2 = self.request.matchdict["current"]
        version1 = self.request.matchdict["old"]

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        ## results
        ret = {}
        ## are two old versions compared
        old = False

        ## check id IDs have disapeared/appeared
        ids_v1 = []
        ids_v2 = []
        query = (
            "MATCH (n) WHERE n.ontology_id ='"
            + version1
            + "' return n.term_id ORDER BY n.term_id DESC"
        )
        cursor = db.run(query)
        for an_item in cursor:
            ids_v1.append(an_item["n.term_id"])

        query = (
            "MATCH (n) WHERE n.ontology_id ='"
            + version2
            + "' return n.id ORDER BY n.id DESC"
        )
        cursor = db.run(query)
        for an_item in cursor:
            ids_v2.append(an_item["n.id"])

        if None in ids_v2:
            ## comparing 2 old version
            old = True
            query = (
                "MATCH (n) WHERE n.ontology_id ='"
                + version2
                + "' return n.term_id ORDER BY n.term_id DESC"
            )
            cursor = db.run(query)
            for an_item in cursor:
                ids_v2.append(an_item["n.term_id"])

        ## IDs that have disapeared between the new and the old versions
        one_not_two = set(ids_v1).difference(ids_v2)
        ret["IDs deleted"] = list(one_not_two)

        ## IDs created in the new version
        two_not_one = set(ids_v2).difference(ids_v1)
        ret["IDs created"] = list(two_not_one)

        ## IDs in common
        common = set(ids_v1).intersection(ids_v1)
        diffs = {}
        for e in common:
            if old:
                query = (
                    "MATCH (n{term_id:'"
                    + e
                    + "',ontology_id:'"
                    + version1
                    + "'}) "
                    + "MATCH (m{term_id:'"
                    + e
                    + "',ontology_id:'"
                    + version2
                    + "'}) "
                    + "WITH n,m "
                    + "RETURN apoc.diff.nodes(n,m)"
                )
            else:
                query = (
                    "MATCH (n{term_id:'"
                    + e
                    + "',ontology_id:'"
                    + version1
                    + "'}) "
                    + "MATCH (m{id:'"
                    + e
                    + "',ontology_id:'"
                    + version2
                    + "'}) "
                    + "WITH n,m "
                    + "RETURN apoc.diff.nodes(n,m)"
                )
            cursor = db.run(query)
            for an_item in cursor:
                leftOnly, rightOnly, different = None, None, None

                if "leftOnly" in an_item["apoc.diff.nodes(n,m)"]:
                    if "id" in an_item["apoc.diff.nodes(n,m)"]["leftOnly"]:
                        an_item["apoc.diff.nodes(n,m)"]["leftOnly"].pop("id")
                    if "term_id" in an_item["apoc.diff.nodes(n,m)"]["leftOnly"]:
                        an_item["apoc.diff.nodes(n,m)"]["leftOnly"].pop("term_id")
                    if an_item["apoc.diff.nodes(n,m)"]["leftOnly"]:
                        leftOnly = an_item["apoc.diff.nodes(n,m)"]["leftOnly"]
                if "rightOnly" in an_item["apoc.diff.nodes(n,m)"]:
                    if "id" in an_item["apoc.diff.nodes(n,m)"]["rightOnly"]:
                        an_item["apoc.diff.nodes(n,m)"]["rightOnly"].pop("id")
                    if "term_id" in an_item["apoc.diff.nodes(n,m)"]["rightOnly"]:
                        an_item["apoc.diff.nodes(n,m)"]["rightOnly"].pop("term_id")
                    if an_item["apoc.diff.nodes(n,m)"]["rightOnly"]:
                        rightOnly = an_item["apoc.diff.nodes(n,m)"]["rightOnly"]
                if "different" in an_item["apoc.diff.nodes(n,m)"]:
                    if "ontology_id" in an_item["apoc.diff.nodes(n,m)"]["different"]:
                        an_item["apoc.diff.nodes(n,m)"]["different"].pop("ontology_id")
                    if "created_at" in an_item["apoc.diff.nodes(n,m)"]["different"]:
                        an_item["apoc.diff.nodes(n,m)"]["different"].pop("created_at")
                    if an_item["apoc.diff.nodes(n,m)"]["different"]:
                        different = an_item["apoc.diff.nodes(n,m)"]["different"]

                if leftOnly or rightOnly or different:
                    diffs[e] = {}
                    diffs[e] = {
                        "old version (left)": leftOnly,
                        "new version (right)": rightOnly,
                        "attributes updated": different,
                    }
        ret["changes"] = diffs

        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)
        json_data = json.dumps(ret, indent=4, default=str)
        response.text = json_data
        return response
