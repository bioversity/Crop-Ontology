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
        '@prefix skos: <http://www.w3.org/2004/02/skos/core#>.'].join('\n');

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
rdf.prototype.convertId = function(id) {
    function idUrl() { return arguments[1].toUpperCase(); };
    id = id.replace(/ (.)/g, idUrl);
    id = id.replace(/\(|\)|,|&|\/| |%/g, '');
    return id;
}
rdf.prototype.buildConcept = function(term) {
    var names = this.findLangs(term.name);
    if(names.english == 'Categorical' || names.english == 'Continuous' || names.english == 'Discrete') {
        return;
    }

    // make term.id and term.parent a nice CamelCase if it has words
    term.id = this.convertId(term.id);
    term.parent = this.convertId(term.parent);

    this.turtle += ':' + term.id + ' a skos:Concept;\n';
    
    // do name
    for(var i in names) {
        var jsonName = JSON.stringify(names[i]);
        if(jsonName != undefined) {
            this.turtle += '   rdfs:label ' + jsonName + '@' + languages.getIso[i].toLowerCase() + ';\n';
        }
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
        var jsonDesc = JSON.stringify(desc[i]);
        if(jsonDesc != undefined) {
            this.turtle += '   rdfs:comment ' + jsonDesc + '@' + languages.getIso[i].toLowerCase() + ';\n';
        }
    }

    // broader
    if(term.parent != 'null') {
        this.turtle += '   skos:broader :' + term.parent + ';\n';
    }

    this.turtle += '   .\n';
}
rdf.prototype.buildTriple = function(term) {
    var names = this.findLangs(term.name);
    if(names.english == 'Categorical' || names.english == 'Continuous' || names.english == 'Discrete') {
        return;
    }
    
    // let's escape the ID
    term.id = encodeURIComponent(term.id);
    term.parent = encodeURIComponent(term.parent);

    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#type> <http://www.w3.org/2004/02/skos/core#Concept> .\n';
    
    // do name
    for(var i in names) {
        var jsonName = JSON.stringify(names[i]);
        if(jsonName != undefined) {
            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#label> ' + jsonName + '@' + languages.getIso[i].toLowerCase() + ' .\n';
        }
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
        var jsonDesc = JSON.stringify(desc[i]);
        if(jsonDesc != undefined) {
            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#comment> ' + jsonDesc + '@' + languages.getIso[i].toLowerCase() + ' .\n';
        }
    }

    // broader
    if(term.parent != 'null') {
        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broader> <' + this.uri + term.parent + '> .\n';
    }
}
rdf.prototype.buildTurtle = function() {
    var that = this;

    this.buildPrefix();
    //this.buildOnto();

    select('term')
        .find({ 
            ontology_id: this.ontology.ontology_id
        })
        .sort('id', 'DESC')
        .each(function() {
            that.buildConcept(this);
            /*
            if(this.relationship) {
                that.buildProperty(this);
            } else {
                that.buildClass(this);
            }
            */
        });

    return this.turtle;
};

rdf.prototype.buildNtriples = function() {
    var that = this;

    select('term')
        .find({ 
            ontology_id: this.ontology.ontology_id
        })
        .sort('id', 'DESC')
        .each(function() {
            that.buildTriple(this);
            /*
            if(this.relationship) {
                that.buildProperty(this);
            } else {
                that.buildClass(this);
            }
            */
        });

    return this.turtle;
};
