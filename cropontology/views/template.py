from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase
import paginate
import pymongo
import pandas
from datetime import datetime


class TemplateLoadView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True

        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        terms = []

        ## should be coming from the form
        ontology_id = self.request.matchdict["ontology_id"]

        ## read excel file - should read file uploaded
        ## CHANGE HERE
        template = "/Users/marie-angeliquelaporte/Downloads/TD_test.xlsx"

        td = pandas.read_excel(template, sheet_name="Template for submission")

        ## check that names are never empty - RETURN error if they are
        nan_cols = [i for i in td.columns if td[i].isnull().any()]
        if (
            "Variable name" in nan_cols
            or "Trait name " in nan_cols
            or "Method name" in nan_cols
            or "Scale name" in nan_cols
        ):
            response = Response(headerlist=headers, status=400)
            response.text = "Names should not be empty"
            return response

        ## fill na with empty string
        td.fillna("", inplace=True)

        term_ID = 0  ## to be used when an ID is empty

        date = datetime.today().strftime("%Y-%m-%d-%H:%M:%S")

        ##check if ontology exists and get last term ID used
        query = (
            "MATCH (n{ontology_id:'"
            + ontology_id
            + "'}) return n.id order by n.id DESC"
        )
        cursor = db.run(query)
        for nid in cursor:
            try:
                term_ID = int(nid[0].split(":")[1])
                break
            except ValueError:
                continue

        ## parse the file
        for index, row in td.iterrows():
            if index == 0:
                ## add the root if not exists
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
                    + " traits' , a.root = 'true' , "
                    + " a.obsolete = 'false' , a.created_at = '"
                    + date
                    + "' , a.language = '"
                    + row["Language"]
                    + "' , "
                    + " a.term_type = 'term' RETURN a"
                )
                db.run(query)

            ## create variable
            ## check if ID is empty
            var_id = row["Variable ID"]
            if not var_id:
                var_id = ontology_id + ":" + str(term_ID + 1).zfill(7)
                term_ID += 1

            #### mandatory fields
            ## ON CREATE
            query = (
                "MERGE (a:Variable{name: '"
                + row["Variable name"]
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

            #### other fieds - need to check if exist
            if row["Variable synonyms"]:
                query += ", a.variable_synonyms = '" + row["Variable synonyms"] + "' "
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

            ## ON MATCH
            query += (
                " ON MATCH SET a.id = '"
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

            #### other fieds - need to check if exist
            if row["Variable synonyms"]:
                query += ", a.variable_synonyms = '" + row["Variable synonyms"] + "' "
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
            db.run(query)

            ## create trait
            trait_id = row["Trait ID"]
            if not trait_id:
                trait_id = ontology_id + ":" + str(term_ID + 1).zfill(7)
                term_ID += 1
            #### mandatory fields
            ## ON CREATE
            query = (
                "MERGE (a:Trait{name:'"
                + row["Trait name"]
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
            #### other fieds - need to check if exist
            if row["Trait description"]:
                query += ", a.trait_description = '" + row["Trait description"] + "' "
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

            ## ON MATCH
            query += (
                " ON MATCH SET a.id = '"
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
            #### other fieds - need to check if exist
            if row["Trait description"]:
                query += ", a.trait_description = '" + row["Trait description"] + "' "
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
            db.run(query)

            ## create method
            method_id = row["Method ID"]
            if not method_id:
                method_id = ontology_id + ":" + str(term_ID + 1).zfill(7)
                term_ID += 1
            ## ON CREATE
            #### mandatory field
            query = (
                "MERGE (a:Method{name: '"
                + row["Method name"]
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
            #### other fieds - need to check if exist
            if row["Method description"]:
                query += ", a.method_description = '" + row["Method description"] + "' "
            if row["Formula"]:
                query += ", a.formula = '" + row["Formula"] + "' "
            if row["Method reference"]:
                query += ", a.method_reference = '" + row["Method reference"] + "' "
            ## ON MATHC
            #### mandatory field
            query += (
                " ON MATCH SET a.id = '"
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
            #### other fieds - need to check if exist
            if row["Method description"]:
                query += ", a.method_description = '" + row["Method description"] + "' "
            if row["Formula"]:
                query += ", a.formula = '" + row["Formula"] + "' "
            if row["Method reference"]:
                query += ", a.method_reference = '" + row["Method reference"] + "' "

            query += " RETURN a "
            db.run(query)

            ## create scale
            scale_id = row["Scale ID"]
            if not scale_id:
                scale_id = ontology_id + ":" + str(term_ID + 1).zfill(7)
                term_ID += 1
            ### ON CREATE
            #### mandatory fields
            query = (
                "MERGE (a:Scale {name: '"
                + row["Scale name"]
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
            #### other fieds - need to check if exist
            if row["Decimal places"]:
                query += ", a.decimal_places = '" + str(row["Decimal places"]) + "' "
            if row["Lower limit"]:
                query += ", a.lower_limit = '" + str(row["Lower limit"]) + "' "
            if row["Upper limit"]:
                query += ", a.upper_limit = '" + str(row["Upper limit"]) + "' "
            if row["Scale Xref"]:
                query += ", a.scale_xref = '" + row["Scale Xref"] + "' "
            i = 1
            while row["Category " + str(i)]:
                query += (
                    ", a.category_" + str(i) + " = '" + row["Category " + str(i)] + "' "
                )
                i += 1
            ## ON MATCH
            query += (
                " ON MATCH SET a.id = '"
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
            #### other fieds - need to check if exist
            if row["Decimal places"]:
                query += ", a.decimal_places = '" + str(row["Decimal places"]) + "' "
            if row["Lower limit"]:
                query += ", a.lower_limit = '" + str(row["Lower limit"]) + "' "
            if row["Upper limit"]:
                query += ", a.upper_limit = '" + str(row["Upper limit"]) + "' "
            if row["Scale Xref"]:
                query += ", a.scale_xref = '" + row["Scale Xref"] + "' "
            i = 1
            while row["Category " + str(i)]:
                query += (
                    ", a.category_" + str(i) + " = '" + row["Category " + str(i)] + "' "
                )
                i += 1

            query += " RETURN a "
            db.run(query)

            ## add relationship
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

            ## add trait class
            ### test if class exists
            ### if not create class, if the node does not exist - create it: MERGE ON CREATE SET
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

        response = Response(headerlist=headers, status=200)
        response.text = "ok"
        return response
