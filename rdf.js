exports = rdf = function(ontologyId) {
    this.ontologyId = ontologyId; 
};
rdf.prototype.nTriples = function() {
    var vals;
    select('term')
        .find({ 
            ontology_id: this.ontologyId
        })
        .values(function(values) {
            vals = values; 
        });
    return JSON.stringify(vals);
};
