var id = 0; // start id at 0
var idlen = 7;

var mod = "Trait ID for modification, Blank for New",
    ib = "ib primary traits",
    langKey = "Language of submission (only in ISO 2 letter codes)",
    methodMod = "Method ID for modification, Blank for New",
    scaleMod = "Scale ID for modification, Blank for New";

exports = t = function(blobKey, ontologyId) {
    this.ontologyId = ontologyId
    this.blobKey = blobKey
    //this.createRoot()
    this.parse()
}
t.prototype.createRoot = function() {
    taskqueue.createTask("/create-term", JSON.stringify({
        id: this.ontologyId + ':ROOT',
        ontology_name: ""+ontologyName,
        ontology_id: ""+ontologyId,
        name: ""+ontologyName,
        parent: null
    }));
}
t.prototype.parse = function() {
    // start at row with index 6
    excel.parseTemplate(6, this.blobKey, function(term) {
        log(term); 
        return;
        // need a reference to the blob of the excel
        term.excel_blob_key = ""+blobKeyString;
        var parent;
        // create the "trait class" term which is the parent
        if(term["Trait Class"]) {
            if(term[langKey] != 'EN') {
                // we're dealing with a trait class
                // find its EN counterpart
                var key = googlestore.createKey("term", term[mod]);
                var traitClass = googlestore.get(key).getProperty('Trait Class');

                parent = ontologyId + ':' + traitClass;
            } else {
                // set the parent to be this trait
                parent = ontologyId + ":" + term["Trait Class"];
            }
            taskqueue.createTask("/create-term", JSON.stringify({
                id: parent,
                ontology_name: ""+ontologyName,
                ontology_id: ""+ontologyId,
                name: term["Trait Class"],
                language: term[langKey],
                parent: rootId
            }));
        }

        delete term[""]; // WTF DUDE OMG


        var trait = getTrait(term);
        trait.name = trait["Name of Trait"];
        if(!trait.name) { // look in the 7th column
            trait.name = getCol(term, 6);
        }
        trait.ontology_name = ""+ontologyName;
        trait.ontology_id = ""+ontologyId;
        if(term[langKey] == 'EN') {
            trait.parent = parent; // parent is Trait Class
        }
        trait.language = term[langKey];

        var method = getMethod(term);
        if(!isEmpty(method)) {
            method.name = method["Name of method"] || method["Describe how measured (method)"];
            if(!method.name) { // look in the 15th column
                method.name = getCol(method, 1);
            }
            method.ontology_name = ""+ontologyName;
            method.ontology_id = ""+ontologyId;
            method.relationship = "method_of";
            method.language = term[langKey];

            // make method children of this trait
            trait.method = method;
        }

        var scale = getScale(term);
        if(!isEmpty(scale)) {
            scale.name = scale["Type of Measure (Continuous, Discrete or Categorical)"];
            if(!scale.name) { // look in the 22nd column
                scale.name = getCol(scale, 1);
            }
            scale.ontology_name = ""+ontologyName;
            scale.ontology_id = ""+ontologyId;
            scale.relationship = "scale_of";
            scale.language = term[langKey];

            // make scale children of this method
            method.scale = scale;
        }

        if(term[mod]) editedIds.push(term[mod]);
        if(term[methodMod]) editedIds.push(term[methodMod]);
        if(term[scaleMod]) editedIds.push(term[scaleMod]);

        terms.push(trait);

    });

}

