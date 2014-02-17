importPackage(org.apache.commons.io);
importPackage(com.hp.hpl.jena.rdf.model);
importPackage(com.hp.hpl.jena.rdf.model.impl);

exports = {
    convert: function(inpStream, lang, outputStream) {
        var model = ModelFactory.createDefaultModel();

        model.read(inpStream, null);
        model.write(outputStream, lang.toUpperCase());

        //IOUtils.copy(inpStream, outputStream);
    }
};
