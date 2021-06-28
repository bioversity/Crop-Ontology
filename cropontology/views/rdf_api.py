from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase
import pymongo
import requests
from rdflib import Graph
from rdflib.namespace import OWL, DC, DCTERMS, RDF, RDFS, SKOS
from rdflib import URIRef, BNode, Literal
import pandas


def to_json(data):
    return json.dumps(data, indent=4, default=str)


def get_neo_result(cursor, key):
    results = []
    for an_item in cursor:
        results.append(an_item[key])
    return results


def get_trait(db, term_id):
    query = (
        'Match (variable {id:"'
        + term_id
        + '"}) -[VARIABLE_OF]->(trait {term_type: "trait"}) return an_item["trait"]'
    )
    cursor = db.run(query)
    trait = get_neo_result(cursor, "trait")
    if an_item["trait"]:
        trait = trait[0]
    return an_item["trait"]


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
        + '"}) -[VARIABLE_OF]->(scale {term_type: "scale"}) return an_item["scale"]'
    )
    cursor = db.run(query)
    an_item["scale"] = get_neo_result(cursor, "scale")
    if an_item["scale"]:
        an_item["scale"] = an_item["scale"][0]
    return an_item["scale"]


class MetadataView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        headers = [
            ("Content-Type", "application/json; charset=utf-8"),  # application/x-yaml
        ]
        response = Response(headerlist=headers, status=200)

        mongo_url = self.request.registry.settings.get("mongo.url")
        mongo_client = pymongo.MongoClient(mongo_url)
        ontology_db = mongo_client["ontologies"]
        ontology_collection = ontology_db["ontologies"]
        ontologies = list(ontology_collection.find().sort([("ontology_name", 1)]))

        ret = '"@context":\n' "ontologies:\n"

        for ontology in ontologies:
            if ontology["category"] == "300-499 Phenotype and Trait Ontology":
                if "CO_" in ontology["ontology_id"]:
                    onto_id = ontology["ontology_id"]
                    onto_name = ontology["ontology_name"]
                    onto_description = ontology["ontology_summary"]
                    ret += (
                        " - id: " + onto_id + "\n"
                        "   title: " + onto_name + " ontology\n"
                        "   uri: http://127.0.0.1:5900/ontology/"
                        + onto_id
                        + "/"
                        + onto_name
                        + "\n"
                        '   description: "' + onto_description + '"' + "\n"
                        "   homepage: http://127.0.0.1:5900/ontology/"
                        + onto_id
                        + "/"
                        + onto_name
                        + "\n"
                        "   mailing_list: helpdesk@cropontology-curationtool.org\n"
                        "   definition_property:\n"
                        "     - http://www.w3.org/2004/02/skos/core#definition\n"
                        "   synonym_property:\n"
                        "     - http://www.w3.org/2004/02/skos/core#altLabel\n"
                        "     - http://www.cropontology.org/rdf/acronym\n"
                        "   hierarchical_property:\n"
                        "     - http://www.cropontology.org/rdf/method_of\n"
                        "     - http://www.cropontology.org/rdf/scale_of\n"
                        "   base_uri:\n"
                        "     - http://www.cropontology.org/rdf/" + onto_id + "\n"
                        "   ontology_purl : http://127.0.0.1:5900/ontology/"
                        + onto_id
                        + "/"
                        + onto_name
                        + "/owl\n"
                    )

        # json_data = to_json(ret)
        response.text = ret
        return response


class RDFCleanView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        ontology_id = self.request.matchdict["ontology_id"]

        headers = [
            ("Content-Type", "text/xml; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        ## create graph
        g = Graph()
        ## define namespace
        NS = "http://www.cropontology.org/rdf/"

        ## create properties
        variable_of = URIRef(NS + "variable_of")
        g.add((variable_of, RDF.type, OWL.ObjectProperty))
        g.add((variable_of, RDFS.label, Literal("variable_of")))
        scale_of = URIRef(NS + "scale_of")
        g.add((scale_of, RDF.type, OWL.ObjectProperty))
        g.add((scale_of, RDFS.label, Literal("scale_of")))
        method_of = URIRef(NS + "method_of")
        g.add((method_of, RDF.type, OWL.ObjectProperty))
        g.add((method_of, RDFS.label, Literal("method_of")))
        acronym = URIRef(NS + "acronym")
        g.add((acronym, RDF.type, OWL.AnnotationProperty))
        g.add((acronym, RDFS.label, Literal("acronym")))
        entity = URIRef(NS + "entity")
        g.add((entity, RDF.type, OWL.AnnotationProperty))
        g.add((entity, RDFS.label, Literal("entity")))
        attribute = URIRef(NS + "attribute")
        g.add((attribute, RDF.type, OWL.AnnotationProperty))
        g.add((attribute, RDFS.label, Literal("attribute")))
        ## create classes

        ## create ontology
        co = URIRef(NS)
        g.add((co, RDF.type, OWL.Ontology))
        # g.add((co, OWL.versionIRI, Literal("v1"))) ## to change
        # g.add((co, DCTERMS.creator, URIRef("curator name")))
        g.add(
            (
                co,
                DCTERMS.license,
                URIRef("https://creativecommons.org/licenses/by/4.0/"),
            )
        )

        query = (
            'match (variable:Variable {ontology_id: "'
            + ontology_id
            + '"}) where (not variable.variable_status =~ "(?i).*obsolete.*" or NOT EXISTS(variable.variable_status)) return variable'
        )

        cursor = db.run(query)
        variables = get_neo_result(cursor, "variable")

        for var in variables:
            ## add ontology label
            g.add((co, RDFS.label, Literal(var["crop"] + " ontology")))
            ## create triples
            var_uri = URIRef(NS + var["id"])
            g.add((var_uri, RDF.type, OWL.Class))
            g.add((var_uri, RDFS.subClassOf, URIRef(NS + "Variable")))
            g.add((var_uri, RDFS.label, Literal(var["name"], lang="en")))
            if "variable_synonyms" in var:
                for syn in var["variable_synonyms"].split(","):
                    g.add((var_uri, SKOS.altLabel, Literal(syn, lang="en")))
            if "xref" in var:
                g.add((var_uri, DCTERMS.source, Literal(var["variable_xref"])))
            if "institution" in var:
                g.add((var_uri, DCTERMS.contributor, Literal(var["institution"])))
            if "scientist" in var:
                g.add((var_uri, DCTERMS.contributor, Literal(var["scientist"])))

            ##add an_item["trait"] information
            trait = get_trait(db, var["id"])
            trait_uri = URIRef(NS + trait["id"])
            g.add((trait_uri, RDF.type, OWL.Class))
            g.add((trait_uri, RDFS.label, Literal(trait["name"], lang="en")))
            g.add(
                (
                    trait_uri,
                    SKOS.definition,
                    Literal(trait["trait_description"], lang="en"),
                )
            )
            if "trait_synonym" in an_item["trait"]:
                for syn in an_item["trait"]["trait_synonym"].split(","):
                    g.add((trait_uri, SKOS.altLabel, Literal(syn, lang="en")))
            if "main_trait_abbreviation" in an_item["trait"]:
                g.add(
                    (
                        trait_uri,
                        acronym,
                        Literal(trait["main_trait_abbreviation"], lang="en"),
                    )
                )
            if "alternative_abbreviation" in an_item["trait"]:
                for syn in an_item["trait"]["alternative_abbreviation"].split(","):
                    g.add((trait_uri, SKOS.altLabel, Literal(syn, lang="en")))
            if "entity" in an_item["trait"]:
                g.add((trait_uri, entity, Literal(trait["entity"])))
            if "attribute" in an_item["trait"]:
                g.add((trait_uri, attribute, Literal(trait["attribute"])))
            if "xref" in an_item["trait"]:
                g.add((trait_uri, DCTERMS.source, Literal(trait["trait_xref"])))
            g.add(
                (
                    trait_uri,
                    RDFS.subClassOf,
                    URIRef(NS + trait["trait_class"].replace(" ", "_")),
                )
            )
            g.add(
                (
                    URIRef(NS + trait["trait_class"].replace(" ", "_")),
                    RDFS.subClassOf,
                    URIRef(NS + "Trait"),
                )
            )
            ## create links
            br = BNode()
            g.add((br, RDF.type, OWL.Restriction))
            g.add((br, OWL.onProperty, variable_of))
            g.add((br, OWL.someValuesFrom, trait_uri))
            g.add((var_uri, RDFS.subClassOf, br))

            ## add method information
            method = get_method(db, var["id"])
            method_uri = URIRef(NS + method["id"])
            g.add((method_uri, RDF.type, OWL.Class))
            g.add((method_uri, RDFS.label, Literal(method["name"], lang="en")))
            g.add(
                (
                    method_uri,
                    SKOS.definition,
                    Literal(method["method_description"], lang="en"),
                )
            )
            if "reference" in method:
                g.add((method_uri, DCTERMS.source, Literal(method["method_reference"])))
            g.add(
                (
                    method_uri,
                    RDFS.subClassOf,
                    URIRef(NS + method["method_class"].replace(" ", "_")),
                )
            )
            g.add(
                (
                    URIRef(NS + method["method_class"].replace(" ", "_")),
                    RDFS.subClassOf,
                    URIRef(NS + "Method"),
                )
            )
            ## create links
            br = BNode()
            g.add((br, RDF.type, OWL.Restriction))
            g.add((br, OWL.onProperty, variable_of))
            g.add((br, OWL.someValuesFrom, method_uri))
            g.add((var_uri, RDFS.subClassOf, br))
            br = BNode()
            g.add((br, RDF.type, OWL.Restriction))
            g.add((br, OWL.onProperty, method_of))
            g.add((br, OWL.someValuesFrom, trait_uri))
            g.add((method_uri, RDFS.subClassOf, br))

            ## add an_item["scale"] information
            an_item["scale"] = get_scale(db, var["id"])
            scale_uri = URIRef(NS + an_item["scale"]["id"])
            g.add((scale_uri, RDF.type, OWL.Class))
            g.add((scale_uri, RDFS.label, Literal(scale["name"], lang="en")))
            if "xref" in an_item["scale"]:
                g.add((scale_uri, DCTERMS.source, Literal(scale["scale_xref"])))
            g.add(
                (
                    scale_uri,
                    RDFS.subClassOf,
                    URIRef(NS + scale["scale_class"].replace(" ", "_")),
                )
            )
            g.add(
                (
                    URIRef(NS + scale["scale"]["scale_class"].replace(" ", "_")),
                    RDFS.subClassOf,
                    URIRef(NS + "Scale"),
                )
            )
            categories = []
            i = 1
            while scale["category_" + str(i)]:
                categories.append(scale["category_" + str(i)])
                i += 1
            for s in categories:
                try:
                    if "=" in s:
                        cat = s.split("=")
                        g.add(
                            (
                                URIRef(NS + scale["id"] + "/" + cat[0].strip()),
                                RDFS.subClassOf,
                                scale_uri,
                            )
                        )
                        g.add(
                            (
                                URIRef(NS + scale["id"] + "/" + cat[0].strip()),
                                RDFS.label,
                                Literal(cat[1].strip(), lang="en"),
                            )
                        )
                        g.add(
                            (
                                URIRef(NS + scale["id"] + "/" + cat[0].strip()),
                                SKOS.altLabel,
                                Literal(cat[0].strip(), lang="en"),
                            )
                        )
                    else:
                        try:
                            g.add((scale_uri, RDFS.comment, ", ".join(categories)))
                        except Exception:
                            continue
                except:
                    print(s)

            ## create links
            br = BNode()
            g.add((br, RDF.type, OWL.Restriction))
            g.add((br, OWL.onProperty, variable_of))
            g.add((br, OWL.someValuesFrom, scale_uri))
            g.add((var_uri, RDFS.subClassOf, br))
            br = BNode()
            g.add((br, RDF.type, OWL.Restriction))
            g.add((br, OWL.onProperty, scale_of))
            g.add((br, OWL.someValuesFrom, method_uri))
            g.add((scale_uri, RDFS.subClassOf, br))

        response.text = g.serialize(format="pretty-xml").decode("utf-8")
        db.close()
        return response


class ExcelView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        ontology_id = self.request.matchdict["ontology_id"]

        headers = [
            (
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8",
            ),
            # ("Content-Type", "text/csv; charset=utf-8"), ## csv
        ]
        response = Response(headerlist=headers, status=200)

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        query = (
            'match (variable:Variable{ontology_id:"'
            + ontology_id
            + '"})-[:VARIABLE_OF]->(trait:Trait) '
            + 'match (variable:Variable{ontology_id:"'+ontology_id+'"})-[:VARIABLE_OF]->(method:Method) '
            + 'match (variable:Variable{ontology_id:"'+ontology_id+'"})-[:VARIABLE_OF]->(scale:Scale) '
            + "return variable, trait, method, scale"
        )
        cursor = db.run(query)

        # terms = get_neo_result_4keys(cursor, "variable", "trait", "method")

        results = []

        for an_item in cursor:
            ret_result = {
                "curation": "",
                "Variable ID": an_item["variable"]["id"],
                "Variable name": an_item["variable"]["name"],
                "Variable synonyms": an_item["variable"]["variable_synonyms"],
                "Context of use": an_item["variable"]["context_of_use"],
                "Growth stage": an_item["variable"]["growth_stage"],
                "Variable status": an_item["variable"]["variable_status"],
                "Variable Xref": an_item["variable"]["variable_xref"],
                "Institution": an_item["variable"]["institution"],
                "Scientist": an_item["variable"]["scientist"],
                "Date": an_item["variable"]["date"],
                "Language": an_item["variable"]["language"],
                "Crop": an_item["variable"]["crop"],
                "Trait ID": an_item["trait"]["id"],
                "Trait name": an_item["trait"]["name"],
                "Trait class": an_item["trait"]["trait_class"],
                "Trait description": an_item["trait"]["trait_description"],
                "Trait synonyms": an_item["trait"]["trait_synonym"],
                "Main trait abbreviation": an_item["trait"]["main_trait_abbreviation"],
                "Alternative trait abbreviations": an_item["trait"][
                    "alternative_abbreviation"
                ],
                "Entity": an_item["trait"]["entity"],
                "Attribute": an_item["trait"]["attribute"],
                "Trait status": an_item["trait"]["trait_status"],
                "Trait Xref": an_item["trait"]["trait_xref"],
                "Method ID": an_item["method"]["id"],
                "Method name": an_item["method"]["name"],
                "Method class": an_item["method"]["method_class"],
                "Method description": an_item["method"]["method_description"],
                "Formula": an_item["method"]["formula"],
                "Method reference": an_item["method"]["method_reference"],
                "Scale ID": an_item["scale"]["id"],
                "Scale name": an_item["scale"]["name"],
                "Scale class": an_item["scale"]["scale_class"],
                "Decimal places": an_item["scale"]["decimal_places"],
                "Lower limit": an_item["scale"]["lower_limit"],
                "Upper limit": an_item["scale"]["upper limit"],
                "Scale Xref": an_item["scale"]["scale_xref"],
            }

            i = 1
            while an_item["scale"]["category_" + str(i)]:
                ret_result["Category " + str(i)] = an_item["scale"][
                    "category_" + str(i)
                ]
                i += 1
            if i <= 10:  ## still need to create empty field to category 10
                while i <= 10:
                    ret_result["Category " + str(i)] = ""
                    i += 1

            results.append(ret_result)

        response = pandas.read_json(to_json(results)).to_excel(
            ontology_id + ".xlsx"
        )
        db.close()
        return response
