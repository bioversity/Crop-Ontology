exports = rdf = function() {
    this.co = 'http://www.cropontology.org/';
    this.uri = this.co + 'rdf/';
    this.cptRes = 1;

    this.turtle = '';
};
rdf.prototype.encodeID = function(id) {
    var firstPart = false;
    var ids = id.split(':');
    if(ids.length > 1) { // there's a :
        var res = [];
        for(var i=0; i<ids.length; i++) {
            res.push(encodeURIComponent(ids[i]));
        }
        return res.join(':');
    } else {
        return encodeURIComponent(id);
    }
}
rdf.prototype.findLangs = function(value) {
    try {
        var obj = JSON.parse(value);
    } catch(e) {
        return { "english": value };
    }
    return obj;
}
rdf.prototype.translate = function(value) {
    try {
        var j = JSON.parse(value);
        if(j['english']) {
            value = j['english'];
        } else {
        // could be "undefined"
            if(j['undefined'])
                return j['undefined'];
            else
                return false;
            } 
    } catch(e) {
        //throw value;
    }
    return value;
}

rdf.prototype.convertId = function(id) {
    function idUrl() { return arguments[1].toUpperCase(); };
    id = id.replace(/ (.)/g, idUrl);
    id = id.replace(/\(|\)|,|&|\/| |%/g, '');
    return id;
}
rdf.prototype.buildTriple = function(term) {
    
    // let's escape the ID
    term.id = this.encodeID(term.id);

    //complicance with OLS and Protégé = the properties need to be defiend as restrictions of classes in order to be handled as object properties
    var restrictionSubClassPart = '<http://www.w3.org/2000/01/rdf-schema#subClassOf> _:genid';
    var restrictionPart = ' <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Restriction> .\n';
    var restrictionPropPart = ' <http://www.w3.org/2002/07/owl#onProperty> ';
    var restrictionClassPart = ' <http://www.w3.org/2002/07/owl#someValuesFrom> ';


    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2004/02/skos/core#Concept> .\n';
    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Class> .\n';
    
    // do name
    var names = this.findLangs(term['name']);

    for(var i in names) {
        var jsonName = JSON.stringify(names[i]);
        if(jsonName != undefined) {
            jsonName=jsonName.replace(/\\"/g, "");
            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#label> ' + jsonName + '@' + languages.getIso[i].toLowerCase() + ' .\n';
            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#prefLabel> ' + jsonName + '@' + languages.getIso[i].toLowerCase() + ' .\n';

        }
    }

    // do description
    if(term.description) {
        var desc = this.findLangs(term.description);
    } else if(term['def']) {
        var desc = this.findLangs(term['def']);
    } else if(term['Description of Trait']) {
        var desc = this.findLangs(term['Description of Trait']);
    } else if(term['Trait description']) {
        var desc = this.findLangs(term['Trait description']);
    } else if(term['Describe how measured (method)']) {
        var desc = this.findLangs(term['Describe how measured (method)']);
    } else if(term['Method description']) {
        var desc = this.findLangs(term['Method description']);
    } else { // no descritption
        var desc = {};
    }
    for(var i in desc) {
        var jsonDesc = JSON.stringify(desc[i]);
        if(jsonDesc != undefined) {
            jsonDesc=jsonDesc.replace(/\\"/g, "");
            //this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#comment> ' + jsonDesc + '@' + languages.getIso[i].toLowerCase() + ' .\n';
            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#definition> ' + jsonDesc + '@' + languages.getIso[i].toLowerCase() + ' .\n';
        }
    }

    // do synonym
    if(term.synonym) {
        var syn = this.findLangs(term.synonym);
    } else if(term['Synonyms (separate by commas)']) {
        var syn = this.findLangs(term['Synonyms (separate by commas)']);
    } else if(term['Trait synonyms']) {
        var syn = this.findLangs(term['Trait synonyms']);
    } else if(term['Variable synonyms']) {
        var syn = this.findLangs(term['Variable synonyms']);
    } else { // no descritption
        var syn = {};
    }
    for(var i in syn) {
        try{
            var jsonSyn = JSON.stringify(syn[i]).trim();
            if(jsonSyn != undefined) {
                //replace weird stuff. there is probably a better way to do so
                //jsonSyn=jsonSyn.replace(/\[\"\\\"/g, '');jsonSyn=jsonSyn.replace(/\\\"/g, "");jsonSyn=jsonSyn.replace(/\",\"/g, ",");jsonSyn=jsonSyn.replace(/\"\]/g, '');
                jsonSyn=jsonSyn.replace(/\\"/g, '');
                jsonSyn=jsonSyn.replace(/\"/g, '');
                if(jsonSyn.split(",").length > 1){//several syn
                    var jsonSynTab = jsonSyn.split(',');
                     for(var j=0; j<jsonSynTab.length; j++) {
                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#altLabel> "' + jsonSynTab[j] + '"@' + languages.getIso[i].toLowerCase() + ' .\n';
                    }
                }else{
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#altLabel> "' + jsonSyn + '"@' + languages.getIso[i].toLowerCase() + ' .\n';
                }
            }
        }catch(e){
            throw e;
        }
        
    }

    //do abbreviated name
    if(term['Abbreviated name']) {
        var abbrev = this.findLangs(term['Abbreviated name']);
    } else if(term['Trait abbreviation']) {
        var abbrev = this.findLangs(term['Trait abbreviation']);
    } else if(term['Main trait abbreviation']) {
        var abbrev = this.findLangs(term['Main trait abbreviation']);
    }else if(term['Alternative trait abbreviations']) {
        var abbrev = this.findLangs(term['Alternative trait abbreviations']);
    } else { // no descritption
        var abbrev = {};
    }
    for(var i in abbrev) {
        try{
            var jsonAbbrev = JSON.stringify(abbrev[i]).trim();
            if(jsonAbbrev != undefined) {
                jsonAbbrev=jsonAbbrev.replace(/\\"/g, '');
                 jsonAbbrev=jsonAbbrev.replace(/\"/g, '');
                if(jsonAbbrev.split(",").length > 1){//several syn
                    var jsonAbbrevTab = jsonAbbrev.split(',');
                    for(var j=0; j<jsonAbbrevTab.length; j++) {
                        this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'acronym' +'> "' + jsonAbbrevTab[j] + '"@' + languages.getIso[i].toLowerCase() + ' .\n';
                    }
                }else{
                    this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'acronym' +'> "' + jsonAbbrev + '"@' + languages.getIso[i].toLowerCase() + ' .\n';
                }
            }
        }catch(e){
            throw e;
        }
       
    }

    // broader
    if(term.parent != 'null') {
        if(typeof term.parent != 'string') { // multiple broader
            for(var i in term.parent) {
                try{
                    if(term.relationship != undefined){
                        if(term.parent.length==term.relationship.length){  // if parent different from relationship
                            //let's assume that info is in the same order in parent and relationship
                             if(term.relationship[i].indexOf('scale_of')==0) { 
                                this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'scale_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'scale_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.cptRes++;

                                if(term["Scale class"] != undefined){
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                }else{
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
                                }
                            }else if (term.relationship[i].indexOf('method_of')==0){
                                this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'method_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'method_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.cptRes++;

                                if(term["Method class"]!= undefined){
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
                                }else{
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
                                }
                               
                            }else if (term.relationship[i].indexOf('variable_of')==0){
                                this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'variable_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'variable_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.cptRes++;

                                this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Variable' + '> .\n';
                                this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Variable' + '> .\n';
                            }else{
                                this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broader> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                            }
                        }else{
                            //first element of parent is superclass
                            if(i==0){
                                if(typeof term.relationship === 'string' && term.relationship.indexOf('variable_of')==0){
                                    this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'variable_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'variable_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.cptRes++;

                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Variable' + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Variable' + '> .\n';
                                } else  if(typeof term.relationship === 'string' && term.relationship.indexOf('scale_of')==0){
                                    this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'scale_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'scale_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.cptRes++;

                                   if(term["Scale class"]!= undefined){
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                        }else{
                                            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
                                            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
                                        }
                                }else  if(typeof term.relationship === 'string' && term.relationship.indexOf('method_of')==0){
                                    this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'method_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'method_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.cptRes++;

                                   if(term["Method class"]!= undefined){
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
                                        }else{
                                            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
                                            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
                                        }
                                }else{
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n'
                                }
                            }else{
                                if(term.relationship[i-1] != undefined && term.relationship[i-1].indexOf('scale_of')==0) { 
                                this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'scale_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'scale_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                this.cptRes++;

                                if(term["Scale class"]!= undefined){
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                    }else{
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
                                    }
                                }else if(term.relationship[i-1] == undefined && term.relationship.indexOf('scale_of')==0) { 
                                    this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'scale_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'scale_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.cptRes++;

                                    if(term["Scale class"]!= undefined){
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                                        }else{
                                            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
                                            this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
                                        }
                                }else if (term.relationship[i-1] != undefined && term.relationship[i-1].indexOf('method_of')==0){
                                    this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'method_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'method_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.cptRes++;

                                    if(term["Method class"]!= undefined){
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
                                    }else{
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
                                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
                                    }
                                }else if (term.relationship.indexOf('variable_of')==0){
                                    this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'variable_of' +'> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'variable_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    this.cptRes++;

                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Variable' + '> .\n';
                                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Variable' + '> .\n';
                                }else{
                                    //this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broader> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                                    //this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Variable' + '> .\n';
                                    //this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Variable' + '> .\n';
                                }
                            }
                        }
                    }else{
                        //it is an obo and parent is is_a
                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                        this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.encodeID(term.parent[i]) + '> .\n';
                    }
                }catch(e){
                    throw e+term.id;
                }
               
                
            }
        } else { // just a single broader
            if(term.relationship == 'scale_of') {
                this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'scale_of' +'> <' + this.uri + this.encodeID(term.parent) + '> .\n';
                this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'scale_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent) + '> .\n';
                this.cptRes++;

                if(term["Scale class"]!= undefined){
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Scale class"]) + '> .\n';
                }else{
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
                }
            }else if (term.relationship == 'method_of'){
                this.turtle += '<' + this.uri + term.id + '> <'+ this.uri + 'method_of' +'> <' + this.uri + this.encodeID(term.parent) + '> .\n';
                this.turtle += '<' + this.uri + term.id + '> '+ restrictionSubClassPart+this.cptRes+ '.\n' + '_:genid'+ this.cptRes + restrictionPart + '_:genid'+ this.cptRes + restrictionPropPart + '<'+ this.uri + 'method_of' +'> .\n' + '_:genid'+ this.cptRes + restrictionClassPart + '<' + this.uri + this.encodeID(term.parent) + '> .\n';
                this.cptRes++;

                if(term["Method class"]!= undefined){
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.translate(term["Method class"]) + '> .\n';
               }else{
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
                    this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
                }

            }else {
                this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + this.encodeID(term.parent) + '> .\n';
                this.turtle += '<' + this.uri + term.id + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + this.encodeID(term.parent) + '> .\n';
            }
           
        }
    }

    // if categorical create new nodes
    if(term.relationship == 'scale_of') {

        var type = this.findLangs(term['Type of Measure (Continuous, Discrete or Categorical)']);
        if(type.english == undefined) {
            type = this.findLangs(term['Scale class']);
        }
        if(type.english && (type.english == 'Categorical' || type.english == 'Ordinal' || type.english == 'Nominal')) { // it's categorical
            for(var i in term) {
                if(i.indexOf('For Categorical') == 0 || i.indexOf('Category') == 0 ) { // starts with
                    var categoryId = i.match(/\d+/g);
                    if(!categoryId) continue;
                    if(categoryId.length) {
                        categoryId = categoryId[0];
                    }
                    this.turtle += '<' + this.uri + term.id + '/' + categoryId +'> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2004/02/skos/core#Concept> .\n';
                    this.turtle += '<' + this.uri + term.id + '/' + categoryId +'> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + term.id + '> .\n';
                    this.turtle += '<' + this.uri + term.id + '/' + categoryId +'> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + term.id + '> .\n';

                    // do name
                    var names = this.findLangs(term[i]);
                    for(var x in names) {
                        var jsonName = JSON.stringify(names[x]);
                        if(jsonName != undefined) {
                            this.turtle += '<' + this.uri + term.id + '/' + categoryId +'> <http://www.w3.org/2000/01/rdf-schema#label> ' + jsonName + '@' + languages.getIso[x].toLowerCase() + ' .\n';
                        }
                    }
                }

            }


        }

    }

   
    return this.turtle;
}

rdf.prototype.buildNtriples = function(ontologyId) {
    var that = this;
    select('term')
        .find({ 
            ontology_id: ontologyId
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

     /////Create the superclasses (top classes) for scales and methods if TDV5 only

    this.turtle += '<' + this.uri + 'Computation' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
    this.turtle += '<' + this.uri + 'Computation' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
    this.turtle += '<' + this.uri + 'Measurement' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
    this.turtle += '<' + this.uri + 'Measurement' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
    this.turtle += '<' + this.uri + 'Estimation' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
    this.turtle += '<' + this.uri + 'Estimation' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
    this.turtle += '<' + this.uri + 'Counting' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
    this.turtle += '<' + this.uri + 'Counting' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';

    this.turtle += '<' + this.uri + 'Nominal' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Nominal' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Ordinal' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Ordinal' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Numerical' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Numerical' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Text' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Text' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Code' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Code' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Duration' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Duration' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Time' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
    this.turtle += '<' + this.uri + 'Time' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';

    if(ontologyId == "CO_325"){
        this.turtle += '<' + this.uri + 'Photo' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Scale' + '> .\n';
        this.turtle += '<' + this.uri + 'Photo' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Scale' + '> .\n';

        this.turtle += '<' + this.uri + 'Metadata' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
        this.turtle += '<' + this.uri + 'Metadata' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
        this.turtle += '<' + this.uri + 'Observation' + '> <http://www.w3.org/2004/02/skos/core#broaderTransitive> <' + this.uri + 'Method' + '> .\n';
        this.turtle += '<' + this.uri + 'Observation' + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + this.uri + 'Method' + '> .\n';
    }


    //declare the properties
    this.turtle += '<' + this.uri + 'method_of' + '> <http://www.w3.org/2000/01/rdf-schema#subProperty> <' + 'http://www.w3.org/2004/02/skos/core#related' + '> .\n';
    this.turtle += '<' + this.uri + 'scale_of' + '> <http://www.w3.org/2000/01/rdf-schema#subProperty> <' + 'http://www.w3.org/2004/02/skos/core#related' + '> .\n';
    this.turtle += '<' + this.uri + 'variable_of' + '> <http://www.w3.org/2000/01/rdf-schema#subProperty> <' + 'http://www.w3.org/2004/02/skos/core#related' + '> .\n';
    this.turtle += '<' + this.uri + 'method_of' + '> <http://www.w3.org/2000/01/rdf-schema#subProperty> <' + 'http://www.w3.org/2002/07/owl#ObjectProperty' + '> .\n';
    this.turtle += '<' + this.uri + 'scale_of' + '> <http://www.w3.org/2000/01/rdf-schema#subProperty> <' + 'http://www.w3.org/2002/07/owl#ObjectProperty' + '> .\n';
    this.turtle += '<' + this.uri + 'variable_of' + '> <http://www.w3.org/2000/01/rdf-schema#subProperty> <' + 'http://www.w3.org/2002/07/owl#ObjectProperty' + '> .\n';
    this.turtle += '<' + this.uri + 'acronym' + '> <http://www.w3.org/2000/01/rdf-schema#subProperty> <' + 'http://www.w3.org/2004/02/skos/core#altLabel' + '> .\n';

    return this.turtle;
};
