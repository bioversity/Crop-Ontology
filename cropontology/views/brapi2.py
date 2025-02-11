class Neo4jMatchBuilder:
    def __init__(self, node_label):
        self.node_label = node_label
        self.params = []

    def __str__(self):
        return getMatchString()

    def addParam(self, name, value):
        if value is not None:
            self.params.append(name + ' : "' + value + '"')
    
    def getMatchStr(self):
        return '(' + self.node_label.lower() + ':' + self.node_label + ' {' + ', '.join(self.params) + '})'

    def getMatchNameStr(self):
        return '(' + self.node_label.lower() + ')'

    def isEmpty(self):
        return not bool(self.params)


from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase
import paginate
import pymongo
import re
co_pui_re = re.compile(re.escape('https://cropontology.org/rdf/') + '(CO_\\d{1,3}\\:\\d{1,8})')

def getPriorityValue(*args):
    for arg in args:
        if arg:
            return arg

def readPUI(co_pui):
    if co_pui:
        match = co_pui_re.match(co_pui)
        if match:
            return match.group(1)
    return None



def generateQuery(
    observationVariableDbId = None,
    observationVariableName = None,
    observationVariablePUI = None,
    traitClass = None,
    methodDbId = None,
    methodName = None,
    methodPUI = None,
    scaleDbId = None,
    scaleName = None,
    scalePUI = None,
    traitDbId = None,
    traitName = None,
    traitPUI = None,
    ontologyDbId = None,
    commonCropName = None,
    programDbId = None,
    trialDbId = None,
    studyDbId = None,
    externalReferenceId = None,
    externalReferenceSource = None,):
    
    # Match Variable parameters
    variablesMatch = Neo4jMatchBuilder('Variable')
    variablesMatch.addParam('id', getPriorityValue(observationVariableDbId, readPUI(observationVariablePUI)))
    variablesMatch.addParam('name', observationVariableName)
    variablesMatch.addParam('ontology_id', ontologyDbId)
    variablesMatch.addParam('crop', commonCropName)
    # variablesMatch.addParam('?', programDbId)
    # variablesMatch.addParam('?', trialDbId)
    # variablesMatch.addParam('?', studyDbId)
    # variablesMatch.addParam('?', externalReferenceId)
    # variablesMatch.addParam('?', externalReferenceSource)

    traitMatch = Neo4jMatchBuilder('Trait')
    traitMatch.addParam('id', getPriorityValue(traitDbId, readPUI(traitPUI)))
    traitMatch.addParam('name', traitName)
    traitMatch.addParam('trait_class', traitClass)
    
    methodMatch = Neo4jMatchBuilder('Method')
    methodMatch.addParam('id', getPriorityValue(methodDbId, readPUI(methodPUI)))
    methodMatch.addParam('name', methodName)
    
    scaleMatch = Neo4jMatchBuilder('Scale')
    scaleMatch.addParam('id', getPriorityValue(scaleDbId, readPUI(scalePUI)))
    scaleMatch.addParam('name', scaleName)

    query = 'MATCH ' + variablesMatch.getMatchStr() + ' \n'

    if not traitMatch.isEmpty():
        query += 'MATCH ' + variablesMatch.getMatchNameStr() + ' -[:VARIABLE_OF]-> ' + traitMatch.getMatchStr() + ' \n'

    if not methodMatch.isEmpty():
        query += 'MATCH ' + variablesMatch.getMatchNameStr() + ' -[:VARIABLE_OF]-> ' + methodMatch.getMatchStr() + ' \n'

    if not scaleMatch.isEmpty():
        query += 'MATCH ' + variablesMatch.getMatchNameStr() + ' -[:VARIABLE_OF]-> ' + scaleMatch.getMatchStr() + ' \n'
    
    query += 'WHERE ((NOT (variable.variable_status =~ "(?i).*obsolete.*")) OR (NOT (EXISTS(variable.variable_status))) AND (NOT (variable.ontology_id =~ "(?i).*-.*"))) '

    return query

query = generateQuery(
    observationVariableDbId = 'abc',
    ontologyDbId ='123',
    commonCropName ='apple',
    # traitClass ='class',
    scalePUI = 'https://cropontology.org/rdf/CO_325:0000609',
    scaleDbId = 'CO_325:0000777'
)


def to_json(data):
    return json.dumps(data, indent=4, default=str)


def get_neo_result(cursor, key):
    results = []
    for an_item in cursor:
        results.append(an_item[key])
    return results

def get_neo_result_join(cursor):
    results = []
    for an_item in cursor:
        result = {
            "ontology_name": an_item["var.ontology_name"], 
            "trait_class": an_item["trait.trait_class"] 
        }
        results.append(result)
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



class BRAPIv2TraitsView(PublicView):
    def process_view(self):

        self.returnRawViewResult = True

        common_param = self.request.params.get("commonCropName")
        observationVariableDbId = self.request.params.get("observationVariableDbId")
        variable_id = self.request.params.get("ontologyDbId")
        traitDbId = self.request.params.get("traitDbId")
        traitClass = self.request.params.get("traitClass")



        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]



        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()



        current_page = self.request.params.get("page", "0")
        current_page = int(current_page)
        page_size = self.request.params.get("pageSize", "10")
        page_size = int(page_size)

        ret = {
            "@context": [
                "https://brapi.org/jsonld/context/metadata.jsonld"
            ],
            "metadata": {
                "datafiles": [],
                "pagination": {
                    "currentPage": current_page,
                    "pageSize": page_size,
                    "totalCount": 1, 
                    "totalPages": 1
                },
                "status": [
                    {
                        "message": "Request accepted, response successful",
                        "messageType": "INFO"
                    }
                ]
            },
            "result": {
                "data": []
            }
        }


        query = 'MATCH (trait' #:Variable) WHERE '

        if observationVariableDbId is not None:
            query += '{id: "' + observationVariableDbId + '"}) WHERE '
        else:
            query += ':Trait) WHERE '


        conditions = []

        if traitDbId is not None:
            conditions.append('trait.trait_id = "' + traitDbId + '"')

        if traitClass is not None:
            conditions.append('trait.trait_class = "' + traitClass + '"')

        if variable_id is not None:
            conditions.append('trait.ontology_id = "' + variable_id + '"')

        if common_param is not None:
            conditions.append('trait.ontology_name = "' + common_param + '"')

        if conditions:
            query += " AND ".join(conditions)
        else:
            query += "1=1"

        # query += ' AND ((NOT (variable.variable_status =~ "(?i).*obsolete.*")) OR (NOT (EXISTS(variable.variable_status))) AND (NOT (variable.ontology_id =~ "(?i).*-.*")))'

        query_count = query + ' RETURN count(trait) AS total_traits'


        cursor = db.run(query_count)
        result = get_neo_result(cursor, "total_traits")


        total_traits = result[0]
        item_collection = range(total_traits)
        a_page = paginate.Page(item_collection, current_page, page_size)
        
        query_paginated = query + ' RETURN trait SKIP ' + str(a_page.first_item - 1) + " LIMIT " + str(page_size)

        print("QUERY PAGINATED", query_paginated)
        cursor = db.run(query_paginated)
        trait = get_neo_result(cursor, "trait")
        totalpages = ((total_traits) // page_size) + 1 


        # do a full if statement w/ everything over here big bro
        if variable_id is None and common_param is None and observationVariableDbId is None and traitDbId is None and traitClass is None:
            query = "match (trait:Trait) where ((not (trait.trait_status =~ '(?i).*obsolete.*')) or (not (EXISTS(trait.trait_status))) and (not (trait.ontology_id =~ '(?i).*-.*'))) return count(trait) as total_traits"
            cursor = db.run(query)
            result = get_neo_result(cursor, "total_traits")
            total_traits = result[0]
            item_collection = range(total_traits)
            a_page = paginate.Page(item_collection, current_page, page_size)
            query = (
                "match (trait:Trait) where ((not (trait.trait_status =~ '(?i).*obsolete.*')) or (not (EXISTS(trait.trait_status))) and (not (trait.ontology_id =~ '(?i).*-.*'))) return trait SKIP "
                + str(a_page.first_item - 1)
                + " LIMIT "
                + str(page_size)
            )
            cursor = db.run(query)
            trait = get_neo_result(cursor, "trait")


        ret = {
            "metadata": {
                "pagination": {
                    "pageSize": page_size,
                    "currentPage": current_page,
                    "totalCount": total_traits,
                    "totalPages": totalpages,
                },
                "status": [],
                "datafiles": [],
            },
            "result": [],
        }

        for a_trait in trait:

            ret_result = {
                "traitDbId": a_trait["id"],
                "traitName": a_trait["name"],
                "traitClass": a_trait["trait_class"],
                "traitPUI": a_trait["trait_pui"],
                "description": a_trait["trait_description"],
                "synonyms": a_trait["trait_synonym"].split(',') if a_trait.get("trait_synonym") else [],
                "mainAbbreviation": a_trait["main_trait_abbreviation"],
                "alternativeAbbreviations": a_trait["alternative_abbreviation"].split(',') if a_trait.get("alternative_abbreviation") else [],
                "entity": a_trait["entity"],
                "externalReferences": a_trait["external_references"],
                "entityPUI": a_trait["entityPUI"],
                "attribute": a_trait["attribute"],
                "attributePUI": a_trait["attributePUI"],
                "status": a_trait["trait_status"],
                "additionalInfo": a_trait["additional_info"],
                "ontologyReference": {
                    "documentationLinks": [
                        {
                            "URL": "http://purl.obolibrary.org/obo/ro.owl",
                            "type": "OBO"
                        }
                    ],
                    "ontologyDbId": a_trait["ontology_id"],
                    "ontologyName": a_trait["ontology_name"]
                },

                # to avoid redundancy the ontologyReference variable won't be in trait only when you get variables
                # but it will be there when the client is calling a trait by id
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


class BRAPIv2VariablesView(PublicView):
    def process_view(self):

        self.returnRawViewResult = True

        # getting the variable id from the query parameter


        common_param = self.request.params.get("commonCropName")
        observationVariableDbId = self.request.params.get("observationVariableDbId")
        variable_id = self.request.params.get("ontologyDbId")
        traitClass = self.request.params.get("traitClass")




        # MATCH (variable:Variable)
        # WHERE variable.name = 'VariableName1'
        #   AND variable.ontology_id = 'OntologyID123'
        #   AND variable.status = 'Active'
        # RETURN variable


        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        # Neo4j connection details


        # setting up the neo4j connection 
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()




        current_page = self.request.params.get("page", "0")
        current_page = int(current_page)
        page_size = self.request.params.get("pageSize", "10")
        page_size = int(page_size)

       
        ret = {
            "@context": [
                "https://brapi.org/jsonld/context/metadata.jsonld"
            ],
            "metadata": {
                "datafiles": [],
                "pagination": {
                    "currentPage": current_page,
                    "pageSize": page_size,
                    "totalCount": 1, 
                    "totalPages": 1
                },
                "status": [
                    {
                        "message": "Request accepted, response successful",
                        "messageType": "INFO"
                    }
                ]
            },
            "result": {
                "data": []
            }
        }

        # MATCH (variable:Variable)-[:VARIABLE_OF]->(trait:Trait)
        # WHERE variable.ontology_id = "CO_348" AND trait.trait_class = "Biochemical"
        # RETURN variable

        # MATCH (variable:Variable {ontology_id : "CO_348"})-[:VARIABLE_OF]->(trait:Trait {trait_class: "Biochemical"}) RETURN variable
        query = generateQuery(
            observationVariableDbId = observationVariableDbId,
            ontologyDbId = variable_id,
            commonCropName = common_param,
            traitClass = traitClass,
        )
        # include_trait_table = traitClass is not None  

        # query = 'MATCH (variable' #:Variable) WHERE '

        # if include_trait_table:
        #     query += ':Variable)-[:VARIABLE_OF]->(trait:Trait) WHERE '

        

        # if observationVariableDbId is not None and include_trait_table is False:
        #     query += '{id: "' + observationVariableDbId + '"}) WHERE '
        # elif observationVariableDbId is not None and include_trait_table is True:
        #     query += '{id: "' + observationVariableDbId + '"}) AND '
        # elif observationVariableDbId is None and include_trait_table is False:
        #     query += ':Variable) WHERE '        


        # conditions = []

        # if variable_id is not None:
        #     conditions.append('variable.ontology_id = "' + variable_id + '"')

        # if common_param is not None:
        #     conditions.append('variable.crop = "' + common_param + '"')

        # if include_trait_table and traitClass is not None:
        #     conditions.append('trait.trait_class = "' + traitClass + '"')

        # if conditions:
        #     query += " AND ".join(conditions)
        # else:
        #     query += "1=1"

        # query += ' AND ((NOT (variable.variable_status =~ "(?i).*obsolete.*")) OR (NOT (EXISTS(variable.variable_status))) AND (NOT (variable.ontology_id =~ "(?i).*-.*")))'

        query_count = query + ' RETURN count(variable) AS total_variables'
        print(query_count)

        cursor = db.run(query_count)
        result = get_neo_result(cursor, "total_variables")
        total_variables = result[0]
        item_collection = range(total_variables)
        a_page = paginate.Page(item_collection, current_page, page_size)
        print(result)
        
        query_paginated = query + ' RETURN variable'

        # if include_trait_table:
        #     query_paginated += ', trait'

        query_paginated += ' SKIP ' + str(a_page.first_item - 1) + " LIMIT " + str(page_size)

        # make it so that it shows nothing isntead of the error


        cursor = db.run(query_paginated)
        variables = get_neo_result(cursor, "variable")
        totalpages = ((total_variables) // page_size) + 1


        # do a full if statement w/ everything over here big bro
        if variable_id is None and common_param is None and observationVariableDbId is None and traitClass is None:
            query = "match (variable:Variable) where ((not (variable.variable_status =~ '(?i).*obsolete.*')) or (not (EXISTS(variable.variable_status))) and (not (variable.ontology_id =~ '(?i).*-.*'))) return count(variable) as total_variables"
            cursor = db.run(query)
            result = get_neo_result(cursor, "total_variables")
            total_variables = result[0]
            item_collection = range(total_variables)
            a_page = paginate.Page(item_collection, current_page, page_size)
            query = (
                "match (variable:Variable) where ((not (variable.variable_status =~ '(?i).*obsolete.*')) or (not (EXISTS(variable.variable_status))) and (not (variable.ontology_id =~ '(?i).*-.*'))) return variable SKIP "
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
                    "totalPages": totalpages,
                },
                "status": [],
                "datafiles": [],
            },
            "result": [],
        }

        for a_variable in variables:

            ret_result = {
                "observationVariableDbId": a_variable["id"],
                "observationVariableName": a_variable["name"],
                "observationVariablePUI": a_variable["observationVariablePUI"],
                "ontologyReference": {
                    "documentationLinks": [
                        {
                            "URL": "http://purl.obolibrary.org/obo/ro.owl",
                            "type": "OBO"
                        }
                    ],
                    "ontologyDbId": a_variable["ontology_id"],
                    "ontologyName": a_variable["crop"]
                },
                "contextOfUse": a_variable["context_of_use"].split(",") if a_variable.get("context_of_use") else [],
                "defaultValue": a_variable.get("default_value", None),
                "growthStage": a_variable["growth_stage"],
                "institution": a_variable["institution"],
                "language": a_variable["language"],
                "scientist": a_variable["scientist"],
                "status": a_variable["variable_status"],
                "synonyms": a_variable["variable_synonyms"].split(",") if a_variable.get("variable_synonyms") else [],
                "date": a_variable["date"],
                "crop": a_variable["crop"],
                "defaultValue": None
            }

            trait = get_trait(db, a_variable["id"]) 

            ret_result["trait"] = {
                "traitDbId": trait["id"],
                "traitName": trait["name"],
                "traitClass": trait["trait_class"],
                "traitPUI": trait["trait_pui"],
                "description": trait["trait_description"],
                "synonyms": trait["trait_synonym"].split(',') if a_variable.get("trait_synonym") else [],
                "mainAbbreviation": trait["main_trait_abbreviation"],
                "alternativeAbbreviations": trait["alternative_abbreviation"].split(',') if a_variable.get("alternative_abbreviation") else [],
                "entity": trait["entity"],
                "entityPUI": trait["entityPUI"],
                "attribute": trait["attribute"],
                "attributePUI": trait["attributePUI"],
                "status": trait["trait_status"],
                "additionalInfo": trait["additional_info"]

                # "ontologyReference": {
                #     "documentationLinks": [
                #         {
                #             "URL": "http://purl.obolibrary.org/obo/ro.owl",
                #             "type": "OBO"
                #         }
                #     ],
                #     "ontologyDbId": result["ontology_id"],
                #     "ontologyName": result["crop"]
                # },

                # to avoid redundancy the ontologyReference variable won't be in trait only when you get variables
                # but it will be there when the client is calling a trait by id
            }





            method = get_method(db, a_variable["id"])
            ret_result["method"] = {
                "methodDbId": method["id"],
                "methodName": method["name"],
                "methodClass": method["method_class"],
                "description": method["method_description"],
                "formula": method["formula"],
                "reference": method["method_reference"],
                "additionalInfo": method["additional_info"]

                # "ontologyReference": {
                #     "documentationLinks": [
                #         {
                #             "URL": "http://purl.obolibrary.org/obo/ro.owl",
                #             "type": "OBO"
                #         }
                #     ],
                #     "ontologyDbId": result["ontology_id"],
                #     "ontologyName": result["crop"]
                # },

                # to avoid redundancy the ontologyReference variable won't be in method only when you get variables
                # but it will be there when the client is calling a method by id

            }


            scale = get_scale(db, a_variable["id"])
            if scale: 
                categories = []
                i = 1
                while scale["category_" + str(i)]:
                    categories.append(scale["category_" + str(i)])
                    i += 1

                ret_result["scale"] = {
                    "scaleDbId": scale["id"],
                    "scaleName": scale["name"],
                    "dataType": scale["scale_class"],
                    "decimalPlaces": scale["decimal_places"],
                    "scalePUI": scale["scale_pui"],
                    "validValues": {
                        "minimumValue": scale["lower_limit"],
                        "maximumValue": scale["upper_limit"],
                        "categories": categories,
                    },
                    "units": scale["units"],

                    # "ontologyReference": {
                    #     "documentationLinks": [
                    #         {
                    #             "URL": "http://purl.obolibrary.org/obo/ro.owl",
                    #             "type": "OBO"
                    #         }
                    #     ],
                    #     "ontologyDbId": result["ontology_id"],
                    #     "ontologyName": result["crop"]
                    # },

                    # to avoid redundancy the ontologyReference variable won't be in scale only when you get variables
                    # but it will be there when the client is calling a scale by id
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


class BRAPIv2ServerInfoView(PublicView):
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
            "result": {
               
            },
           
        }

        ret["result"] = { "contactEmail" :  "brapicoordinatorselby@gmail.com",
                "documentationURL" :   "https://brapi.org/specification",
                "location"  :  "Ithaca, NY, USA",
                "organizationName"  :  "BrAPI Community",
                "organizationURL": "https://brapi.org",
                "serverDescription" :  "BrAPI Community Test Server",
                "serverName" : "BrAPI Community Test Server","calls": []}
        ret["result"]["calls"] = [
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


class BRAPIv2OntologiesView(PublicView):
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

        # execute neo4j query
        # then mix and match it with the mongodb
        # MATCH (var:Variable)-[connection:VARIABLE_OF]->(trait:Trait)
        # RETURN var.ontology_name, trait.trait_class

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        # Neo4j connection details


        # setting up the neo4j connection 
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        query = ("MATCH (var:Variable)-[connection:VARIABLE_OF]->(trait:Trait) RETURN var.ontology_name, trait.trait_class")
        cursor = db.run(query)
        variables = get_neo_result_join(cursor)

        total_ontologies = 0
        data = []

        for ontology in ontologies:
            total_ontologies += 1

            associated_trait_classes = set(
                item["trait_class"] for item in variables if item["ontology_name"] == ontology["ontology_name"]
            )
      
            ret_result = {
                "ontologyDbId": ontology["ontology_id"],
                "ontologyName": ontology["ontology_name"],
                "authors": None,
                "version": ontology["created_at"],
                "description": ontology["ontology_summary"],
                "copyright": None,
                "additional_info": {
                    "term_names": list(associated_trait_classes)
                },
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
