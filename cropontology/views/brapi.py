from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase
import paginate
import pymongo


def to_json(data):
    return json.dumps(data, indent=4, default=str)


def get_neo_result(cursor, key):
    results = []
    for an_item in cursor:
        results.append(an_item[key])
    return results


def get_variables(db, term_id):
    query = (
        'Match (trait {id:"' + term_id + '"}) <-[VARIABLE_OF]-(op {term_type: "variable"})'
        "return distinct op.id, op.name"
    )
    cursor = db.run(query)
    variables = []
    for an_item in cursor:
        variables.append({"id": an_item["op.id"], "name": an_item["op.name"]})
    return variables


class BRAPITraitsView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        trait_id = self.request.matchdict.get("trait_id")
        by_ontology = True
        if trait_id is not None:
            if trait_id.find(":") >= 0:
                by_ontology = False

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()
        current_page = self.request.params.get("page", "0")
        current_page = int(current_page)
        page_size = self.request.params.get("pageSize", "10")
        page_size = int(page_size)
        if trait_id is not None:
            if not by_ontology:
                query = 'match (trait {id: "' + trait_id + '"}) return trait'
                cursor = db.run(query)
                result = get_neo_result(cursor, "trait")
                ret = {
                    "metadata": {
                        "pagination": {
                            "pageSize": 1,
                            "currentPage": 0,
                            "totalCount": 1,
                            "totalPages": 1,
                        }, 
                        "status": [],
                        "datafiles": []
                    },
                    "result": {},
                }
                if result:
                    result = result[0]
                    ret_result = {
                        "traitDbId": trait_id,
                        "traitId": trait_id,
                        "name": result["name"],
                        "defaultValue": None,
                    }
                    variables = get_variables(db, trait_id)
                    ret_result["observationVariables"] = []
                    for a_variable in variables:
                        ret_result["observationVariables"].append(a_variable["id"])
                    ret["result"] = ret_result
            else:
                query = (
                    'match (trait:Trait {ontology_id: "'
                    + trait_id
                    + '"}) where (trait.trait_status <> "Obsolete") return count(trait) as total_traits'
                )
                cursor = db.run(query)
                result = get_neo_result(cursor, "total_traits")
                total_traits = result[0]
                item_collection = range(total_traits)
                a_page = paginate.Page(item_collection, current_page, page_size)
                query = (
                    'match (trait:Trait {ontology_id: "'
                    + trait_id
                    + '"}) where (trait.trait_status <> "Obsolete") return trait SKIP '
                    + str(a_page.first_item - 1)
                    + " LIMIT "
                    + str(page_size)
                )
                cursor = db.run(query)
                traits = get_neo_result(cursor, "trait")

                ret = {
                    "metadata": {
                        "pagination": {
                            "pageSize": page_size,
                            "currentPage": current_page,
                            "totalCount": total_traits,
                            "totalPages": a_page.page_count,
                        }, 
                        "status": [],
                        "datafiles": []
                    },
                    "result": [],
                }
                for a_trait in traits:
                    ret_result = {
                        "traitDbId": a_trait["id"],
                        "traitId": a_trait["id"],
                        "name": a_trait["name"],
                        "defaultValue": None,
                    }
                    variables = get_variables(db, a_trait["id"])
                    ret_result["observationVariables"] = []
                    for a_variable in variables:
                        ret_result["observationVariables"].append(a_variable["id"])
                    ret["result"].append(ret_result)
        else:
            query = "match (trait:Trait) return count(trait) as total_traits"
            cursor = db.run(query)
            result = get_neo_result(cursor, "total_traits")
            total_traits = result[0]
            item_collection = range(total_traits)
            a_page = paginate.Page(item_collection, current_page, page_size)
            query = (
                "match (trait:Trait) where (trait.trait_status <> 'Obsolete') return trait SKIP "
                + str(a_page.first_item - 1)
                + " LIMIT "
                + str(page_size)
            )
            cursor = db.run(query)
            traits = get_neo_result(cursor, "trait")

            ret = {
                "metadata": {
                    "pagination": {
                        "pageSize": page_size,
                        "currentPage": current_page,
                        "totalCount": total_traits,
                        "totalPages": a_page.page_count,
                    }, 
                        "status": [],
                        "datafiles": []
                },
                "result": [],
            }
            for a_trait in traits:
                ret_result = {
                    "traitDbId": a_trait["id"],
                    "traitId": a_trait["id"],
                    "name": a_trait["name"],
                    "defaultValue": None,

                }
                variables = get_variables(db, a_trait["id"])
                ret_result["observationVariables"] = []
                for a_variable in variables:
                    ret_result["observationVariables"].append(a_variable["id"])
                ret["result"].append(ret_result)

        db.close()

        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)
        json_data = to_json(ret)
        response.text = json_data
        return response

class BRAPICallsView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)

        ret = {
            "metadata": {
                "pagination": {
                    "pageSize": 1,
                    "currentPage": 0,
                    "totalCount": 6,
                    "totalPages": 1,
                }, 
                "status": [],
                 "datafiles": []
            },
            "result": {},
        }

        ret["result"] = {"data" : []};
        ret["result"]["data"] = [
            { "call": "traits", "datatypes" : ["json"], "methods" : ["GET"] },
            { "call": "traits/{traitDbId}" , "datatypes" : ["json"], "methods" : ["GET"] },
            { "call": "variables/datatypes", "datatypes": ["json"], "methods": ["GET"] },
            { "call": "variables", "datatypes" : ["json"], "methods" : ["GET"] },
            { "call": "variables/{observationVariableDbId}", "datatypes" : ["json"], "methods" : ["GET"] },
            { "call": "ontologies", "datatypes" : [ "json" ], "methods" : ["GET"] }
        ];

        json_data = to_json(ret)
        response.text = json_data
        return response

class BRAPIOntologiesView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)

        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        ontology_collection = ontology_db["ontologies"]
        ontologies = list(ontology_collection.find().sort([("ontology_name", 1)]))

        current_page = self.request.params.get("page", "0")
        current_page = int(current_page)
        page_size = self.request.params.get("pageSize", "10")
        page_size = int(page_size)

        total_ontologies = 0

        data = []

        for ontology in ontologies:
            if ontology['category'] == '300-499 Phenotype and Trait Ontology':
                total_ontologies+=1

                ret_result = {
                    "ontologyDbId": ontology["ontology_id"],
                    "ontologyName": ontology["ontology_name"],
                    "auhtors": None,
                    "version": ontology["created_at"],
                    "description": ontology["ontology_summary"],
                    "copyright": None,
                    "licence": "CC BY-SA 4.0",
                }
                data.append(ret_result)

        a_page = paginate.Page(data, current_page, page_size)
       

        ret = {
            "metadata": {
                "pagination": {
                    "pageSize": page_size,
                    "currentPage": current_page,
                    "totalCount": len(data),
                    "totalPages": a_page.page_count,
                }, 
                "status": [],
                 "datafiles": []
            },
            "result": {},
        }

        ret["result"] = {"data" : [a_page]};

        json_data = to_json(ret)
        response.text = json_data
        return response