importPackage(org.apache.commons.io);
importPackage(com.hp.hpl.jena.rdf.model);
importPackage(com.hp.hpl.jena.rdf.model.impl);
importPackage(com.hp.hpl.jena.query);
importPackage(com.hp.hpl.jena.update);
importPackage(org.apache.jena.riot);
importPackage(org.apache.jena.riot.system);
importPackage(org.apache.jena.riot.out);

var rdfPath = getServletConfig().getServletContext().getInitParameter('rdf-path');
var baseUri = 'http://www.cropontology.org/rdf/';
exports = {
    prefixes: [
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
        'PREFIX co: <http://www.cropontology.org/>',
        'PREFIX cov: <http://www.cropontology.org/vocab/>'

    ],
    convert: function(baseUri, fileName, inpStream, outputStream, langOut) {
        var lang = RDFLanguages.filenameToLang(fileName);
        var model = ModelFactory.createDefaultModel();

        if(lang != null) {
            lang = lang.getLabel(); 
        }

        model.read(inpStream, baseUri, lang);
        model.write(outputStream, langOut.toUpperCase());

        //IOUtils.copy(inpStream, outputStream);
    },
    // cb() is cb(triple)
    parse: function(inputStream, fileName, baseUri, cb) {
        var lang = RDFLanguages.filenameToLang(fileName);
        var model = ModelFactory.createDefaultModel();

        if(lang != null) {
            lang = lang.getLabel(); 
        }

        model.read(inputStream, baseUri, lang);

        for(var iter = model.listStatements(); iter.hasNext(); ) {
            var elem = iter.next();
            cb(elem.asTriple());
        }
    },
    createModel: function(inputStream, fileName, baseUri) {
        var lang = RDFLanguages.filenameToLang(fileName);
        var model = ModelFactory.createDefaultModel();
        if(lang != null) {
            lang = lang.getLabel(); 
        }
        model.read(inputStream, baseUri, lang);
        return model;
    },
    createModelAndFile: function(filePath) {
        var filePath = rdfPath + filePath;
        var file = new File(filePath);
        try {
            var inputStream = new FileInputStream(file);
        } catch(e) {
            if(e.javaException instanceof FileNotFoundException) {
                // create intermediate paths
                file.getParentFile().mkdirs();
                file.createNewFile();
            }
        }
        if(!inputStream) {
            var inputStream = new FileInputStream(file);
        }        

        var model = rdf.createModel(inputStream, filePath, baseUri);
        return {
            model: model,
            file: file
        };
    },
    queryModel: function(queryString, model) {
        var query = QueryFactory.create(queryString);

        // Execute the query and obtain results
        var qe = QueryExecutionFactory.create(query, model);
        var results = qe.execSelect();

        var arr = [];
        while(results.hasNext()) {
            var querySolution = results.next();
            var obj = {};

            var iter = querySolution.varNames();
            while(iter.hasNext()) {
                var varName = iter.next();
                var rdfNode = querySolution.get(varName);
                obj[varName] = rdfNode;
            }

            arr.push(obj);
        }

        qe.close();
        return arr;
    },
    query: function(filePath, queryString) {
        // add prefixes to sparql query
        for(var i=0; i<this.prefixes.length; i++) {
            queryString = this.prefixes[i] + '\n' + queryString;
        }

        var modelAndFile = rdf.createModelAndFile(filePath);

        var results = rdf.queryModel(queryString, modelAndFile.model);

        return results;
    },
    updateModel: function(updateString, model) {
        var updateRequest = UpdateFactory.create(updateString);

        UpdateAction.execute(updateRequest, model);
    },
    update: function(filePath, updateString) {
        var modelAndFile = rdf.createModelAndFile(filePath);

        for(var i=0; i<this.prefixes.length; i++) {
            updateString = this.prefixes[i] + '\n' + updateString;
        }

        var model = modelAndFile.model;
        rdf.updateModel(updateString, model);

        // persist to disk
        var fileOut = new FileOutputStream(modelAndFile.file);
        model.write(fileOut, 'TURTLE', baseUri);
        model.close();
    }
    /*
    parse: function(inputStream, fileName, baseUri, cb) {
        var lang = RDFLanguages.filenameToLang(fileName);
        //var output = new SinkTripleOutput(System.out, null, SyntaxLabels.createNodeToLabel());
        var o = {
            //triple: function(triple) {
            //    output.send(triple);
            //}
            triple: cb
        }
        var rdfBase = new JavaAdapter(StreamRDFBase, o);

        RDFDataMgr.parse(rdfBase, inputStream, baseUri, lang);

    }
    */
};
