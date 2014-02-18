var sparqlUrl = getServletConfig().getInitParameter('sparql');
exports = {
    prefixes: [
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
        'PREFIX co: <http://www.cropontology.org/>',
        'PREFIX cov: <http://www.cropontology.org/vocab/>'

    ],
    query: function(q) {
    },
    update: function(q) {
        for(var i=0; i<this.prefixes.length; i++) {
            q = this.prefixes[i] + '\n' + q;
        }
    }
}
