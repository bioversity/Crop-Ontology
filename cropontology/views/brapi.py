from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase
import paginate


def to_json(data):
    return json.dumps(data, indent=4, default=str)


def get_neo_result(cursor, key):
    results = []
    for an_item in cursor:
        results.append(an_item[key])
    return results


def get_variables(db, term_id):
    query = (
        'Match (trait {id:"' + term_id + '"}) <-[VARIABLE_OF]-(op {term_type: "variable"}) where (op.variable_status <> "Obsolete")'
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
        current_page = self.request.params.get("page", "1")
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
                    + '"}) return count(trait) as total_traits'
                )
                cursor = db.run(query)
                result = get_neo_result(cursor, "total_traits")
                total_traits = result[0]
                item_collection = range(total_traits)
                a_page = paginate.Page(item_collection, current_page, page_size)
                query = (
                    'match (trait:Trait {ontology_id: "'
                    + trait_id
                    + '"}) return trait SKIP '
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
                "match (trait:Trait) return trait SKIP "
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
