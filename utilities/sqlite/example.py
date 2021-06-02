import sqlite3
from neo4j import GraphDatabase

conn = sqlite3.connect(
    "/home/cquiros/data/projects2017/cropontology/yara/data/data.sqlite"
)
driver = GraphDatabase.driver("bolt://192.168.0.107:7687", auth=("neo4j", "123"))


def merge_products(tx, id, name, n, p, k, region):
    tx.run(
        "MATCH (p {rdfs__label: $region}) MERGE (c:instance {id: $id, name: $name, n: $n, p: $p, k: $k}) "
        "MERGE (c)-[:in_region]-(p)",
        id=id,
        region=region,
        name=name,
        n=n,
        p=p,
        k=k,
    )


def create_constraint(tx):
    unique_ids = """CREATE CONSTRAINT ON (t:Term) ASSERT t.id IS UNIQUE"""
    tx.run(unique_ids)


with driver.session() as session:
    session.write_transaction(create_constraint)


cursor = conn.execute(
    "select product_region.id,product_region.name,"
    "product_region.n,p,k,region.name as region "
    "FROM product_region,region WHERE product_region.regionId = region.id"
)
for row in cursor:
    with driver.session() as session:
        session.write_transaction(
            merge_products, row[0], row[1], row[2], row[3], row[4], row[5]
        )
    # print(row[0])
    # print(row[1])
    # print(row[2])
    # print(row[3])
    # print(row[4])
    # print(row[5])
driver.close()
