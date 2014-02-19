importPackage(org.apache.commons.io);
importPackage(com.hp.hpl.jena.rdf.model);
importPackage(com.hp.hpl.jena.rdf.model.impl);

exports = {
    convert: function(inpStream, lang, outputStream) {
        var model = ModelFactory.createDefaultModel();

        model.read(inpStream, null, 'N3');
        model.write(outputStream, lang.toUpperCase());

        //IOUtils.copy(inpStream, outputStream);
    }
};
