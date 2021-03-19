from .classes import PublicView
from pyramid.httpexceptions import HTTPFound, HTTPNotFound
from cropontology.processes.elasticsearch.term_index import get_term_index_manager
import paginate
import json
from neo4j import GraphDatabase


def get_facet_code(facets, facet_name):
    for a_facet in facets:
        if a_facet["name"] == facet_name:
            return a_facet["code"]
    return None


def get_facet_name(facets, facet_code):
    for a_facet in facets:
        if a_facet["code"] == facet_code:
            return a_facet["name"]
    return None


def get_facet_key(facets, facet_code):
    for a_facet in facets:
        if a_facet["code"] == facet_code:
            return a_facet["key"]
    return None


def get_facet_desc(facets, facet_code):
    for a_facet in facets:
        if a_facet["code"] == facet_code:
            return a_facet["desc"]
    return None


def get_all_ontologies(index_manager, final_query):
    documents = []

    final_query["aggs"] = {
        "ontology": {
            "terms": {
                "field": "ontology_name.keyword",
                "size": 10000,
                "order": {"_key": "asc"},
            }
        }
    }
    res, number = index_manager.free_query(final_query)
    if number > 0:
        buckets = res["aggregations"]["ontology"]["buckets"]
        for a_bucket in buckets:
            documents.append({"name": a_bucket["key"], "nitems": a_bucket["doc_count"]})
    return documents


class GetBucketView(PublicView):
    def process_view(self):
        if self.request.method == "POST":
            facet_file = self.request.registry.settings["facet.file"]
            with open(facet_file) as json_file:
                facet_data = json.load(json_file)
            index_facets = facet_data["facets"]

            bucket_id = self.request.POST.get("buket_id", None)
            if bucket_id is None:
                raise HTTPNotFound()
            facet_name = get_facet_code(index_facets, bucket_id)
            index_manager = get_term_index_manager(self.request)

            q_param = self.request.POST.get("q", "")

            # Extract the active facets from the URL
            active_facets = []
            for key in self.request.POST.keys():
                if key.find("facet_") >= 0:
                    active_facets.append(
                        {
                            "code": key.replace("facet_", "") + ".keyword",
                            "value": self.request.POST[key],
                            "name": get_facet_name(
                                index_facets, key.replace("facet_", "") + ".keyword"
                            ),
                            "desc": get_facet_desc(
                                index_facets, key.replace("facet_", "") + ".keyword"
                            ),
                            "key": get_facet_key(
                                index_facets, key.replace("facet_", "") + ".keyword"
                            ),
                        }
                    )

            if q_param == "":
                final_query = {"query": {"bool": {"must": {"match_all": {}}}}}
            else:
                final_query = {
                    "query": {
                        "bool": {
                            "must": {
                                "match_phrase": {"all_data": q_param},
                            }
                        }
                    }
                }
            if active_facets:
                final_query["query"]["bool"]["filter"] = []
                for a_facet in active_facets:
                    final_query["query"]["bool"]["filter"].append(
                        {"term": {a_facet["code"]: a_facet["value"]}}
                    )

            final_query["aggs"] = {
                "ontology": {
                    "terms": {
                        "field": facet_name,
                        "size": 10000,
                        "order": {"_key": "asc"},
                    }
                }
            }
            documents = []
            res, number = index_manager.free_query(final_query, 0, 1)
            buckets = res["aggregations"]["ontology"]["buckets"]
            for a_bucket in buckets:
                if a_bucket["doc_count"] > 0:
                    documents.append(
                        {"name": a_bucket["key"], "nitems": a_bucket["doc_count"]}
                    )
            self.returnRawViewResult = True
            return documents
        else:
            raise HTTPNotFound()


class SearchView(PublicView):
    def process_view(self):
        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        def get_parents(term_id, parent_type):
            query = (
                'MATCH (nodeOfInterest {id : "'
                + term_id
                + '"})-[*0..]->(parent {term_type: "'
                + parent_type
                + '"}) RETURN distinct parent.id as term_id, parent.name as term_name, '
                "parent.term_type as term_type"
            )
            cursor = db.run(query)
            result = []
            for an_item in cursor:
                result.append(
                    {"term_id": an_item["term_id"], "term_name": an_item["term_name"]}
                )
            return result

        facet_file = self.request.registry.settings["facet.file"]
        with open(facet_file) as json_file:
            facet_data = json.load(json_file)
        index_facets = facet_data["facets"]

        # The POST method only collects the whether the user search for something or clicked on facted.
        # What is collected is then stored in the variable called params and then redirect to the same
        # URL but using GET
        if self.request.method == "POST":
            params = {}
            if "q" in self.request.params.keys():
                params["q"] = self.request.params["q"]

            if self.request.POST.get("searchtext", "") != "":
                params["q"] = self.request.POST.get("searchtext", "")
            else:
                params["q"] = ""

            if params["q"] == "":
                params.pop("q", None)

            active_facets = []
            # Obtains facets in the URL
            for key in self.request.params.keys():
                if key.find("facet_") >= 0:
                    active_facets.append(
                        {key.replace("facet_", ""): self.request.params[key]}
                    )

            if "removequery" in self.request.POST:
                params.pop("q", None)

            # if we adding a filtering by a facet
            if "facetadd" in self.request.POST:
                facet_type = get_facet_code(
                    index_facets, self.request.POST.get("facettype", "")
                )
                facet_value = self.request.POST.get("facetvalue", "")
                facet_found = False
                for facet in active_facets:
                    if facet_type in facet.keys():
                        facet_found = True
                if not facet_found:
                    active_facets.append({facet_type: facet_value})

            # if we removing a filtering by a facet
            if "facetremove" in self.request.POST:
                facet_removed = self.request.POST.get("facetremove", "")
                new_facets = []
                for a_facet in active_facets:
                    if facet_removed not in a_facet.keys():
                        new_facets.append(a_facet)
                active_facets = new_facets

            for a_facet in active_facets:
                for key, value in a_facet.items():
                    params["facet_" + key] = value

            location = self.request.route_url("search", _query=params)
            self.returnRawViewResult = True
            return HTTPFound(location=location)
        else:
            index_manager = get_term_index_manager(self.request)
            # ge go through the params in the request to see what is the user searching for
            if "q" not in self.request.params.keys():
                q_param = ""
            else:
                q_param = self.request.params["q"]

            # Extract the active facets from the URL
            active_facets = []
            for key in self.request.params.keys():
                if key.find("facet_") >= 0:
                    active_facets.append(
                        {
                            "code": key.replace("facet_", ""),
                            "value": self.request.params[key],
                            "name": get_facet_name(
                                index_facets, key.replace("facet_", "")
                            ),
                            "desc": get_facet_desc(
                                index_facets, key.replace("facet_", "")
                            ),
                            "key": get_facet_key(
                                index_facets, key.replace("facet_", "")
                            ),
                        }
                    )

            current_page = 1
            if "page" in self.request.params:
                current_page = int(self.request.params["page"])

            # Get the statistics for each facet
            facet_stats = []
            if len(active_facets) > 0:
                es_query = {"query": {"match_all": {}}, "aggs": {}}
                # es_query["aggs"] = {}
                for a_facet in active_facets:
                    es_query["aggs"][a_facet["key"]] = {
                        "terms": {"field": a_facet["code"]}
                    }
                res, number = index_manager.free_query(es_query)
                nstat = 0
                for a_facet in active_facets:
                    buckets = res["aggregations"][a_facet["key"]]["buckets"]
                    for a_bucket in buckets:
                        if a_bucket["key"] == a_facet["value"]:
                            nstat = nstat + 1
                            facet_stats.append(
                                {
                                    "nstat": nstat,
                                    "name": a_facet["name"],
                                    "value": a_bucket["key"],
                                    "total": a_bucket["doc_count"],
                                }
                            )

            # Now we query the qparam if there is one to know the total number of elements with qparam
            total_in_q_param = 0
            if q_param != "":
                es_query = {
                    "query": {
                        "match_phrase": {"all_data": q_param},
                    }
                }
                res, total_in_q_param = index_manager.free_query(es_query)

            # Now get the total hits of the query to create the Collection
            if q_param == "":
                final_query = {"query": {"bool": {"must": {"match_all": {}}}}}
            else:
                final_query = {
                    "query": {
                        "bool": {
                            "must": {
                                "match_phrase": {"all_data": q_param},
                            }
                        }
                    }
                }
            if active_facets:
                final_query["query"]["bool"]["filter"] = []
                for a_facet in active_facets:
                    final_query["query"]["bool"]["filter"].append(
                        {"term": {a_facet["code"]: a_facet["value"]}}
                    )

            res_count = index_manager.free_query_count(final_query)
            hits = res_count["count"]
            item_collection = range(hits)

            # Get the grand total
            es_query = {"query": {"match_all": {}}}
            res_count = index_manager.free_query_count(es_query)
            grand_total = res_count["count"]

            page_size = 6
            a_page = paginate.Page(item_collection, current_page, page_size)
            no_page = {}
            for key, value in self.request.params.iteritems():
                if key != "page":
                    no_page[key] = value
            all_pages = []
            if a_page.last_page is not None:
                if a_page.last_page > 1:
                    for a in range(1, a_page.last_page):
                        next_page = False
                        if a == current_page + 1:
                            next_page = True
                        no_page["page"] = a
                        all_pages.append(
                            {
                                "page": a,
                                "next": next_page,
                                "url": self.request.route_url("search", _query=no_page),
                            }
                        )

            if hits > 0:
                res, total = index_manager.free_query(
                    final_query, a_page.first_item - 1, page_size
                )
                results = []
                for hit in res["hits"]["hits"]:
                    results.append(hit["_source"])
            else:
                results = []

            for a_result in results:
                if a_result["term_type"] == "Variable":
                    a_result["parent_traits"] = get_parents(
                        a_result["term_id"], "trait"
                    )
                    # a_result["parent_methods"] = get_parents(a_result["term_id"], "method")

            all_ontologies = get_all_ontologies(index_manager, final_query)
            total_panels = len(facet_stats)
            if total_in_q_param > 0:
                total_panels = total_panels + 1
            return {
                "totalinqparam": total_in_q_param,
                "hits": hits,
                "qparam": q_param,
                "activeFacets": active_facets,
                "facetStats": facet_stats,
                "results": results,
                "allPages": all_pages,
                "grandTotal": grand_total,
                "allontologies": all_ontologies,
                "npanels": total_panels,
                "facets": index_facets,
            }
