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
        'Match (trait {id:"'
        + term_id
        + '"}) <-[VARIABLE_OF]-(op {term_type: "variable"})'
        "return distinct op.id, op.name"
    )
    cursor = db.run(query)
    variables = []
    for an_item in cursor:
        variables.append({"id": an_item["op.id"], "name": an_item["op.name"]})
    return variables


def get_trait(db, term_id):
    query = (
        'Match (variable {id:"'
        + term_id
        + '"}) -[VARIABLE_OF]->(trait {term_type: "trait"}) return trait'
    )
    cursor = db.run(query)
    trait = get_neo_result(cursor, "trait")
    if trait:
        trait = trait[0]
    return trait


def get_method(db, term_id):
    query = (
        'Match (variable {id:"'
        + term_id
        + '"}) -[VARIABLE_OF]->(method {term_type: "method"}) return method'
    )
    cursor = db.run(query)
    method = get_neo_result(cursor, "method")
    if method:
        method = method[0]
    return method


def get_scale(db, term_id):
    query = (
        'Match (variable {id:"'
        + term_id
        + '"}) -[VARIABLE_OF]->(scale {term_type: "scale"}) return scale'
    )
    cursor = db.run(query)
    scale = get_neo_result(cursor, "scale")
    if scale:
        scale = scale[0]
    return scale


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
                        "datafiles": [],
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
                    + '"}) where (not trait.trait_status =~ "(?i).*obsolete.*" or NOT EXISTS(trait.trait_status)) return count(trait) as total_traits'
                )
                cursor = db.run(query)
                result = get_neo_result(cursor, "total_traits")
                total_traits = result[0]
                item_collection = range(total_traits)
                a_page = paginate.Page(item_collection, current_page, page_size)
                query = (
                    'match (trait:Trait {ontology_id: "'
                    + trait_id
                    + '"}) where (not trait.trait_status =~ "(?i).*obsolete.*" or NOT EXISTS(trait.trait_status)) return trait SKIP '
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
                        "datafiles": [],
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
                "match (trait:Trait) where (not trait.trait_status =~ '(?i).*obsolete.*' or NOT EXISTS(trait.trait_status)) return trait SKIP "
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
                    "datafiles": [],
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


class BRAPIVariablesView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        variable_id = self.request.matchdict.get("variable_id")
        by_ontology = True
        if variable_id is not None:
            if variable_id.find(":") >= 0:
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

        if variable_id is not None:
            if not by_ontology:
                query = 'match (variable {id: "' + variable_id + '"}) return variable'
                cursor = db.run(query)
                result = get_neo_result(cursor, "variable")
                ret = {
                    "metadata": {
                        "pagination": {
                            "pageSize": 1,
                            "currentPage": 0,
                            "totalCount": 1,
                            "totalPages": 1,
                        },
                        "status": [],
                        "datafiles": [],
                    },
                    "result": {},
                }
                if result:
                    result = result[0]
                    ret_result = {
                        "observationVariableDbId": variable_id,
                        "name": result["name"],
                        "ontologyDbId": result["ontology_id"],
                        "ontologyName": result["crop"],
                        "synonyms": result[
                            "variable_synonyms"
                        ],  ##need to be an array .split(',')
                        "contextOfUse": result["context_of_use"],
                        "growthStage": result["growth_stage"],
                        "status": result["variable_status"],
                        "xref": result["variable_xref"],
                        "institution": result["institution"],
                        "scientist": result["scientist"],
                        "date": result["date"],
                        "language": result["language"],
                        "crop": result["crop"],
                        "defaultValue": None,
                    }
                    trait = get_trait(db, variable_id)
                    ret_result["trait"] = {
                        "traitDbId": trait["id"],
                        "name": trait["name"],
                        "class": trait["trait_class"],
                        "description": trait["trait_description"],
                        "synonyms": trait["trait_synonym"],  ##need to be an array
                        "mainAbbreviation": trait["main_trait_abbreviation"],
                        "alternativeAbbreviations": trait["alternative_abbreviation"],
                        "entity": trait["entity"],
                        "attribute": trait["attribute"],
                        "status": trait["trait_status"],
                        "xref": trait["trait_xref"],
                    }
                    method = get_method(db, variable_id)
                    ret_result["method"] = {
                        "methodDbId": method["id"],
                        "name": method["name"],
                        "class": method["method_class"],
                        "description": method["method_description"],
                        "formula": method["formula"],
                        "reference": method["method_reference"],
                    }

                    scale = get_scale(db, variable_id)
                    categories = []
                    i = 1
                    while scale["category_" + str(i)]:
                        categories.append(scale["category_" + str(i)])
                        i += 1

                    ret_result["scale"] = {
                        "scaleDbId": scale["id"],
                        "name": scale["name"],
                        "dataType": scale["scale_class"],
                        "decimalPlaces": scale["decimal_places"],
                        "xref": scale["scale_xref"],
                        "validValues": {
                            "min": scale["lower_limit"],
                            "max": scale["upper limit"],
                            "categories": categories,
                        },
                    }

                    ret["result"] = ret_result
            else:
                if variable_id == "datatypes":
                    ret = {
                        "metadata": {
                            "pagination": {
                                "pageSize": 1,
                                "currentPage": 0,
                                "totalCount": 7,
                                "totalPages": 1,
                            },
                            "status": [],
                            "datafiles": [],
                        },
                        "result": [],
                    }

                    ret["result"] = {
                        "data": [
                            "Code",
                            "Duration",
                            "Nominal",
                            "Numerical",
                            "Ordinal",
                            "Text",
                            "Date",
                        ]
                    }

                else:
                    query = (
                        'match (variable:Variable {ontology_id: "'
                        + variable_id
                        + '"}) where (not variable.variable_status =~ "(?i).*obsolete.*" or NOT EXISTS(variable.variable_status)) return count(variable) as total_variables'
                    )
                    cursor = db.run(query)
                    result = get_neo_result(cursor, "total_variables")
                    total_variables = result[0]
                    item_collection = range(total_variables)
                    a_page = paginate.Page(item_collection, current_page, page_size)
                    query = (
                        'match (variable:Variable {ontology_id: "'
                        + variable_id
                        + '"}) where (not variable.variable_status =~ "(?i).*obsolete.*" or NOT EXISTS(variable.variable_status)) return variable SKIP '
                        + str(a_page.first_item - 1)
                        + " LIMIT "
                        + str(page_size)
                    )
                    cursor = db.run(query)
                    variables = get_neo_result(cursor, "variable")

                    ret = {
                        "metadata": {
                            "pagination": {
                                "pageSize": page_size,
                                "currentPage": current_page,
                                "totalCount": total_variables,
                                "totalPages": a_page.page_count,
                            },
                            "status": [],
                            "datafiles": [],
                        },
                        "result": [],
                    }

                    for a_variable in variables:
                        ret_result = {
                            "observationVariableDbId": a_variable["id"],
                            "name": a_variable["name"],
                            "ontologyDbId": a_variable["ontology_id"],
                            "ontologyName": a_variable["crop"],
                            "synonyms": a_variable[
                                "variable_synonyms"
                            ],  ##need to be an array .split(',')
                            "contextOfUse": a_variable["context_of_use"],
                            "growthStage": a_variable["growth_stage"],
                            "status": a_variable["variable_status"],
                            "xref": a_variable["variable_xref"],
                            "institution": a_variable["institution"],
                            "scientist": a_variable["scientist"],
                            "date": a_variable["date"],
                            "language": a_variable["language"],
                            "crop": a_variable["crop"],
                            "defaultValue": None,
                        }
                        trait = get_trait(db, a_variable["id"])
                        ret_result["trait"] = {
                            "traitDbId": trait["id"],
                            "name": trait["name"],
                            "class": trait["trait_class"],
                            "description": trait["trait_description"],
                            "synonyms": trait["trait_synonym"],  ##need to be an array
                            "mainAbbreviation": trait["main_trait_abbreviation"],
                            "alternativeAbbreviations": trait[
                                "alternative_abbreviation"
                            ],
                            "entity": trait["entity"],
                            "attribute": trait["attribute"],
                            "status": trait["trait_status"],
                            "xref": trait["trait_xref"],
                        }
                        method = get_method(db, a_variable["id"])
                        ret_result["method"] = {
                            "methodDbId": method["id"],
                            "name": method["name"],
                            "class": method["method_class"],
                            "description": method["method_description"],
                            "formula": method["formula"],
                            "reference": method["method_reference"],
                        }

                        scale = get_scale(db, a_variable["id"])
                        categories = []
                        i = 1
                        while scale["category_" + str(i)]:
                            categories.append(scale["category_" + str(i)])
                            i += 1

                        ret_result["scale"] = {
                            "scaleDbId": scale["id"],
                            "name": scale["name"],
                            "dataType": scale["scale_class"],
                            "decimalPlaces": scale["decimal_places"],
                            "xref": scale["scale_xref"],
                            "validValues": {
                                "min": scale["lower_limit"],
                                "max": scale["upper limit"],
                                "categories": categories,
                            },
                        }

                        ret["result"].append(ret_result)
        else:
            query = (
                "match (variable:Variable) return count(variable) as total_variables"
            )
            cursor = db.run(query)
            result = get_neo_result(cursor, "total_variables")
            total_variables = result[0]
            item_collection = range(total_variables)
            a_page = paginate.Page(item_collection, current_page, page_size)
            query = (
                "match (variable:Variable) where (not variable.variable_status =~ '(?i).*obsolete.*' or NOT EXISTS(variable.variable_status)) return variable SKIP "
                + str(a_page.first_item - 1)
                + " LIMIT "
                + str(page_size)
            )
            cursor = db.run(query)
            variables = get_neo_result(cursor, "variable")

            ret = {
                "metadata": {
                    "pagination": {
                        "pageSize": page_size,
                        "currentPage": current_page,
                        "totalCount": total_variables,
                        "totalPages": a_page.page_count,
                    },
                    "status": [],
                    "datafiles": [],
                },
                "result": [],
            }

            for a_variable in variables:
                ret_result = {
                    "observationVariableDbId": a_variable["id"],
                    "name": a_variable["name"],
                    "ontologyDbId": a_variable["ontology_id"],
                    "ontologyName": a_variable["crop"],
                    "synonyms": a_variable[
                        "variable_synonyms"
                    ],  ##need to be an array .split(',')
                    "contextOfUse": a_variable["context_of_use"],
                    "growthStage": a_variable["growth_stage"],
                    "status": a_variable["variable_status"],
                    "xref": a_variable["variable_xref"],
                    "institution": a_variable["institution"],
                    "scientist": a_variable["scientist"],
                    "date": a_variable["date"],
                    "language": a_variable["language"],
                    "crop": a_variable["crop"],
                    "defaultValue": None,
                }
                trait = get_trait(db, a_variable["id"])
                ret_result["trait"] = {
                    "traitDbId": trait["id"],
                    "name": trait["name"],
                    "class": trait["trait_class"],
                    "description": trait["trait_description"],
                    "synonyms": trait["trait_synonym"],  ##need to be an array
                    "mainAbbreviation": trait["main_trait_abbreviation"],
                    "alternativeAbbreviations": trait["alternative_abbreviation"],
                    "entity": trait["entity"],
                    "attribute": trait["attribute"],
                    "status": trait["trait_status"],
                    "xref": trait["trait_xref"],
                }
                method = get_method(db, a_variable["id"])
                ret_result["method"] = {
                    "methodDbId": method["id"],
                    "name": method["name"],
                    "class": method["method_class"],
                    "description": method["method_description"],
                    "formula": method["formula"],
                    "reference": method["method_reference"],
                }

                scale = get_scale(db, a_variable["id"])
                categories = []
                i = 1
                while scale["category_" + str(i)]:
                    categories.append(scale["category_" + str(i)])
                    i += 1

                ret_result["scale"] = {
                    "scaleDbId": scale["id"],
                    "name": scale["name"],
                    "dataType": scale["scale_class"],
                    "decimalPlaces": scale["decimal_places"],
                    "xref": scale["scale_xref"],
                    "validValues": {
                        "min": scale["lower_limit"],
                        "max": scale["upper limit"],
                        "categories": categories,
                    },
                }

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
                "datafiles": [],
            },
            "result": {},
        }

        ret["result"] = {"data": []}
        ret["result"]["data"] = [
            {"call": "traits", "datatypes": ["json"], "methods": ["GET"]},
            {"call": "traits/{traitDbId}", "datatypes": ["json"], "methods": ["GET"]},
            {"call": "variables/datatypes", "datatypes": ["json"], "methods": ["GET"]},
            {"call": "variables", "datatypes": ["json"], "methods": ["GET"]},
            {
                "call": "variables/{observationVariableDbId}",
                "datatypes": ["json"],
                "methods": ["GET"],
            },
            {"call": "ontologies", "datatypes": ["json"], "methods": ["GET"]},
        ]

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
            if ontology["category"] == "300-499 Phenotype and Trait Ontology":
                total_ontologies += 1

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
                "datafiles": [],
            },
            "result": {},
        }

        ret["result"] = {"data": [a_page]}

        json_data = to_json(ret)
        response.text = json_data
        return response
