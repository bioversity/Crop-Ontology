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
    prefixes: {
        'foaf': 'http://xmlns.com/foaf/0.1/',
        'co': 'http://www.cropontology.org/',
        'owl': 'http://www.w3.org/2002/07/owl#',
        'skos': 'http://www.w3.org/2004/02/skos/core#',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'cov': 'http://www.cropontology.org/vocab/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    },
    prefixURI: function(uri) {
        for(var i in rdf.prefixes) {
            var prefixVal = rdf.prefixes[i];
            if(uri.indexOf(prefixVal) == 0) { // starts with
                return uri.replace(prefixVal, i + ':');
            }
        }
        // hrm no prefix available, shorten the URI?
        return uri;
    },
    buildSparqlPrefixes: function() {
        var str = '';
        for(var i in this.prefixes) {
            str += 'PREFIX '+i+': <'+this.prefixes[i]+'>\n';
        }
        return str;
    },
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
    // gets all files and sub-files
    getAllFiles: function(dir, ret) {
        var ret = ret || [];
        var files = dir.listFiles();
        for(var i=0; i<files.length; i++) {
            var f = files[i];
            if(f.isDirectory()) {
                rdf.getAllFiles(f, ret);
            } else {
                ret.push(f);
            }
        }
        return ret;
    },
    createPath: function(filePath) {
        var file = new File(rdfPath + filePath);
        if(!file.exists()) {
            // create intermediate paths
            file.getParentFile().mkdirs();
            file.createNewFile();
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
    createModelFrom: function(filePath) {
        var filePath = rdfPath + filePath;
        var file = new File(filePath);
        if(file.isDirectory()) { 
            // get all files (and subfiles) within this dir
            var files = rdf.getAllFiles(file);

            // create a model
            // and read() all these files
            var model = ModelFactory.createDefaultModel();
            for(var i=0; i<files.length; i++) {
                var f = files[i];
                var lang = RDFLanguages.filenameToLang(f.getName());
                if(lang != null) {
                    lang = lang.getLabel(); 
                }
                if(lang) {
                    // this means it's RDF, do the model.read stuff
                    var inputStream = new FileInputStream(f);
                    try {
                        model.read(inputStream, this.baseUri, lang);
                    } catch(e) { // invalid rdf
                    }
                } else {
                    // not rdf, figure out which file it is
                    // figure out format using extension
                    rdf.readNonRDFInto(model, f);
                }
            }
            return model;
        } else {
            var inputStream = new FileInputStream(file);

            var model = rdf.createModel(inputStream, filePath, this.baseUri);
            return model;
        }
    },
    readNonRDFInto: function(model, file) {
        var ext = FilenameUtils.getExtension(file.getName()).toLowerCase();
        var inputStream = new FileInputStream(file);

        var jsonld = { '@graph': [], '@context': {} };
        /*
        var jsonld = {
            "@context": {
                "name": "http://",
                "homepage": {
                    "@id": "http://xmlns.com/foaf/0.1/homepage",
                    "@type": "@id"
                }
            },
            "@graph": [{
                name: "bar"
            }]
        };
        */
        if(ext == 'obo') {
            // convert OBO to rdf
        } else if(ext == 'csv' || ext == 'xls' || ext == 'xlsx'){
            // convert template to rdf
            excel.parseTemplate(inputStream, function(term) {
                /*
                term['@id'] = 'foo';
                term['@type'] = 'foo';
                */
                // update @context
                var context = {};
                for(var i in term) {
                    context[i] = 'http://';
                }
                jsonld['@context'] = context;
                jsonld['@graph'].push(term);
            });

            var jsonldStringified = new java.lang.String(JSON.stringify(jsonld));
            var jsonStream = new ByteArrayInputStream(jsonldStringified.getBytes("UTF-8"));
            model.read(jsonStream, this.baseUri, 'JSON-LD');
        }
    },
    queryModel: function(queryString, model) {
        // add prefixes to sparql query
        queryString = rdf.buildSparqlPrefixes() + queryString;
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
        // create file if it doesn't exist
        rdf.createPath(filePath);

        var model = rdf.createModelFrom(filePath);
        var results = rdf.queryModel(queryString, model);

        return results;
    },
    updateModel: function(updateString, model) {
        var updateRequest = UpdateFactory.create(updateString);

        UpdateAction.execute(updateRequest, model);
    },
    update: function(filePath, updateString) {
        // create file if it doesn't exist
        rdf.createPath(filePath);

        var model = rdf.createModelFrom(filePath);
        updateString = rdf.buildSparqlPrefixes() + updateString;

        rdf.updateModel(updateString, model);

        // persist to disk
        var fileOut = new FileOutputStream(rdfPath + filePath);
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
