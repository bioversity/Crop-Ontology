from elasticsearch import Elasticsearch
from elasticsearch.exceptions import RequestError


class TermExistError(Exception):
    """
    Exception raised when ElasticSearch checks whether a Term already exists in the index.
    """

    def __str__(self):
        return "Link object already exists in network"


class TermNotExistError(Exception):
    """
    Exception raised when ElasticSearch checks whether a Term doesn't exists in the index.
    """

    def __str__(self):
        return "Term ID does not exists in index"


def _get_term_index_definition(number_of_shards, number_of_replicas):
    """
    Constructs the Term index with a given number of shards and replicas.
    Each connection is stored as individual ES documents
    :param number_of_shards: Number of shards for the network index.
    :param number_of_replicas: Number of replicas for the network index.

    The index has been created using the utility create_term_mapping.py

    :return: A dict object with the definition of the Term index.
    """
    _json = {
        "settings": {
            "index": {
                "number_of_shards": number_of_shards,
                "number_of_replicas": number_of_replicas,
            }
        },
        "mappings": {
            "properties": {
                "all_data": {"type": "text", "analyzer": "standard"},
                "term_id": {"type": "text", "copy_to": "all_data"},
                "abbreviated_name": {"type": "text", "copy_to": "all_data"},
                "alt_id": {"type": "text"},
                "alternative_trait_abbreviations": {"type": "text"},
                "attribute": {"type": "text"},
                "bibliographic_reference": {"type": "text"},
                "category_1": {"type": "text"},
                "category_10": {"type": "text"},
                "category_11": {"type": "text"},
                "category_12": {"type": "text"},
                "category_13": {"type": "text"},
                "category_14": {"type": "text"},
                "category_15": {"type": "text"},
                "category_16": {"type": "text"},
                "category_17": {"type": "text"},
                "category_18": {"type": "text"},
                "category_19": {"type": "text"},
                "category_2": {"type": "text"},
                "category_20": {"type": "text"},
                "category_21": {"type": "text"},
                "category_22": {"type": "text"},
                "category_23": {"type": "text"},
                "category_24": {"type": "text"},
                "category_25": {"type": "text"},
                "category_26": {"type": "text"},
                "category_27": {"type": "text"},
                "category_28": {"type": "text"},
                "category_29": {"type": "text"},
                "category_3": {"type": "text"},
                "category_30": {"type": "text"},
                "category_31": {"type": "text"},
                "category_32": {"type": "text"},
                "category_33": {"type": "text"},
                "category_34": {"type": "text"},
                "category_35": {"type": "text"},
                "category_36": {"type": "text"},
                "category_37": {"type": "text"},
                "category_38": {"type": "text"},
                "category_39": {"type": "text"},
                "category_4": {"type": "text"},
                "category_40": {"type": "text"},
                "category_41": {"type": "text"},
                "category_42": {"type": "text"},
                "category_43": {"type": "text"},
                "category_44": {"type": "text"},
                "category_45": {"type": "text"},
                "category_46": {"type": "text"},
                "category_47": {"type": "text"},
                "category_48": {"type": "text"},
                "category_49": {"type": "text"},
                "category_5": {"type": "text"},
                "category_50": {"type": "text"},
                "category_51": {"type": "text"},
                "category_52": {"type": "text"},
                "category_53": {"type": "text"},
                "category_54": {"type": "text"},
                "category_55": {"type": "text"},
                "category_56": {"type": "text"},
                "category_57": {"type": "text"},
                "category_58": {"type": "text"},
                "category_59": {"type": "text"},
                "category_6": {"type": "text"},
                "category_60": {"type": "text"},
                "category_61": {"type": "text"},
                "category_62": {"type": "text"},
                "category_63": {"type": "text"},
                "category_64": {"type": "text"},
                "category_65": {"type": "text"},
                "category_66": {"type": "text"},
                "category_67": {"type": "text"},
                "category_68": {"type": "text"},
                "category_69": {"type": "text"},
                "category_7": {"type": "text"},
                "category_70": {"type": "text"},
                "category_71": {"type": "text"},
                "category_72": {"type": "text"},
                "category_73": {"type": "text"},
                "category_74": {"type": "text"},
                "category_75": {"type": "text"},
                "category_76": {"type": "text"},
                "category_77": {"type": "text"},
                "category_78": {"type": "text"},
                "category_79": {"type": "text"},
                "category_8": {"type": "text"},
                "category_80": {"type": "text"},
                "category_81": {"type": "text"},
                "category_82": {"type": "text"},
                "category_83": {"type": "text"},
                "category_84": {"type": "text"},
                "category_85": {"type": "text"},
                "category_86": {"type": "text"},
                "category_87": {"type": "text"},
                "category_88": {"type": "text"},
                "category_89": {"type": "text"},
                "category_9": {"type": "text"},
                "category_90": {"type": "text"},
                "category_91": {"type": "text"},
                "comments": {"type": "text"},
                "context_of_use": {"type": "text", "copy_to": "all_data"},
                "created_at": {"type": "text"},
                "created_by": {"type": "text"},
                "creation_date": {"type": "text"},
                "crop": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "curation": {"type": "text"},
                "date": {"type": "text"},
                "date_of_submission": {"type": "text"},
                "decimal_places": {"type": "text"},
                "def": {"type": "text"},
                "describe_how_measured_method": {"type": "text"},
                "description_of_trait": {"type": "text", "copy_to": "all_data"},
                "entity": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "for_categorical_class_1__value__meaning": {"type": "text"},
                "for_categorical_class_10__value__meaning": {"type": "text"},
                "for_categorical_class_2__value__meaning": {"type": "text"},
                "for_categorical_class_3__value__meaning": {"type": "text"},
                "for_categorical_class_4__value__meaning": {"type": "text"},
                "for_categorical_class_5__value__meaning": {"type": "text"},
                "for_categorical_class_6__value__meaning": {"type": "text"},
                "for_categorical_class_7__value__meaning": {"type": "text"},
                "for_categorical_class_8__value__meaning": {"type": "text"},
                "for_categorical_class_9__value__meaning": {"type": "text"},
                "for_categorical_name_of_rating_scale": {"type": "text"},
                "for_continuous_maximum": {"type": "text"},
                "for_continuous_minimum": {"type": "text"},
                "for_continuous_reporting_units_if_different_from_measurement": {
                    "type": "text"
                },
                "for_continuous_units_of_measurement": {"type": "text"},
                "for_discrete_name_of_scale_or_units_of_measurement": {"type": "text"},
                "formula": {"type": "text", "copy_to": "all_data"},
                "formula_abbreviation": {"type": "text", "copy_to": "all_data"},
                "growth_stage": {"type": "text"},
                "growth_stages": {"type": "text"},
                "how_is_this_trait_routinely_used": {
                    "type": "text",
                    "copy_to": "all_data",
                },
                "ibfieldbook": {"type": "text"},
                "institution": {"type": "text"},
                "is_obsolete": {"type": "text"},
                "language": {"type": "text"},
                "language_of_submission_only_in_iso_2_letter_codes": {"type": "text"},
                "lower_limit": {"type": "text"},
                "main_trait_abbreviation": {"type": "text", "copy_to": "all_data"},
                "method_class": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "method_description": {"type": "text", "copy_to": "all_data"},
                "method_id": {"type": "text"},
                "method_id_for_modification_blank_for_new": {"type": "text"},
                "method_name": {"type": "text", "copy_to": "all_data"},
                "method_reference": {"type": "text"},
                "name": {"type": "text", "copy_to": "all_data"},
                "name_of_method": {"type": "text", "copy_to": "all_data"},
                "name_of_submitting_scientist": {"type": "text"},
                "name_of_trait": {"type": "text", "copy_to": "all_data"},
                "namespace": {"type": "text"},
                "obsolete": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "ontology_id": {"type": "text"},
                "ontology_name": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "ref": {"type": "text"},
                "root": {"type": "text"},
                "scale_class": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "scale_id": {"type": "text"},
                "scale_id_for_modification_blank_for_new": {"type": "text"},
                "scale_name": {"type": "text", "copy_to": "all_data"},
                "scale_xref": {"type": "text"},
                "scientist": {"type": "text"},
                "sequence": {"type": "text"},
                "subset": {"type": "text"},
                "synonym": {"type": "text"},
                "synonyms_separate_by_commas": {"type": "text"},
                "term_type": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "trait_class": {
                    "type": "text",
                    "copy_to": "all_data",
                    "fields": {"keyword": {"type": "keyword"}},
                },
                "trait_description": {"type": "text", "copy_to": "all_data"},
                "trait_id": {"type": "text"},
                "trait_id_for_modification_blank_for_new": {"type": "text"},
                "trait_name": {"type": "text", "copy_to": "all_data"},
                "trait_status": {"type": "text"},
                "trait_synonyms": {"type": "text", "copy_to": "all_data"},
                "trait_xref": {"type": "text"},
                "type_of_measure_continuous_discrete_or_categorical": {"type": "text"},
                "upper_limit": {"type": "text"},
                "variable_description": {"type": "text", "copy_to": "all_data"},
                "variable_id": {"type": "text"},
                "variable_label": {"type": "text", "copy_to": "all_data"},
                "variable_name": {"type": "text", "copy_to": "all_data"},
                "variable_status": {"type": "text"},
                "variable_status_rn_bd": {"type": "text"},
                "variable_synonyms": {"type": "text", "copy_to": "all_data"},
                "variable_xref": {"type": "text"},
                "xref": {"type": "text"},
                "xref_parent": {"type": "text"},
                "ynonym": {"type": "text"},
            }
        },
    }
    return _json


def _get_term_search_dict(term_id):
    """
    Constructs a ES search that will be used to search Terms in the index
    :param term_id: The Term to search if it exists
    :return: A dict that will be passes to ES
    """
    _dict = {"query": {"bool": {"must": {"term": {"_id": term_id}}}}}
    # _dict = {"query": {"terms": {"_id": [term_id]}}}
    return _dict


def _get_ontology_search_dict(ontology_id):
    """
    Constructs a ES search that will be used to search Terms in the index by ontology ID
    :param ontology_id: The Ontology ID to search if it exists
    :return: A dict that will be passes to ES
    """
    _dict = {"query": {"match": {"ontology_id": ontology_id}}}
    return _dict


def get_term_index_manager(request):
    return TermIndexManager(request.registry.settings)


def configure_term_index_manager(settings):
    return TermIndexManager(settings)


class TermIndexManager(object):
    """
    The Manager class handles all activity feed operations.
    """

    def create_connection(self):
        """
        Creates a connection to ElasticSearch and pings it.
        :return: A tested (pinged) connection to ElasticSearch
        """
        if not isinstance(self.port, int):
            raise ValueError("Port must be an integer")
        if not isinstance(self.host, str):
            raise ValueError("Host must be string")
        if self.url_prefix is not None:
            if not isinstance(self.url_prefix, str):
                raise ValueError("URL prefix must be string")
        if not isinstance(self.use_ssl, bool):
            raise ValueError("Use SSL must be boolean")
        cnt_params = {"host": self.host, "port": self.port}
        if self.url_prefix is not None:
            cnt_params["url_prefix"] = self.url_prefix
        if self.use_ssl:
            cnt_params["use_ssl"] = self.use_ssl
        connection = Elasticsearch([cnt_params], max_retries=1)
        if connection.ping():
            return connection
        else:
            return None

    def __init__(self, settings):
        """
        The constructor of the Term index manager. It creates the Term index if it doesn't exist. See
        https://www.elastic.co/guide/en/elasticsearch/reference/current/_basic_concepts.html#getting-started-shards-and-replicas
        for more information about shards and replicas
        :param settings: Pyramid settings.
        """

        try:
            self.host = settings["elasticsearch.term.host"]
        except KeyError:
            self.host = "localhost"

        try:
            self.port = int(settings["elasticsearch.term.port"])
        except KeyError:
            self.port = 9200

        try:
            self.index_name = settings["elasticsearch.term.index_name"]
        except KeyError:
            self.index_name = "co_terms"

        try:
            self.url_prefix = settings["elasticsearch.term.url_prefix"]
        except KeyError:
            self.url_prefix = None

        try:
            use_ssl = settings["elasticsearch.term.use_ssl"]
            if use_ssl == "True":
                self.use_ssl = True
            else:
                self.use_ssl = False
        except KeyError:
            self.use_ssl = False

        try:
            number_of_shards = int(settings["elasticsearch.term.number_of_shards"])
        except KeyError:
            number_of_shards = 5

        try:
            number_of_replicas = int(settings["elasticsearch.term.number_of_replicas"])
        except KeyError:
            number_of_replicas = 1

        connection = self.create_connection()
        if connection is not None:
            if not connection.indices.exists(self.index_name):
                try:
                    connection.indices.create(
                        self.index_name,
                        body=_get_term_index_definition(
                            number_of_shards, number_of_replicas
                        ),
                    )
                except RequestError as e:
                    if e.status_code == 400:
                        if e.error.find("already_exists") >= 0:
                            pass
                        else:
                            raise e
                    else:
                        raise e

        else:
            raise RequestError("Cannot connect to ElasticSearch")

    def term_exists(self, term_id):
        """
        Check whether a Term already exists in the index
        :param term_id: The link object to check if exists
        :return: True if exists otherwise False
        """
        connection = self.create_connection()
        if connection is not None:
            res = connection.search(
                index=self.index_name, body=_get_term_search_dict(term_id)
            )
            # print("*****************************99999")
            # print(res)
            # print("*****************************99999")
            if res["hits"]["total"]["value"] > 0:
                return True
        else:
            raise RequestError("Cannot connect to ElasticSearch")
        return False

    def add_term(self, term_id, data_dict):
        """
        Adds a use to the index
        :param term_id: The Term to add into the index
        :param data_dict: The data related to the Term as dict
        :return: The unique ID give to the link
        """

        if not self.term_exists(term_id):
            connection = self.create_connection()
            if connection is not None:
                connection.index(index=self.index_name, id=term_id, body=data_dict)
            else:
                raise RequestError("Cannot connect to ElasticSearch")
        else:
            raise TermExistError()

    def remove_term(self, term_id):
        """
        Removes an Term from the index
        :param term_id: The Term to be removed.
        :return: Bool
        """

        if self.term_exists(term_id):
            connection = self.create_connection()
            if connection is not None:
                connection.delete_by_query(
                    index=self.index_name,
                    body=_get_term_search_dict(term_id),
                )
                return True
            else:
                raise RequestError("Cannot connect to ElasticSearch")
        else:
            raise TermNotExistError()

    def remove_ontology(self, ontology_id):
        """
        Removes an Term from the index
        :param ontology_id: The Ontology to be removed.
        :return: Bool
        """

        connection = self.create_connection()
        if connection is not None:
            connection.delete_by_query(
                index=self.index_name,
                body=_get_ontology_search_dict(ontology_id),
            )
            return True
        else:
            raise RequestError("Cannot connect to ElasticSearch")

    def update_term(self, term_id, data_dict):
        """
        Updates a Term from the index
        :param term_id: The Term to be removed.
        :param data_dict: New Term data
        :return: Bool
        """
        if self.term_exists(term_id):
            connection = self.create_connection()
            if connection is not None:
                es_data_dict = {"doc": data_dict}
                connection.update(
                    index=self.index_name,
                    id=term_id,
                    body=es_data_dict,
                )
                return True
            else:
                raise RequestError("Cannot connect to ElasticSearch")
        else:
            raise TermNotExistError()

    def query_term(self, q, query_from, query_size):
        query = q.replace("*", "")

        query_dict = {
            "query": {
                "match_phrase": {"all_data": query},
            },
            "aggs": {
                "term_type": {"terms": {"field": "term_type.keyword"}},
                "ontology": {"terms": {"field": "ontology_name.keyword"}},
            },
        }
        if query_from is not None:
            query_dict["from"] = query_from
        if query_size is not None:
            query_dict["size"] = query_size

        connection = self.create_connection()
        if connection is not None:
            es_result = connection.search(index=self.index_name, body=query_dict)
            if es_result["hits"]["total"]["value"] > 0:
                total = es_result["hits"]["total"]["value"]
                return es_result, total
        else:
            raise RequestError("Cannot connect to ElasticSearch")
        return {}, 0

    def free_query(self, query_dict, query_from=0, query_size=10000):
        if query_from is not None:
            query_dict["from"] = query_from
        if query_size is not None:
            query_dict["size"] = query_size

        connection = self.create_connection()
        if connection is not None:
            es_result = connection.search(index=self.index_name, body=query_dict)
            if es_result["hits"]["total"]["value"] > 0:
                total = es_result["hits"]["total"]["value"]
                return es_result, total
        else:
            raise RequestError("Cannot connect to ElasticSearch")
        return {}, 0

    def free_query_count(self, query_dict):
        connection = self.create_connection()
        if connection is not None:
            es_result = connection.count(index=self.index_name, body=query_dict)
            return es_result
        else:
            raise RequestError("Cannot connect to ElasticSearch")
