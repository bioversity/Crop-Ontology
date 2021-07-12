from .classes import PublicView
from pyramid.response import Response
import json
from neo4j import GraphDatabase
import paginate
import pymongo
import pandas
from datetime import datetime

class TemplateLoadView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True

        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]

        neo4j_bolt_url = self.request.registry.settings["neo4j.bolt.ulr"]
        neo4j_user = self.request.registry.settings["neo4j.user"]
        neo4j_password = self.request.registry.settings["neo4j.password"]
        driver = GraphDatabase.driver(neo4j_bolt_url, auth=(neo4j_user, neo4j_password))
        db = driver.session()

        terms = []

        ontology_id = self.request.matchdict["ontology_id"]
        print(ontology_id)

        ## read excel file
        template = "/Users/marie-angeliquelaporte/Downloads/TD_test.xlsx"
        td = pandas.read_excel(template, sheet_name='Template for submission')
        td.fillna('', inplace=True)


        exists = False
        root = None

        date = datetime.today().strftime('%Y-%m-%d-%H:%M:%S')
        #print(td)
        for index, row in td.iterrows():
        	print(row['Crop'])
        	#print(index)
        	#terms.append("CREATE (a:Variable) SET a.id = '"+row['Variable ID']+"'")
        	##check if ontology exists
        	if index == 0:
        		#query = ('MATCH (n) WHERE n.ontology_name="'+row['Crop']+'" RETURN n')
        		query = ('MATCH (n) WHERE n.ontology_id="'+ontology_id+'" RETURN n')
        		cursor = db.run(query)
        		for item in cursor: ## need a more elegant way to test that....
        			exists = True
        			break
        	## if ontology does not exist - create root
        	if not exists:
        		print("onto does not exists")
        		if not root:
        			query = ("CREATE (a) SET a:Term, a.id = '"+ontology_id+":ROOT', a.ontology_id = '"+ontology_id+"' , " +
        				" a.ontology_name = '"+row['Crop']+"' , a.name = '"+row['Crop']+" traits' , a.root = 'true' , " +
        				" a.obsolete = 'false' , a.created_at = '"+date+"' , a.language = '"+row['Language']+"' , " +
        				" a.term_type = 'term' RETURN a")
        			db.run(query)
        			root = True

        		## create variable
        		#### mandatory fields
        		query = ("CREATE (a) SET a:Variable, a.id = '"+row['Variable ID']+"', a.variable_id = '"+row['Variable ID']+"', " +
        				" a.ontology_id = '"+ontology_id+"' , a.ontology_name = '"+row['Crop']+"' , a.crop = '"+row['Crop']+"' , " +
        				" a.name = '"+row['Variable name']+"' , a.variable_name = '"+row['Variable name']+"' ,"
        				" a.created_at = '"+date+"' , a.language = '"+row['Language']+"' , " +
        				" a.term_type = 'variable' ")
        		
        		#### other fieds - need to check if exist
        		if row['Variable synonyms']:
        			query += ", a.variable_synonyms = '"+row['Variable synonyms']+"' "
        		if row['Context of use']:
        			query += ", a.context_of_use = '"+row['Context of use']+"' "
        		if row['Growth stage']:
        			query += ", a.growth_stage = '"+row['Growth stage']+"' "
        		if row['Variable status']:
        			query += ", a.variable_status = '"+row['Variable status']+"' "
        		if row['Variable Xref']:
        			query += ", a.variable_xref = '"+row['Variable Xref']+"' "
        		if row['Institution']:
        			query += ", a.institution = '"+row['Institution']+"' "
        		if row['Scientist']:
        			query += ", a.scientist = '"+row['Scientist']+"' "

        		query += " RETURN a "
        		db.run(query)
        		#terms.append(query)

        		## create trait
        		#### mandatory fields
        		query = ("MERGE (a:Trait{id:'"+row['Trait ID']+"'}) ON CREATE SET a:Trait, a.id = '"+row['Trait ID']+"', a.trait_id = '"+row['Trait ID']+"', " +
        				" a.ontology_id = '"+ontology_id+"' , a.ontology_name = '"+row['Crop']+"' , " +
        				" a.name = '"+row['Trait name']+"' , a.trait_name = '"+row['Trait name']+"' ,"
        				" a.created_at = '"+date+"' , a.language = '"+row['Language']+"' , " +
        				" a.term_type = 'trait' ")
        		#### other fieds - need to check if exist
        		if row['Trait description']:
        			query += ", a.trait_description = '"+row['Trait description']+"' "
        		if row['Trait synonyms']:
        			query += ", a.trait_synonym = '"+row['Trait synonyms']+"' "
        		if row['Main trait abbreviation']:
        			query += ", a.main_trait_abbreviation = '"+row['Main trait abbreviation']+"' "
        		if row['Alternative trait abbreviations']:
        			query += ", a.alternative_trait_abbreviations = '"+row['Alternative trait abbreviations']+"' "
        		if row['Entity']:
        			query += ", a.entity = '"+row['Entity']+"' "
        		if row['Attribute']:
        			query += ", a.attribute = '"+row['Attribute']+"' "
        		if row['Trait status']:
        			query += ", a.trait_status = '"+row['Trait status']+"' "
        		if row['Trait Xref']:
        			query += ", a.trait_xref = '"+row['Trait Xref']+"' "

        		query += " RETURN a "
        		db.run(query)
        		#terms.append(query)

        		## create method
        		#### mandatory field
        		query = ("MERGE (a:Method{id: '"+row['Method ID']+"'}) ON CREATE SET a:Method, a.id = '"+row['Method ID']+"', a.method_id = '"+row['Method ID']+"', " +
        				" a.ontology_id = '"+ontology_id+"' , a.ontology_name = '"+row['Crop']+"' , " +
        				" a.name = '"+row['Method name']+"' , a.method_name = '"+row['Method name']+"' ,"
        				" a.created_at = '"+date+"' , a.language = '"+row['Language']+"' , " +
        				" a.term_type = 'method' ")
        		#### other fieds - need to check if exist
        		if row['Method description']:
        			query += ", a.method_description = '"+row['Method description']+"' "
        		if row['Formula']:
        			query += ", a.formula = '"+row['Formula']+"' "
        		if row['Method reference']:
        			query += ", a.method_reference = '"+row['Method reference']+"' "

        		query += " RETURN a "
        		db.run(query)

        		## create scale
        		#### mandatory fields
        		query = ("MERGE (a:Scale {id: '"+row['Scale ID']+"'}) ON CREATE SET a:Scale, a.id = '"+row['Scale ID']+"', a.scale_id = '"+row['Scale ID']+"', " +
        				" a.ontology_id = '"+ontology_id+"' , a.ontology_name = '"+row['Crop']+"' , " +
        				" a.name = '"+row['Scale name']+"' , a.scale_name = '"+row['Scale name']+"' ,"
        				" a.created_at = '"+date+"' , a.language = '"+row['Language']+"' , " +
        				" a.term_type = 'scale' ")
        		#### other fieds - need to check if exist
        		if row['Decimal places']:
        			query += ", a.decimal_places = '"+str(row['Decimal places'])+"' "
        		if row['Lower limit']:
        			query += ", a.lower_limit = '"+str(row['Lower limit'])+"' "
        		if row['Upper limit']:
        			query += ", a.upper_limit = '"+str(row['Upper limit'])+"' "
        		if row['Scale Xref']:
        			query += ", a.scale_xref = '"+row['Scale Xref']+"' "
        		i = 1
        		while row["Category " + str(i)]:
        			query += ", a.category_"+str(i)+" = '"+row["Category " + str(i)]+"' "   
        			i += 1

        		query += " RETURN a "
        		db.run(query)

        		## add relationship
        		query = ("MATCH (a:Variable), (b:Trait) " + 
        			"WHERE a.id = '"+row['Variable ID']+"' AND b.id = '"+row['Trait ID']+"' "+ 
        			"CREATE (a)-[r:VARIABLE_OF]->(b) ")
        		db.run(query)
        		query = ("MATCH (a:Variable), (b:Method) " + 
        			"WHERE a.id = '"+row['Variable ID']+"' AND b.id = '"+row['Method ID']+"' "+ 
        			"CREATE (a)-[r:VARIABLE_OF]->(b) ")
        		db.run(query)
        		query = ("MATCH (a:Variable), (b:Scale) " + 
        			"WHERE a.id = '"+row['Variable ID']+"' AND b.id = '"+row['Scale ID']+"' "+ 
        			"CREATE (a)-[r:VARIABLE_OF]->(b) ")
        		db.run(query)
        		query = ("MATCH (a:Scale), (b:Method) " + 
        			"WHERE a.id = '"+row['Scale ID']+"' AND b.id = '"+row['Method ID']+"' "+ 
        			"MERGE (a)-[r:SCALE_OF]->(b) ")
        		db.run(query)
        		query = ("MATCH (a:Method), (b:Trait) " + 
        			"WHERE a.id = '"+row['Method ID']+"' AND b.id = '"+row['Trait ID']+"' "+ 
        			"MERGE (a)-[r:METHOD_OF]->(b) ")
        		db.run(query)
        		
        		## add trait class
        		### test if class exists
        		### if not create class, if the node does not exist - create it: MERGE ON CREATE SET
        		query = ("MERGE (a:Term {id: '"+ontology_id+":"+row['Trait class']+"'}) ON CREATE SET a:Term, a.id = '"+ontology_id+":"+row['Trait class']+"' , a.ontology_id = '"+ontology_id+"' , " +
        				" a.ontology_name = '"+row['Crop']+"' , a.name = '"+row['Trait class']+"' , " +
        				" a.created_at = '"+date+"' , a.language = '"+row['Language']+"' , " +
        				" a.term_type = 'term' RETURN a")
        		db.run(query)
        		query = ("MATCH (a:Trait), (b:Term) " + 
        			"WHERE a.id = '"+row['Trait ID']+"' AND b.id = '"+ontology_id+":"+row['Trait class']+"' "+ 
        			"MERGE (a)-[r:RELATED_TO]->(b) ")
        		db.run(query)
        		query = ("MATCH (a:Term), (b:Term) " + 
        			"WHERE a.id = '"+ontology_id+":ROOT' AND b.id = '"+ontology_id+":"+row['Trait class']+"' "+ 
        			"MERGE (b)-[r:RELATED_TO]->(a) ")
        		db.run(query)
        		


        	##if ontology exist - don't delete, just update
        	else:
        		print("onto exists")
        	## if the node exists - drop it and recreate it

        	


        ## add to the databse
        #for term in terms:
        	#db.run(term)

        response = Response(headerlist=headers, status=200)
        response.text = "ok"
        return response