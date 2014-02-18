importPackage(org.apache.http.client.fluent);
importPackage(org.apache.http.entity);

var sparqlQuery = getServletConfig().getInitParameter('sparql-query');
var sparqlUpdate = getServletConfig().getInitParameter('sparql-update');
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
        var sparqlResult = Request.Post(sparqlUpdate)
            .bodyString(q, ContentType.create('application/sparql-update'))
            .execute().returnContent().asString();


        return sparqlResult;
    }
}
