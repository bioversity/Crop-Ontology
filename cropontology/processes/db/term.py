import redis


class InvalidLastTerm(Exception):
    """
    Exception raised when the last ID is not int
    """

    def __str__(self):
        return "Link object already exists in network"


def set_ontology_last_term_id(request, ontology_id, last_id):
    redis_host = request.registry.settings.get("redis.sessions.host", "localhost")
    redis_port = int(request.registry.settings.get("redis.sessions.port", "6379"))
    r = redis.Redis(host=redis_host, port=redis_port)
    if type(last_id) is int:
        r.mset({ontology_id: last_id})
    else:
        raise InvalidLastTerm("The last ID is not integer")


def get_ontology_new_term_id(request, ontology_id):
    redis_host = request.registry.settings.get("redis.sessions.host", "localhost")
    redis_port = int(request.registry.settings.get("redis.sessions.port", "6379"))
    r = redis.Redis(host=redis_host, port=redis_port)
    if r.get(ontology_id) is not None:
        r.incr(ontology_id)
        return r.get(ontology_id)
    else:
        return None
