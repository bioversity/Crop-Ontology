from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "123"))
db = driver.session()

updates = []
updates.append(
    "MATCH (n:Term) WHERE EXISTS (n.variable_name) REMOVE n:Term SET n:Variable"
)
updates.append("MATCH (n:Term) WHERE EXISTS (n.trait_name) REMOVE n:Term SET n:Trait")
updates.append("MATCH (n:Term) WHERE EXISTS (n.method_name) REMOVE n:Term SET n:Method")
updates.append("MATCH (n:Term) WHERE EXISTS (n.scale_name) REMOVE n:Term SET n:Scale")
updates.append(
    'MATCH (n:Variable) WHERE n.term_type = "term" REMOVE n.term_type SET n.term_type = "variable"'
)
updates.append(
    'MATCH (n:Trait) WHERE n.term_type = "term" REMOVE n.term_type SET n.term_type = "trait"'
)
updates.append(
    'MATCH (n:Method) WHERE n.term_type = "term" REMOVE n.term_type SET n.term_type = "method"'
)
updates.append(
    'MATCH (n:Scale) WHERE n.term_type = "term" REMOVE n.term_type SET n.term_type = "scale"'
)

for an_update in updates:
    db.run(an_update)

driver.close()
