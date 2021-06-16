from .classes import PublicView
from neo4j import GraphDatabase


def get_neo_result(cursor, key):
    results = []
    for an_item in cursor:
        results.append(an_item[key])
    return results


def get_parents(db, term_id, parent_array, ontology_id):
    """
    Recursive function. Get the parents of a term
    """
    parent_array.insert(0, term_id)
    query = (
        'match(child {id:"'
        + term_id
        + '"})-[]->(parent {ontology_id: "'
        + ontology_id
        + '"}) return parent.id'
    )
    cursor = db.run(query)
    parents = get_neo_result(cursor, "parent.id")
    if len(parents) > 1:
        query = 'match(t {id: "' + term_id + '"}) return t.term_type'
        cursor = db.run(query)
        term_type = get_neo_result(cursor, "t.term_type")[0]
        if term_type == "variable":
            query = (
                'match(child {id:"'
                + term_id
                + '"})-[]->(parent:Scale {ontology_id: "'
                + ontology_id
                + '"}) return parent.id'
            )
            cursor = db.run(query)
            parents_2 = get_neo_result(cursor, "parent.id")
            if len(parents_2) > 0:
                get_parents(db, parents_2[0], parent_array, ontology_id)
            else:
                get_parents(db, parents[0], parent_array, ontology_id)
        else:
            get_parents(db, parents[0], parent_array, ontology_id)

    if len(parents) == 1:
        get_parents(db, parents[0], parent_array, ontology_id)


def get_item_details(db, term_id):
    query = 'match(t {id: "' + term_id + '"}) return t.name, t.term_type'
    cursor = db.run(query)
    result = []
    for an_item in cursor:
        result.append({"name": an_item["t.name"], "type": an_item["t.term_type"]})
    return result[0]


def count_children(db, term_id, ontology_id):
    query = (
        'MATCH (parent {id:"'
        + term_id
        + '"})<-[]-(child {ontology_id: "'
        + ontology_id
        + '"}) RETURN COUNT(DISTINCT child) as children'
    )
    cursor = db.run(query)
    result = get_neo_result(cursor, "children")
    return result[0]


def get_icon(request, term_type):
    return request.url_for_static(term_type + ".png")


def create_tree(
    request, db, position, tree_array, basic_path, parent, final_term_id, ontology_id
):
    """
    Recursive function. Creates a JSON structure based on a basic path adding siblings to each section of the path
    """
    if position == 0:
        term_details = get_item_details(db, basic_path[0])
        tree_dict = {
            "text": term_details["name"],
            "children": [],
            "id": basic_path[0],
            "type": term_details["type"],
            "icon": get_icon(request, term_details["type"]),
            "state": {
                "opened": True,
            },
        }
        create_tree(
            request,
            db,
            position + 1,
            tree_dict["children"],
            basic_path,
            basic_path[0],
            final_term_id,
            ontology_id,
        )
        tree_array.append(tree_dict)
        return
    if position == len(basic_path) - 1:
        query = (
            'MATCH (parent {id:"'
            + parent
            + '"})<-[]-(child {ontology_id: "'
            + ontology_id
            + '"}) '
            "RETURN DISTINCT child.id, child.term_type, child.name "
            "ORDER BY child.name"
        )
        cursor = db.run(query)
        for an_item in cursor:
            has_children = True
            if count_children(db, an_item["child.id"], ontology_id) == 0:
                has_children = False
            selected = False
            if an_item["child.id"] == final_term_id:
                selected = True
            tree_array.append(
                {
                    "text": an_item["child.name"],
                    "children": has_children,
                    "id": an_item["child.id"],
                    "type": an_item["child.term_type"],
                    "icon": get_icon(request, an_item["child.term_type"]),
                    "state": {
                        "selected": selected,
                    },
                }
            )
        return
    #  Get all the child of parent
    query = (
        'MATCH (parent {id:"'
        + parent
        + '"})<-[]-(child {ontology_id: "'
        + ontology_id
        + '"}) RETURN DISTINCT child.id, child.term_type, child.name '
        "ORDER BY child.name"
    )
    cursor = db.run(query)
    for an_item in cursor:
        if final_term_id != an_item["child.id"]:
            if an_item["child.id"] != basic_path[position]:
                has_children = True
                if count_children(db, an_item["child.id"], ontology_id) == 0:
                    has_children = False
                tree_array.append(
                    {
                        "text": an_item["child.name"],
                        "children": has_children,
                        "id": an_item["child.id"],
                        "type": an_item["child.term_type"],
                        "icon": get_icon(request, an_item["child.term_type"]),
                    }
                )
            else:
                tree_dict = {
                    "text": an_item["child.name"],
                    "children": [],
                    "id": an_item["child.id"],
                    "type": an_item["child.term_type"],
                    "icon": get_icon(request, an_item["child.term_type"]),
                    "state": {
                        "opened": True,
                    },
                }
                create_tree(
                    request,
                    db,
                    position + 1,
                    tree_dict["children"],
                    basic_path,
                    an_item["child.id"],
                    final_term_id,
                    ontology_id,
                )
                tree_array.append(tree_dict)


class TreeView(PublicView):
    def process_view(self):
        term_id = self.request.matchdict["termid"]
        parts = term_id.split(":")
        ontology_id = parts[0]
        node_id = self.request.params.get("id", "#")
        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()
        tree_array = []
        if node_id == "#":
            basic_path = []
            get_parents(db, term_id, basic_path, ontology_id)
            if len(basic_path) > 1:
                create_tree(
                    self.request,
                    db,
                    0,
                    tree_array,
                    basic_path,
                    None,
                    term_id,
                    ontology_id,
                )
            else:
                term_details = get_item_details(db, basic_path[0])
                tree_dict = {
                    "text": term_details["name"],
                    "children": [],
                    "id": basic_path[0],
                    "type": term_details["type"],
                    "icon": get_icon(self.request, term_details["type"]),
                    "state": {
                        "opened": True,
                        "selected": True,
                    },
                }
                query = (
                    'MATCH (parent {id:"'
                    + basic_path[0]
                    + '"})<-[]-(child {ontology_id: "'
                    + ontology_id
                    + '"}) WHERE child.term_type <> "variable" '
                    'AND (child.is_obsolete <> "true" OR child.is_obsolete is null) RETURN DISTINCT child.id, '
                    "child.term_type, child.name "
                    "ORDER BY child.name"
                )
                cursor = db.run(query)
                for an_item in cursor:
                    has_children = True
                    if count_children(db, an_item["child.id"], ontology_id) == 0:
                        has_children = False
                    tree_dict["children"].append(
                        {
                            "text": an_item["child.name"],
                            "children": has_children,
                            "id": an_item["child.id"],
                            "type": an_item["child.term_type"],
                            "icon": get_icon(self.request, an_item["child.term_type"]),
                        }
                    )
                tree_array.append(tree_dict)
        else:
            query = (
                'MATCH (parent {id:"'
                + node_id
                + '"})<-[]-(child {ontology_id: "'
                + ontology_id
                + '"}) WHERE child.term_type <> "variable" '
                'AND (child.is_obsolete <> "true" OR child.is_obsolete is null) RETURN '
                "DISTINCT child.id, child.term_type, child.name "
                "ORDER BY child.name"
            )
            cursor = db.run(query)
            for an_item in cursor:
                if an_item["child.id"] != term_id and an_item["child.id"] != node_id:
                    has_children = True
                    if count_children(db, an_item["child.id"], ontology_id) == 0:
                        has_children = False
                    tree_array.append(
                        {
                            "text": an_item["child.name"],
                            "children": has_children,
                            "id": an_item["child.id"],
                            "type": an_item["child.term_type"],
                            "icon": get_icon(self.request, an_item["child.term_type"]),
                        }
                    )
        db.close()
        self.returnRawViewResult = True
        return tree_array
