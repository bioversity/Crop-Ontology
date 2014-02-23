importPackage(org.apache.commons.io);
importPackage(com.hp.hpl.jena.rdf.model);
importPackage(com.hp.hpl.jena.rdf.model.impl);
importPackage(org.apache.jena.riot);
importPackage(org.apache.jena.riot.system);
importPackage(org.apache.jena.riot.out);

exports = {
    convert: function(baseUri, fileName, inpStream, outputStream, langOut) {
        var lang = RDFLanguages.filenameToLang(fileName);
        var model = ModelFactory.createDefaultModel();

        model.read(inpStream, baseUri, lang.getLabel());
        model.write(outputStream, langOut.toUpperCase());

        //IOUtils.copy(inpStream, outputStream);
    },
    // cb() is cb(triple)
    parse: function(inputStream, fileName, baseUri, cb) {
        var lang = RDFLanguages.filenameToLang(fileName);
        //var output = new SinkTripleOutput(System.out, null, SyntaxLabels.createNodeToLabel());
        var o = {
            /*
            triple: function(triple) {
                output.send(triple);
            }
            */
            triple: cb
        }
        var rdfBase = new JavaAdapter(StreamRDFBase, o);

        RDFDataMgr.parse(rdfBase, inputStream, baseUri, lang);

    }
};
