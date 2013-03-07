exports = rdf = function(ontoEntity) {
    this.ontology = select.fn.toJS(ontoEntity); 
    this.ontoDate = ontoEntity.getProperty('created_at');
    this.co = 'http://www.cropontology.org/';
    this.uri = this.co + 'rdf/';
    this.page = this.co + 'ontology/' + this.ontology.ontology_id;

    this.turtle = '';
};
rdf.prototype.buildPrefix = function() {
    this.turtle += ['@prefix : <'+this.uri +'>.',
        '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.',
        '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.',
        '@prefix owl: <http://www.w3.org/2002/07/owl#>.',
        '@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.',
        '@prefix foaf: <http://xmlns.com/foaf/0.1/>.',
        '@prefix dct: <http://purl.org/dc/terms/>.'].join('\n');

    this.turtle += '\n\n';
}
rdf.prototype.buildOnto = function() {
    var df = new SimpleDateFormat("yyyy-MM-dd");
    var date = df.format(this.ontoDate);

    this.turtle += ['<' + this.page + '> a owl:Ontology;',
        '   dct:title "' + this.ontology.ontology_name + '"@en;',
        '   dct:description "' + this.ontology.ontology_summary + '"@en;',
        '   foaf:page <' + this.page + '>;',
        '   rdfs:seeAlso <' + this.co + '>;',
        '   rdfs:seeAlso <https://github.com/bioversity/Crop-Ontology>;',
        '   dct:hasFormat <' + this.page + '/' + this.ontology.ontology_name + '/ttl>;',
        '   dct:source <' + this.co + '>;',
        '   dct:valid "' + date + '"^^xsd:date;',
        '   .'].join('\n');
    this.turtle += '\n\n';
}
rdf.prototype.findLangs = function(value) {
    try {
        var obj = JSON.parse(value);
    } catch(e) {
        return { "english": value };
    }
    return obj;
}
rdf.prototype.buildProperty = function(term) {
    this.turtle += ':' + term.id + ' a rdf:Property;\n';
    // do name
    var names = this.findLangs(term.name);
    for(var i in names) {
        this.turtle += '   rdfs:label "' + names[i] + '"@' + languages.getIso[i].toLowerCase() + ';\n';
    }

    // do description
    if(term.description) {
        var desc = this.findLangs(term.description);
    } else if(term['Describe how measured (method)']) {
        var desc = this.findLangs(term['Describe how measured (method)']);
    } else { // no descritption
        var desc = {};
    }
    for(var i in desc) {
        this.turtle += '   rdfs:comment "' + desc[i] + '"@' + languages.getIso[i].toLowerCase() + ';\n';
    }
    // domain
    this.turtle += '   rdfs:domain :' + term.parent + ';\n';
    /*
    rdfs:range xsd:date;
    rdfs:isDefinedBy <http://schema.org/Person>;
    */
    this.turtle += '   .\n';
}
rdf.prototype.buildClass = function(term) {
    this.turtle += ':' + term.id + ' a rdfs:Class;\n';

    // do name
    var names = this.findLangs(term.name);
    for(var i in names) {
        this.turtle += '   rdfs:label "' + names[i] + '"@' + languages.getIso[i].toLowerCase() + ';\n';
    }

    // do description
    if(term.description) {
        var desc = this.findLangs(term.description);
    } else if(term['Description of Trait']) {
        var desc = this.findLangs(term['Description of Trait']);
    } else { // no descritption
        var desc = {};
    }
    for(var i in desc) {
        this.turtle += '   rdfs:comment "' + desc[i] + '"@' + languages.getIso[i].toLowerCase() + ';\n';
    }

    if(term.parent != 'null') {
        this.turtle += '   rdfs:subClassOf :' + term.parent + ';\n';
    }

    this.turtle += '   rdfs:isDefinedBy <' + this.co + 'terms/' + term.id + '>;\n',

    this.turtle += '   .\n';
}
rdf.prototype.buildTurtle = function() {
    var that = this;

    this.buildPrefix();
    this.buildOnto();

    select('term')
        .find({ 
            ontology_id: this.ontology.ontology_id
        })
        .sort('id', 'DESC')
        .each(function() {
            if(this.relationship) {
                that.buildProperty(this);
            } else {
                that.buildClass(this);
            }
        });

    return this.turtle;
};
