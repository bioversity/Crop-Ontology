importPackage(org.apache.commons.io);
importPackage(com.hp.hpl.jena.rdf.model);
importPackage(com.hp.hpl.jena.rdf.model.impl);
importPackage(com.hp.hpl.jena.query);
importPackage(com.hp.hpl.jena.update);
importPackage(org.apache.jena.riot);
importPackage(org.apache.jena.riot.system);
importPackage(org.apache.jena.riot.out);

var rdfPath = getServletConfig().getServletContext().getInitParameter('rdf-path');
exports = {
    baseUri: 'http://www.cropontology.org/rdf/',
    prefixes: [
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
        'PREFIX co: <http://www.cropontology.org/>',
        'PREFIX owl: <http://www.w3.org/2002/07/owl#>',
        'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>',
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
        'PREFIX cov: <http://www.cropontology.org/vocab/>',
        'PREFIX dc: <http://purl.org/dc/elements/1.1/>'

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
        if(file.isDirectory()) { 
            var files = file.listFiles();
            // create a model
            // and read() all these files
            var model = ModelFactory.createDefaultModel();
            for(var i=0; i<files.length; i++) {
                var f = files[i];
                var lang = RDFLanguages.filenameToLang(f.getName());
                if(lang != null) {
                    lang = lang.getLabel(); 
                }
                var inputStream = new FileInputStream(f);
                try {
                    model.read(inputStream, this.baseUri, lang);
                } catch(e) { // not rdf
                }
            }
            return { model: model }
        } else {
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

            var model = rdf.createModel(inputStream, filePath, this.baseUri);
            return {
                model: model,
                file: file
            };
        }
    },
    queryModel: function(queryString, model) {
        // add prefixes to sparql query
        for(var i=0; i<this.prefixes.length; i++) {
            queryString = this.prefixes[i] + '\n' + queryString;
        }
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
        model.write(fileOut, 'TURTLE', this.baseUri);
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
