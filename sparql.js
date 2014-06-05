importPackage(org.apache.http.client.fluent);
importPackage(org.apache.http.entity);

var rdfPath = getServletConfig().getServletContext().getInitParameter('rdf-path');
exports = {
    prefixes: [
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
        'PREFIX co: <http://www.cropontology.org/>',
        'PREFIX cov: <http://www.cropontology.org/vocab/>'

    ],
    query: function(q) {
        for(var i=0; i<this.prefixes.length; i++) {
            q = this.prefixes[i] + '\n' + q;
        }
        var sparqlResult = Request.Get(sparqlQuery + '?output=json&query=' + encodeURIComponent(q))
            .execute().returnContent();
            
        var obj = JSON.parse(sparqlResult.asString());
        var bindings = obj.results.bindings;

        return bindings;
    },
    update: function(q) {
        for(var i=0; i<this.prefixes.length; i++) {
            q = this.prefixes[i] + '\n' + q;
        }
        
        // convert string to stream
        var javaStr = new java.lang.String(q);
        var stream = new ByteArrayInputStream(javaStr.getBytes("UTF-8"));
        
        var sparqlResult = Request.Post(sparqlUpdate)
            .bodyStream(stream, ContentType.create('application/sparql-update'))
            .execute().returnContent().asString();

        return sparqlResult;
    }
}