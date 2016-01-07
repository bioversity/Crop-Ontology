// some column identifiers needed to parse the template
var mod = "Trait ID for modification, Blank for New",
    ib = "ib primary traits",
    langKey = "Language of submission (only in ISO 2 letter codes)",
    methodMod = "Method ID for modification, Blank for New",
    scaleMod = "Scale ID for modification, Blank for New";

exports = t = function(blobKey, ontologyId, ontologyName) {
    this.blobKey = blobKey
    this.ontologyId = ontologyId
    this.ontologyName = ontologyName
    this.rootId = this.ontologyId + ':ROOT'

    this.terms = []
    this.editedIds = []

    this.parseTemplate()

}
t.prototype.createRoot = function() {
    taskqueue.createTask("/create-term", JSON.stringify({
        id: this.rootId,
        ontology_name: ""+this.ontologyName,
        ontology_id: ""+this.ontologyId,
        name: ""+this.ontologyName,
        language: this.terms[0][langKey] || this.terms[0]["language"],
        parent: null
    }));
}
t.prototype.createTraitClass = function(term) {
    if(term["Trait Class"]){
        var parent = this.ontologyId + ":" + term["Trait Class"];
    } else{
        var parent = this.ontologyId + ":" + term["Trait class"];
    }
    
    if(term[mod] || term["Trait ID"]) { 
        // if this trait exists in db, 
        // use its parentId as current parent instead of 'Trait Class'
        try {
            var termKey = googlestore.createKey("term", term.id),
                termEntity = googlestore.get(termKey);

            // term found! overwrite parent
            parent = '' + termEntity.getProperty('parent');
        } catch(e) { // not found
        }
    }

    // creates or modifies a Trait Class based on its id
    taskqueue.createTask("/create-term", JSON.stringify({
        id: parent,
        ontology_name: ""+this.ontologyName,
        ontology_id: ""+this.ontologyId,
        name: term["Trait Class"] || term["Trait class"],
        language: term[langKey] || term["language"],
        parent: this.rootId
    }));
    return parent;
}
t.prototype.getTrait = function(row) {
    var obj = {};
    var startCopy = false;
    for(var i in row) {
        if(i == 'Trait ID' || i == 'ibfieldbook') startCopy = true;
        if(startCopy) {
            obj[i] = row[i]; 
            if(obj[i] == "") delete obj[i]; 
        }
        if(i == 'Trait Xref' || i == 'Trait Class') break;
    }
    // this is because it may be at the end of the template as well
    if(row['ibfieldbook']) obj['ibfieldbook'] = row['ibfieldbook'];
    if(row['Variable status']) obj['ibfieldbook'] = row['Variable status'];
    // always need a reference to its language
    obj['language'] = row[langKey] || row["Language"];
    obj.name = obj["Name of Trait"] || obj["Trait name"];
    if(!obj.name) {
        obj.name = 'No trait name found'
    }
    obj.ontology_name = ""+this.ontologyName;
    obj.ontology_id = ""+this.ontologyId;

    return obj;
}
t.prototype.getMethod = function(row) {
    var obj = {};
    var startCopy = false;
    for(var i in row) {
        if(startCopy) {
            obj[i] = row[i]; 
            if(obj[i] == "") delete obj[i];
        }
        if(i == 'Method reference' || i == 'Comments') break;
        if(i == 'Trait Class' || i == 'Trait Xref') startCopy = true;
    }
    delete obj['ibfieldbook'];
    // always need a reference to its language
    obj['language'] = row[langKey] || row["Language"];

    obj.name = obj["Name of method"] || obj["Method name"];

    if(!obj.name) { 
        obj.name = 'No method name found';
    }
    obj.ontology_name = ""+this.ontologyName;
    obj.ontology_id = ""+this.ontologyId;
    obj.relationship = "method_of";
    return obj;
}
t.prototype.getScale = function(row) {
    var obj = {};
    var startCopy = false;
    var startCopyCat = false;
    for(var i in row) {
        ///the line after the categories in the TD v4 won't be added to the database.....
        if(startCopyCat && i.indexOf('Category') < 0) break;
        if(startCopy) {
            obj[i] = row[i]; 
            if(obj[i] == "") delete obj[i];
        }
        if(i == 'Comments' || i== 'Method reference') startCopy = true;
        if(i.indexOf('Category') >= 0) startCopyCat = true;
    }
    delete obj['ibfieldbook'];
    // always need a reference to its language
    obj['language'] = row[langKey] || row["Language"];

    obj.name = obj["Scale name"] || obj['For Continuous: units of measurement'] || obj['For Discrete: Name of scale or units of measurement']
                         || obj['For Categorical: Name of rating scale'];
    if(!obj.name) { // look in the 22nd column
        obj.name = 'No scale name found';
    }
    obj.ontology_name = ""+this.ontologyName;
    obj.ontology_id = ""+this.ontologyId;
    obj.relationship = "scale_of";
    return obj;
}

t.prototype.getVariable = function(row) {
    var obj = {};
    for(var i in row) {
        if(i == 'Trait ID' || i == 'Trait ID for modification, Blank for New') break;
        obj[i] = row[i]; 
        if(obj[i] == "") delete obj[i];     
    }
    delete obj['ibfieldbook'];
    // always need a reference to its language
    obj['language'] = row[langKey] || row["Language"];

    obj.name = obj["Variable name"];
    if(!obj.name) { // look in the 22nd column
        obj.name = 'No variable name found';
    }
    obj.ontology_name = ""+this.ontologyName;
    obj.ontology_id = ""+this.ontologyId;
    obj.relationship = "variable_of";
    return obj;
}

t.prototype.parseTemplate = function() {
    var that = this
    // start at row with index 6. TEMPLATE 5 starts at row with index 0
    excel.parseTemplate(0, this.blobKey, function(term) {
        that.parseTerm(term)
    });
    if(this.terms[0]['name'] == 'No trait name found'){
        this.terms = []
        excel.parseTemplate(6, this.blobKey, function(term) {
                that.parseTerm(term)
        });
    }
    // now that we parsed, and have all the terms nice and clean
    // inside this.terms
    // let's actually store them in datastore
    if(this.terms.length) {
        this.processTerms()
        this.createRoot()
    } else {
        throw 'We weren\'t able to parse your template. Check that the format is correct and the sheets are in the correct order.'
    }
}
t.prototype.parseTerm = function(term) {
    // need a reference to the blob of the excel
    term.excel_blob_key = ''+this.blobKey.getKeyString()

    // get the Trait, Method and Scale
    var trait = this.getTrait(term)
    var method = this.getMethod(term)
    var scale = this.getScale(term)
    var variable = this.getVariable(term)

    // make method children of this trait
    trait.method = method;
    // make scale children of this method
    method.scale = scale;

     // make var children of this trait
    trait.variable = variable;
    // make var children of this method
    method.variable = variable;
    // make var children of this scale
    scale.variable = variable;


    // fill in the editable ids so later we can figure out the one we can use
   if (term["Trait ID"]){
        this.editedIds.push(term["Trait ID"]);
    } else if(term[mod]) {
        this.editedIds.push(term[mod]);
    }  
    if (term["Method ID"]) {
        this.editedIds.push(term["Method ID"]);
    } else if(term[methodMod]) {
        this.editedIds.push(term[methodMod]);
    }  
    if(term["Scale ID"]){
        this.editedIds.push(term["Scale ID"]);
    }else if(term[scaleMod]) {
        this.editedIds.push(term[scaleMod]);
    }  
    if(term["Variable ID"]){
        this.editedIds.push(term["Variable ID"]);
    } 

    delete term[""]; // WTF DUDE OMG

    // build terms array
    this.terms.push(trait);
}
t.prototype.findFreeId = function() {
    var freeEditedId = 0;
    if(this.editedIds.length) {
        freeEditedId = parseInt((this.editedIds.sort().reverse()[0]).split(':')[1], 10) + 1;
        if(!freeEditedId) {
            throw "Something wrong with your template. Check that the ID's that you're providing are of correct form such as: C0_NNN:nnnnnnn";
        }
    }
    var freeStoreId = termmodel.findFreeId(this.ontologyId);
    var freeId = freeEditedId;
    if(freeStoreId > freeEditedId) {
        freeId = freeStoreId;
    }
    return freeId;
}
// let's process this.terms
t.prototype.processTerms = function() {
    // find freeId
    var freeId = this.findFreeId()

    // return the occurence of a given item in an array
    function nbOcc(array, item){
        var count = 0;
        for(var i = 0; i < array.length; ++i){
            if(array[i] === item)
                count++;
        }
        return count;
    }

    // handle same ids
    var methodIds = {};
    var scaleIds = {};
    
    // MAIN LOOP
    for(var i in this.terms) {
        // TRAIT
        var trait = this.terms[i];
        if(trait[mod]) {
            trait.id = trait[mod];
        } else if (trait["Trait ID"]){
            trait.id = trait["Trait ID"];
        } else {
            trait.id = this.ontologyId + ':' + pad(freeId++, 7);
        }

        // TRAIT CLASS
        var traitClassId = this.createTraitClass(trait)
        trait.parent = traitClassId

        // METHOD
        var method = trait.method;
        if(method) {
            if(method[methodMod]) {
                method.id = method[methodMod];
            } else if (method["Method ID"]) {
                method.id = method["Method ID"];
            } else {
                method.id = this.ontologyId + ':' + pad(freeId++, 7);
            }
            //when same method applies for several traits
            if(nbOcc(this.editedIds,method.id) > 1){
                if(methodIds[method.id]){ // if the method already exists in the database
                    if(methodIds[method.id].indexOf(trait.id) >= 0){ // if the parent is already there, don't add it
                        method.parent = methodIds[method.id];
                    }else{
                        methodIds[method.id].push(trait.id);
                        method.parent = methodIds[method.id];
                    }
                }else{
                    methodIds[method.id] = [trait.id];
                    method.parent = trait.id;
                }
            }else{
                method.parent = trait.id;
            }
            
        }

        // SCALE
        var scale = method ? method.scale : false;
        if(scale) {
            if(scale[scaleMod]) {
                scale.id = scale[scaleMod];
            } else if (scale["Scale ID"]){
                scale.id = scale["Scale ID"];
            } else {
                scale.id = this.ontologyId + ':' + pad(freeId++, 7);
            }
            //when same scale applies for several methods
            if(nbOcc(this.editedIds,scale.id) > 1){
                if(scaleIds[scale.id]){ // if the scale already exists in the database
                    if(scaleIds[scale.id].indexOf(method.id) >= 0){ // if the parent is already there, don't add it
                        scale.parent = scaleIds[scale.id];
                    }else{
                        scaleIds[scale.id].push(method.id);
                        scale.parent = scaleIds[scale.id];
                    }
                }else{
                    scaleIds[scale.id] = [method.id];
                    scale.parent = method.id;
                }
            }else{
                scale.parent = method.id;
            }   
        }

        // VARIABLE
        var variable = trait.variable;
        if(variable){
            if (variable["Variable ID"]){
                variable.id = variable["Variable ID"];
            }else {
                variable.id = this.ontologyId + ':' + pad(freeId++, 7);
            }
            variable.parent = [trait.id, method.id, scale.id];

        }

        // check that the terms array contains an element "Name of Trait".
        // this is our validation to make sure the template is correct
        if(!trait.name) {
            throw "Check that your template is structured correctly! Seems like the 'Name of Trait' columns is missing";
        }

        // add variable
        if(variable && variable.name.indexOf("No variable name found") < 0 ) {
            //langKey = "Language of submission";
            taskqueue.createTask("/create-term", JSON.stringify(variable));
        }

        // add scale
        if(scale) {
            delete scale['variable'];
            taskqueue.createTask("/create-term", JSON.stringify(scale));
        }

        // add method
        if(method) {
            delete method['scale'];
            delete method['variable'];
            taskqueue.createTask("/create-term", JSON.stringify(method));
        }

        // add trait
        delete trait['variable'];
        delete trait['method'];
        taskqueue.createTask("/create-term", JSON.stringify(trait));   
    }
}


