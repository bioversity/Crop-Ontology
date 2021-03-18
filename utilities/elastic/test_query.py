from cropontology.processes.elasticsearch.term_index import configure_term_index_manager

IndexManager = configure_term_index_manager(
    {"elasticsearch.term.index_name": "co_terms"}
)

res, number = IndexManager.query_term("Tuber weight per plant", 0, 10)
print(res["aggregations"])
