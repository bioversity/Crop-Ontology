importPackage(org.apache.commons.io);
importPackage(com.hp.hpl.jena.rdf.model);
importPackage(com.hp.hpl.jena.rdf.model.impl);
importPackage(org.apache.jena.riot);

exports = {
    convert: function(fileName, inpStream, outputStream, langOut) {
        var lang = RDFLanguages.filenameToLang(fileName);
        var model = ModelFactory.createDefaultModel();

        model.read(inpStream, null, lang.getLabel());
        model.write(outputStream, langOut.toUpperCase());

        //IOUtils.copy(inpStream, outputStream);
    }
};
