exports = {
    getDefaultList: function(ontologyId) {

            var terms = googlestore.query("term")
                            //.sort("ibfieldbook")
                            //.sort("name")
                            .filter("ontology_id", "=", ontologyId)
                            //.filter("ibfieldbook", "!=", null)
                            .fetch();

            var traits = {};

               if(terms[1].getProperty("obo_blob_key")) {   ///OBO file
                terms.forEach(function(term){
                var ibfieldbook = term.getProperty("ibfieldbook");
                if(ibfieldbook == null){
                    return;
                }
                  var name = get("name", term);
                  var parent = get("parent", term);
                  var rel = get("relationship", term);
                  var isa = get("is_a", term);

                  if((parent && !rel) || (parent && rel.indexOf("method_of") == -1 && isa) && (parent && rel.indexOf("scale_of") == -1 && isa)) {
                     var def = get("def", term) || get("definition", term);
                     var abbr = get("Abbreviated name");
                     var syn = get("Synonyms", term);
                     var created_at = get("created_at", term);
                     //var creator = get("Name of submitting scientist",term);

                     traits["" + term.getProperty("id")] = { 
                        name : name,
                        definition : def, 
                        synonym : syn, 
                        abbreviation : abbr, 
                        //creator : creator, 
                        creation_date : created_at, 
                     };
                  }

                 for(var k in traits["" + term.getProperty("id")])
                        if(!traits["" + term.getProperty("id")][k]) delete traits["" + term.getProperty("id")][k];
                     
               });

               var methods = {};

                terms.forEach(function(term){
                    var parent = term.getProperty("relationship");
                    if(!parent) return;

                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);
                            //System.out.println("tata "+term.getProperty("id")+ " " +p);
                            if (p.indexOf("method_of") != -1) {
                              p=p.split(" ")[1];
                           
                            
                               if(traits[p]) {
                                   //this is a method
                                   if(!traits[p]["method"]) traits[p]["method"] = {};

                                   traits[p]["method"]["" + term.getProperty("id")] = { name : get("name", term) , definition : get("Method", term)};

                                   for(var k in traits[p]["method"]["" + term.getProperty("id")])
                                       if(!traits[p]["method"]["" + term.getProperty("id")][k]) delete traits[p]["method"]["" + term.getProperty("id")][k];

                                   methods["" + term.getProperty("id")] = traits[p]["method"]["" + term.getProperty("id")];

                               }
                            }
                        }
                    } else {
                     //System.out.println("toto "+term.getProperty("id")+ " " +parent);
                        if (parent.indexOf("method_of") != -1) {
                           try{
                              parent = parent.split(" ")[1] == undefined ? get("parent", term).replace("[", "").replace("]", "") : parent.split(" ")[1];
                           } catch(e) {

                           }                    
                     
                           if(traits[parent]){
                               //this is a method
                               if(!traits[parent]["method"]) traits[parent]["method"] = {};

                               traits[parent]["method"]["" + term.getProperty("id")] = { name : get("name", term) , definition : get("Method", term) };

                                for(var k in traits[parent]["method"]["" + term.getProperty("id")])
                                       if(!traits[parent]["method"]["" + term.getProperty("id")][k]) delete traits[parent]["method"]["" + term.getProperty("id")][k];
                               
                               methods["" + term.getProperty("id")] = traits[parent]["method"]["" + term.getProperty("id")];
                           }
                        }
                    }

                }); 

               // scales
                terms.forEach(function(term){
                    var parent = term.getProperty("relationship");
                    if(!parent) return;
                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);

                           if (p.indexOf("scale_of")) {
                              p=p.split(" ")[1];
                           
                               if(methods[p]){
                                   //this is a scale
                                   if(!methods[p]["scale"]) methods[p]["scale"] = {};

                                   var nameSc = get("name", term );
                                   var type = get("Scale type", term);
                                   var min = get("Minimun value", term);
                                   var max = get("Maximum value", term);

                                   var obj = { 
                                       name : nameSc, 
                                       type : type, 
                                       minimum : min, 
                                       maximum : max
                                   };

                                   for(var k in obj)
                                       if(!obj[k]) delete obj[k];
                                  

                                   addCategory(term, obj);

                                   methods[p]["scale"]["" + term.getProperty("id")] = obj;

                               }
                            }
                        }
                    } else {
                     
                        if (parent.indexOf("scale_of")==0) {
                           try{
                              parent = parent.split(" ")[1] == undefined ? get("parent", term).replace("[", "").replace("]", "") : parent.split(" ")[1];
                           } catch(e) {

                           }                                    
                           if(methods[parent]){
                            //this is a scale
                               if(!methods[parent]["scale"]) 
                                 methods[parent]["scale"] = {};

                                   var nameSc = get("name", term );
                                   var type = get("Scale type", term);
                                   var min = get("Minimun value", term);
                                   var max = get("Maximum value", term);

                               var obj = { 
                                       name : nameSc, 
                                       type : type, 
                                       minimum : min, 
                                       maximum : max
                                   };

                                   for(var k in obj)
                                       if(!obj[k]) delete obj[k];
                                   

                               addCategory(term, obj);

                               methods[parent]["scale"]["" + term.getProperty("id")] = obj;

                             }  

                        }
                    }
                }); 
               
            } else { ///Trait Dictionnary

                terms.forEach(function(term){
                    var ibfieldbook = term.getProperty("ibfieldbook");
                    if(ibfieldbook == null){
                        return;
                    }
                    var name = get("name", term);
                    var def = get("Description of Trait", term);
                    var fb = get("ibfieldbook", term);
                    var creator = get("Name of submitting scientist",term);
                    var inst = get("Institution",term);
                    var crop = get("Crop", term);
                    var abbr = get("Abbreviated name", term);
                    var syn = get("Synonyms (separate by commas)", term);
                    var created_at = get("created_at", term);
                    //var syn = "" + term.getClass();

                    traits["" + term.getProperty("id")] = {
                        name : name,
                        definition : def,
                        synonym : syn, 
                        abbreviation : abbr, 
                        creator : creator, 
                        institution : inst, 
                        creation_date : created_at, 
                        crop: crop 
                    };
                    
                    for(var k in traits["" + term.getProperty("id")])
                        if(!traits["" + term.getProperty("id")][k]) delete traits["" + term.getProperty("id")][k];

                  });

                var methods = {};

                terms.forEach(function(term){
                    var parent = term.getProperty("parent");
                    if(!parent) return;

                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);
                            if(traits[p]) {
                                //this is a method
                                if(!traits[p]["method"]) traits[p]["method"] = {};

                                traits[p]["method"]["" + term.getProperty("id")] = { name : get("name", term) , definition : get("Describe how measured (method)", term)}

                                methods["" + term.getProperty("id")] = traits[p]["method"]["" + term.getProperty("id")];

                            }
                        }
                    } else {
                        if(traits[parent]){
                            //this is a method
                            if(!traits[parent]["method"]) traits[parent]["method"] = {};

                            traits[parent]["method"]["" + term.getProperty("id")] = { name : get("name", term) , definition : get("Describe how measured (method)", term) }
                            
                            methods["" + term.getProperty("id")] = traits[parent]["method"]["" + term.getProperty("id")];
                        }
                    }

                }); 

                // scales
                terms.forEach(function(term){
                    var parent = term.getProperty("parent");
                    if(!parent) return;
                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);
                            if(methods[p]){
                                //this is a scale
                                if(!methods[p]["scale"]) methods[p]["scale"] = {};

                                var nameSc = get("For Continuous: units of measurement", term ) 
                                                    || get("For Discrete: Name of scale or units of measurement", term )
                                                    || get ("For Categorical: Name of rating scale");
                                var type = get("Type of Measure (Continuous, Discrete or Categorical)", term);
                                var min = get("For Continuous: minimum", term);
                                var max = get("For Continuous: maximum", term);

                                var obj = { 
                                    name : nameSc, 
                                    type : type, 
                                    minimum : min, 
                                    maximum : max
                                };

                                for(var k in obj)
                                    if(!obj[k]) delete obj[k];
                               

                                addCategory(term, obj);

                                methods[p]["scale"]["" + term.getProperty("id")] = obj;

                            }
                        }
                    } else {
                        if(methods[parent]){
                            //this is a scale
                            if(!methods[parent]["scale"]) methods[parent]["scale"] = {};

                                var nameSc = get("For Continuous: units of measurement", term ) 
                                                    || get("For Discrete: Name of scale or units of measurement", term )
                                                    || get ("For Categorical: Name of rating scale");
                                var type = get("Type of Measure (Continuous, Discrete or Categorical)", term);
                                var min = get("For Continuous: minimum", term);
                                var max = get("For Continuous: maximum", term);

                            var obj = { 
                                    name : nameSc, 
                                    type : type, 
                                    minimum : min, 
                                    maximum : max
                                };

                                for(var k in obj)
                                    if(!obj[k]) delete obj[k];
                                

                            addCategory(term, obj);

                            methods[parent]["scale"]["" + term.getProperty("id")] = obj;

                            

                        }
                    }
                }); 
            }

            function get(property, term) {
                try {
                  var val = term.getProperty(property);
                  if(val instanceof Text) val = val.getValue();
                  val = ""+val;
                  val = JSON.parse(val);
                  
                    
                }catch(e){

                }
                if(val && val['undefined']) {
                    val['english'] = val['undefined'];
                    delete val['undefined'];
                }
                return val;

            }

            function findLangs(value) {
                try {

                    var obj = JSON.parse(value);
                } catch(e) {
                    return { "english": value };
                }
                return obj;
            }
            function addCategory(term, obj){
                term = select.fn.toJS(term);
                var type = findLangs(term['Type of Measure (Continuous, Discrete or Categorical)']);
                if(type.english && type.english == 'Categorical') { // it's categorical

                    for(var i in term) {
                        if(i.indexOf('For Categorical') == 0) { // starts with
                            var categoryId = i.match(/\d+/g);
                            if(!categoryId) continue;
                            if(categoryId.length) {
                                categoryId = categoryId[0];
                            }

                            obj[term.id + '/' + categoryId] = {};

                            // do name
                            var names = findLangs(term[i]);
                            obj[term.id + '/' + categoryId].name = {};
                            for(var x in names) {
                                obj[term.id + '/' + categoryId].name[x] = names[x];
                            }
                        }

                    }


                }
            }
            
            return traits;
    },
    getList: function(ontologyId) {

            var terms = googlestore.query("term")
                            //.sort("ibfieldbook")
                            //.sort("name")
                            .filter("ontology_id", "=", ontologyId)
                            //.filter("ibfieldbook", "!=", null)
                            .fetch();

            var traits = {};

            if(terms[1].getProperty("obo_blob_key")) {   ///OBO file
                terms.forEach(function(term){
                  
                  //if the term is a variable, ignore it
                  var variable = get("namespace", term);
                  if(JSON.stringify(variable).indexOf("Variable") >= 0){
                    return;
                  }

                  var name = get("name", term);
                  var parent = get("parent", term);
                  var rel = get("relationship", term);
                  var isa = get("is_a", term);

                  if((parent && !rel) || (parent && rel.indexOf("method_of") == -1 && isa) && (parent && rel.indexOf("scale_of") == -1 && isa)) {
                     var def = get("def", term) || get("definition", term);
                     var abbr = get("Abbreviated name");
                     var syn = get("Synonyms", term);
                     var created_at = get("created_at", term);
                     var isa = get("is_a", term);

                     try{
                        isa= isa.split(" ")[0];
                     }catch(e){

                     }
                     //var creator = get("Name of submitting scientist",term);

                     traits["" + term.getProperty("id")] = { 
                        name : name,
                        definition : def, 
                        synonym : syn, 
                        abbreviation : abbr,
                        is_a : isa,
                        //creator : creator, 
                        creation_date : created_at, 
                     };
                  }

                 for(var k in traits["" + term.getProperty("id")])
                        if(!traits["" + term.getProperty("id")][k]) delete traits["" + term.getProperty("id")][k];
                     
               });

               var methods = {};

                terms.forEach(function(term){
                    //if the term is a variable, ignore it
                    var variable = get("namespace", term);
                    if(JSON.stringify(variable).indexOf("Variable")>= 0){
                      return;
                    }
                    var parent = term.getProperty("relationship");
                    if(!parent) return;

                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);
                            //System.out.println("tata "+term.getProperty("id")+ " " +p);
                            if (p.indexOf("method_of") != -1) {
                              p=p.split(" ")[1];
                           
                            
                               if(traits[p]) {
                                   //this is a method
                                   if(!traits[p]["method"]) traits[p]["method"] = {};

                                   traits[p]["method"]["" + term.getProperty("id")] = { name : get("name", term) , definition : get("Method", term)};

                                   for(var k in traits[p]["method"]["" + term.getProperty("id")])
                                       if(!traits[p]["method"]["" + term.getProperty("id")][k]) delete traits[p]["method"]["" + term.getProperty("id")][k];

                                   methods["" + term.getProperty("id")] = traits[p]["method"]["" + term.getProperty("id")];

                               }
                            }
                        }
                    } else {
                     //System.out.println("toto "+term.getProperty("id")+ " " +parent);
                        if (parent.indexOf("method_of") != -1) {
                           try{
                              parent = parent.split(" ")[1] == undefined ? get("parent", term).replace("[", "").replace("]", "") : parent.split(" ")[1];
                           } catch(e) {

                           }                    
                     
                           if(traits[parent]){
                               //this is a method
                               if(!traits[parent]["method"]) traits[parent]["method"] = {};

                               traits[parent]["method"]["" + term.getProperty("id")] = { name : get("name", term) , definition : get("Method", term) };

                                for(var k in traits[parent]["method"]["" + term.getProperty("id")])
                                       if(!traits[parent]["method"]["" + term.getProperty("id")][k]) delete traits[parent]["method"]["" + term.getProperty("id")][k];
                               
                               methods["" + term.getProperty("id")] = traits[parent]["method"]["" + term.getProperty("id")];
                           }
                        }
                    }

                }); 

               // scales
                terms.forEach(function(term){
                    //if the term is a variable, ignore it
                    var variable = get("namespace", term);
                    if(JSON.stringify(variable).indexOf("Variable") >= 0){
                      return;
                    }
                    var parent = term.getProperty("relationship");
                    if(!parent) return;
                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);

                           if (p.indexOf("scale_of")) {
                              p=p.split(" ")[1];
                           
                               if(methods[p]){
                                   //this is a scale
                                   if(!methods[p]["scale"]) methods[p]["scale"] = {};

                                   var nameSc = get("name", term );
                                   var type = get("Scale type", term);
                                   var min = get("Minimun value", term);
                                   var max = get("Maximum value", term);

                                   var obj = { 
                                       name : nameSc, 
                                       type : type, 
                                       minimum : min, 
                                       maximum : max
                                   };

                                   for(var k in obj)
                                       if(!obj[k]) delete obj[k];
                                  

                                   addCategory(term, obj);

                                   methods[p]["scale"]["" + term.getProperty("id")] = obj;

                               }
                            }
                        }
                    } else {
                     
                        if (parent.indexOf("scale_of")==0) {
                           try{
                              parent = parent.split(" ")[1] == undefined ? get("parent", term).replace("[", "").replace("]", "") : parent.split(" ")[1];
                           } catch(e) {

                           }                                    
                           if(methods[parent]){
                            //this is a scale
                               if(!methods[parent]["scale"]) 
                                 methods[parent]["scale"] = {};

                                   var nameSc = get("name", term );
                                   var type = get("Scale type", term);
                                   var min = get("Minimun value", term);
                                   var max = get("Maximum value", term);

                               var obj = { 
                                       name : nameSc, 
                                       type : type, 
                                       minimum : min, 
                                       maximum : max
                                   };

                                   for(var k in obj)
                                       if(!obj[k]) delete obj[k];
                                   

                               addCategory(term, obj);

                               methods[parent]["scale"]["" + term.getProperty("id")] = obj;

                             }  

                        }
                    }
                }); 
               
            } else {  // TD v4&&v5

                terms.forEach(function(term){
                    // var ibfieldbook = term.getProperty("ibfieldbook");
                    // if(ibfieldbook == null){
                    //     return;
                    // }
                    var name = get("name", term);
                    var def = get("Description of Trait", term) || get("Trait description", term);
                    //var fb = get("ibfieldbook", term) || get("Trait status", term) ;
                    //var creator = get("Name of submitting scientist",term) || get("Scientist",term) ;
                    //var inst = get("Institution",term);
                    var crop = get("Crop", term);
                    var abbr = get("Abbreviated name", term) || get("Trait abbreviation", term);
                    var syn = get("Synonyms (separate by commas)", term) || get("Trait synonyms", term) ;
                    //var created_at = get("created_at", term) || get("Date of submission", term);;
                    var isa = get("Trait Class", term) ||  get("Trait class", term);
                    //var syn = "" + term.getClass();
                    //var syn = "" + term.getClass();

                    traits["" + term.getProperty("id")] = {
                        name : name,
                        definition : def,
                        synonym : syn, 
                        abbreviation : abbr, 
                        is_a : isa,
                        // creator : creator, 
                        // institution : inst, 
                        // creation_date : created_at, 
                        // crop: crop 
                    };
                    
                    for(var k in traits["" + term.getProperty("id")])
                        if(!traits["" + term.getProperty("id")][k]) delete traits["" + term.getProperty("id")][k];

                  });

                var methods = {};

                terms.forEach(function(term){
                    var parent = term.getProperty("parent");
                    var variable = term.getProperty("Crop"); // only the variable will hae this prop
                    if(!parent || variable) return;

                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);
                            if(traits[p]) {
                                //this is a method
                                if(!traits[p]["method"]) traits[p]["method"] = {};

                                traits[p]["method"]["" + term.getProperty("id")] = { 
                                    name : get("name", term) , 
                                    definition : get("Describe how measured (method)", term) || get("Method description", term) 
                                };

                                methods["" + term.getProperty("id")] = traits[p]["method"]["" + term.getProperty("id")];

                            }
                        }
                    } else {
                        if(traits[parent]){
                            //this is a method
                            if(!traits[parent]["method"]) traits[parent]["method"] = {};
                            
                            traits[parent]["method"]["" + term.getProperty("id")] = { 
                                    name : get("name", term) , 
                                    definition : get("Describe how measured (method)", term) || get("Method description", term) 
                            };                            
                            methods["" + term.getProperty("id")] = traits[parent]["method"]["" + term.getProperty("id")];
                        }
                    }

                }); 

                // scales
                terms.forEach(function(term){
                    var parent = term.getProperty("parent");
                    var variable = term.getProperty("Crop");
                    if(!parent || variable) return;
                    if(parent.getClass() == "class java.util.ArrayList"){
                        for(var i = 0; i<parent.size();i++){
                            var p = parent.get(i);
                            if(methods[p]){
                                //this is a scale
                                if(!methods[p]["scale"]) methods[p]["scale"] = {};

                                var nameSc = get("Scale name", term )
                                                    || get("For Continuous: units of measurement", term ) 
                                                    || get("For Discrete: Name of scale or units of measurement", term )
                                                    || get("For Categorical: Name of rating scale", term);

                                var type = get ("Scale class", term ) || get("Type of Measure (Continuous, Discrete or Categorical)", term);
                                var min = get("For Continuous: minimum", term) || get("Lower limit", term);
                                var max = get("For Continuous: maximum", term) || get("Upper limit", term);

                                var obj = { 
                                    name : nameSc, 
                                    type : type, 
                                    minimum : min, 
                                    maximum : max
                                };

                                for(var k in obj)
                                    if(!obj[k]) delete obj[k];
                               

                                addCategory(term, obj);

                                methods[p]["scale"]["" + term.getProperty("id")] = obj;

                            }
                        }
                    } else {
                        if(methods[parent]){
                            //this is a scale
                            if(!methods[parent]["scale"]) methods[parent]["scale"] = {};

                                var nameSc = get("Scale name", term )
                                                    || get("For Continuous: units of measurement", term ) 
                                                    || get("For Discrete: Name of scale or units of measurement", term )
                                                    || get("For Categorical: Name of rating scale", term);

                               var type = get ("Scale class", term ) || get("Type of Measure (Continuous, Discrete or Categorical)", term);
                                var min = get("For Continuous: minimum", term) || get("Lower limit", term);
                                var max = get("For Continuous: maximum", term) || get("Upper limit", term);

                            var obj = { 
                                    name : nameSc, 
                                    type : type, 
                                    minimum : min, 
                                    maximum : max
                                };

                                for(var k in obj)
                                    if(!obj[k]) delete obj[k];
                                

                            addCategory(term, obj);

                            methods[parent]["scale"]["" + term.getProperty("id")] = obj;

                            

                        }
                    }
                }); 
            }

            function get(property, term) {
                try {
                  var val = term.getProperty(property);
                  if(val instanceof Text) val = val.getValue();
                  val = ""+val;
                  val = JSON.parse(val);
                  
                    
                }catch(e){

                }
                if(val && val['undefined']) {
                    val['english'] = val['undefined'];
                    delete val['undefined'];
                }
                return val;
            }

            function findLangs(value) {
                try {

                    var obj = JSON.parse(value);
                } catch(e) {
                    return { "english": value };
                }
                return obj;
            }
            function addCategory(term, obj){
                term = select.fn.toJS(term);
                var type = findLangs(term['Type of Measure (Continuous, Discrete or Categorical)']);

                if(type.english == undefined) {
                   type = findLangs(term['Scale class']);
                }

                if(type.english && (type.english == 'Categorical' || type.english == 'Ordinal' || type.english == 'Nominal')) {// it's categorical
                    
                    for(var i in term) {
                        if(i.indexOf('For Categorical') == 0 || i.indexOf('Category') == 0 ) { // starts with
                            var categoryId = i.match(/\d+/g);
                            if(!categoryId) continue;
                            if(categoryId.length) {
                                categoryId = categoryId[0];
                            }

                            obj[term.id + '/' + categoryId] = {};

                            // do name
                            var names = findLangs(term[i]);
                            obj[term.id + '/' + categoryId].name = {};
                            for(var x in names) {
                                obj[term.id + '/' + categoryId].name[x] = names[x];
                            }
                        }

                    }


                }
            }
            
            return traits;
    },
    getOBO: function(ontologyId) {

            var terms = googlestore.query("term")
                            //.sort("ibfieldbook")
                            //.sort("name")
                            .filter("ontology_id", "=", ontologyId)
                            //.filter("ibfieldbook", "!=", null)
                            .fetch();
            var obj = [];
            var traits = {};

             terms.forEach(function(term){
               
               var name = get("name", term);
               var parent = get("parent", term);
               var rel = get("relationship", term);
               var isa = get("is_a", term);

               if((parent && !rel) || (parent && rel.indexOf("method_of") == -1 && isa) && (parent && rel.indexOf("scale_of") == -1 && isa)) {
                  var def = get("def", term) || get("definition", term);
                  var abbr = get("Abbreviated name");
                  var syn = get("Synonyms", term);
                  var created_at = get("created_at", term);
                  var isa = get("is_a", term);
                  var fieldbook = get("ibfieldbook", term);

                  try{
                     isa= isa.split(" ")[0];
                  }catch(e){

                  }
                  
                  traits["" + term.getProperty("id")] = { 
                     ibfieldbook : fieldbook,
                     'Name of submitting scientist' : "",
                     Institution : "",
                     'Language of submission (only in ISO 2 letter codes)' : "", 
                     'Date of submission' : "" ,
                     Crop : "",
                     'Name of Trait' : name,
                     'Abbreviated name' : abbr,
                     'Synonyms (separate by commas)' : syn, 
                     'Trait ID for modification, Blank for New' : term.getProperty("id"),
                     'Description of Trait' : def, 
                     'How is this trait routinely used?' : "",
                     'Trait Class' : isa,
                  };

                  for(var k in traits["" + term.getProperty("id")])
                        if(!traits["" + term.getProperty("id")][k])  traits["" + term.getProperty("id")][k] = "";
               }
                  
            });

            var methods = {};

             terms.forEach(function(term){
                 var parent = term.getProperty("relationship");
                 if(!parent) return;

                 if(parent.getClass() == "class java.util.ArrayList"){
                     for(var i = 0; i<parent.size();i++){
                         var p = parent.get(i);
                         //System.out.println("tata "+term.getProperty("id")+ " " +p);
                         if (p.indexOf("method_of") != -1) {
                           p=p.split(" ")[1];
                        
                         
                            if(traits[p]) {
                                //this is a method
                                //if(!traits[p]["method"]) traits[p]["method"] = {};
                                // var method  = { 
                                //                                            'Method ID for modification, Blank for New' : term.getProperty("id"),
                                //                                            'Name of method' : get("name", term) , 
                                //                                            'Describe how measured (method)' : get("Method", term), 
                                //                                            'Growth stages' : "",   
                                //                                            'Bibliographic Reference' : "",
                                //                                            'Comments' : ""
                                //  };
                                //traits[p]["method"]["" + term.getProperty("id")] = method;
                                traits[p]['Method ID for modification, Blank for New'] = term.getProperty("id");
                                traits[p]['Name of method'] = get("name", term);
                                traits[p]['Describe how measured (method)'] = get("Method", term);
                                traits[p]['Growth stages'] = "";
                                traits[p]['Bibliographic Reference'] = "";
                                traits[p]['Comment'] = "";

                                 for(var k in traits[p])
                                     if(!traits[p][k])  traits[p][k] = "";

                                methods["" + term.getProperty("id")] = p;

                            }
                         }
                     }
                 } else {
                  //System.out.println("toto "+term.getProperty("id")+ " " +parent);
                     if (parent.indexOf("method_of") != -1) {
                        try{
                           parent = parent.split(" ")[1] == undefined ? get("parent", term).replace("[", "").replace("]", "") : parent.split(" ")[1];
                        } catch(e) {

                        }                    
                  
                        if(traits[parent]){
                            //this is a method
                           // if(!traits[parent]["method"]) traits[parent]["method"] = {};

                            // var method =  {
                            //                                       'Method ID for modification, Blank for New' : term.getProperty("id"),
                            //                                       'Name of method' : get("name", term) , 
                            //                                       'Describe how measured (method)' : get("Method", term), 
                            //                                       'Growth stages' : "",   
                            //                                       'Bibliographic Reference' : "",
                            //                                       'Comments' : ""
                            //      };
                              traits[parent]['Method ID for modification, Blank for New'] = term.getProperty("id");
                              traits[parent]['Name of method'] = get("name", term);
                              traits[parent]['Describe how measured (method)'] = get("Method", term);
                              traits[parent]['Growth stages'] = "";
                              traits[parent]['Bibliographic Reference'] = "";
                              traits[parent]['Comment'] = "";
                           for(var k in traits[parent])
                                     if(!traits[parent][k])  traits[parent][k] = "";                            
                            methods["" + term.getProperty("id")] = parent;
                        }
                     }
                 }

             }); 

            // scales
             terms.forEach(function(term){
                 var parent = term.getProperty("relationship");
                 if(!parent) return;
                 if(parent.getClass() == "class java.util.ArrayList"){
                     for(var i = 0; i<parent.size();i++){
                         var p = parent.get(i);

                        if (p.indexOf("scale_of")) {
                           p=p.split(" ")[1];
                        
                            if(methods[p]){
                                //this is a scale
                                //if(!methods[p]["scale"]) methods[p]["scale"] = {};

                                var nameSc = get("name", term );
                                var type = get("Scale type", term);
                                var min = get("Minimun value", term);
                                var max = get("Maximum value", term);

                                var objS = { 
                                    'Scale ID for modification, Blank for New' : term.getProperty("id"),
                                    'Type of Measure (Continuous, Discrete or Categorical)' : type,
                                    'For Continuous: units of measurement' : nameSc, 
                                    'For Continuous: reporting units (if different from measurement)' : "",
                                    'For Continuous: minimum' : min, 
                                    'For Continuous: maximum' : max, 
                                    'For Discrete: Name of scale or units of measurement' : nameSc,
                                    'For Categorical: Name of rating scale' : nameSc,
                                    'For Categorical: Class 1 - value = meaning' : "",
                                    'For Categorical: Class 2 - value = meaning' : "",
                                    'For Categorical: Class 3 - value = meaning' : "",
                                    'For Categorical: Class 4 - value = meaning' : "",
                                    'For Categorical: Class 5 - value = meaning' : "",
                                    'For Categorical: Class 6 - value = meaning' : "",
                                    'For Categorical: Class 7 - value = meaning' : "",
                                    'For Categorical: Class 8 - value = meaning' : "",
                                    'For Categorical: Class 9 - value = meaning' : "",
                                    'For Categorical: Class 10 - value = meaning' : "",
                                    'For Categorical: Class 11 - value = meaning' : "",
                                    'For Categorical: Class 12 - value = meaning' : ""
                                };
                              traits[methods[p]]['Scale ID for modification, Blank for New'] = term.getProperty("id");
                              traits[methods[p]]['Type of Measure (Continuous, Discrete or Categorical)'] = type;
                              traits[methods[p]]['For Continuous: units of measurement'] = nameSc;
                              traits[methods[p]]['For Continuous: reporting units (if different from measurement)'] = "";
                              traits[methods[p]]['For Continuous: minimum'] = min;
                              traits[methods[p]]['For Continuous: maximum'] = max;
                              traits[methods[parent]]['For Categorical: Class 1 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 2 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 3 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 4 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 5 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 6 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 7 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 8 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 9 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 10 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 11 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 12 - value = meaning'] = "";
                                for(var k in traits[methods[p]])
                                    if(!traits[methods[p]][k])  traits[methods[p]][k] = "";
                               

                                // addCategory(term, obj);

                                // methods[p]["scale"]["" + term.getProperty("id")] = obj;

                            }
                         }
                     }
                 } else {
                  
                     if (parent.indexOf("scale_of")==0) {
                        try{
                           parent = parent.split(" ")[1] == undefined ? get("parent", term).replace("[", "").replace("]", "") : parent.split(" ")[1];
                        } catch(e) {

                        }                                    
                        if(methods[parent]){
                         //this is a scale
                            // if(!methods[parent]["scale"]) 
                            //   methods[parent]["scale"] = {};

                                var nameSc = get("name", term );
                                var type = get("Scale type", term);
                                var min = get("Minimun value", term);
                                var max = get("Maximum value", term);

                            var objS = { 
                                    'Scale ID for modification, Blank for New' : term.getProperty("id"),
                                    'Type of Measure (Continuous, Discrete or Categorical)' : type,
                                    'For Continuous: units of measurement' : nameSc, 
                                    'For Continuous: reporting units (if different from measurement)' : "",
                                    'For Continuous: minimum' : min, 
                                    'For Continuous: maximum' : max, 
                                    'For Discrete: Name of scale or units of measurement' : nameSc,
                                    'For Categorical: Name of rating scale' : nameSc,
                                    'For Categorical: Class 1 - value = meaning' : "",
                                    'For Categorical: Class 2 - value = meaning' : "",
                                    'For Categorical: Class 3 - value = meaning' : "",
                                    'For Categorical: Class 4 - value = meaning' : "",
                                    'For Categorical: Class 5 - value = meaning' : "",
                                    'For Categorical: Class 6 - value = meaning' : "",
                                    'For Categorical: Class 7 - value = meaning' : "",
                                    'For Categorical: Class 8 - value = meaning' : "",
                                    'For Categorical: Class 9 - value = meaning' : "",
                                    'For Categorical: Class 10 - value = meaning' : "",
                                    'For Categorical: Class 11 - value = meaning' : "",
                                    'For Categorical: Class 12 - value = meaning' : ""
                                };

                              traits[methods[parent]]['Scale ID for modification, Blank for New'] = term.getProperty("id");
                              traits[methods[parent]]['Type of Measure (Continuous, Discrete or Categorical)'] = type;
                              traits[methods[parent]]['For Continuous: units of measurement'] = nameSc;
                              traits[methods[parent]]['For Continuous: reporting units (if different from measurement)'] = "";
                              traits[methods[parent]]['For Continuous: minimum'] = min;
                              traits[methods[parent]]['For Continuous: maximum'] = max;
                              traits[methods[parent]]['For Categorical: Class 1 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 2 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 3 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 4 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 5 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 6 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 7 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 8 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 9 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 10 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 11 - value = meaning'] = "";
                              traits[methods[parent]]['For Categorical: Class 12 - value = meaning'] = "";

                                for(var k in traits[methods[parent]])
                                    if(!traits[methods[parent]][k])  traits[methods[parent]][k] = "";
                                

                            // addCategory(term, objS);

                            // methods[parent]["scale"]["" + term.getProperty("id")] = objS;

                          }  

                     }
                 }
             }); 

            function get(property, term) {
                try {
                  var val = term.getProperty(property);
                
                  val = val instanceof Object ? JSON.stringify(val) : val;
                  val = val instanceof Text ? val.getValue() : ""+val;

                  val = JSON.parse(val);

                  
                }catch(e){

                }
                val = translate(val, 'english');
                if(val && val['undefined']) {
                    val['english'] = val['undefined'];
                    delete val['undefined'];
                }
                return val;
            }

            function findLangs(value) {
                try {

                    var obj = JSON.parse(value);
                } catch(e) {
                    return { "english": value };
                }
                return obj;
            }
            function addCategory(term, obj){
                term = select.fn.toJS(term);
                var type = findLangs(term['Type of Measure (Continuous, Discrete or Categorical)']);
                if(type.english && type.english == 'Categorical') { // it's categorical

                    for(var i in term) {
                        if(i.indexOf('For Categorical') == 0) { // starts with
                            var categoryId = i.match(/\d+/g);
                            if(!categoryId) continue;
                            if(categoryId.length) {
                                categoryId = categoryId[0];
                            }

                            obj[term.id + '/' + categoryId] = {};

                            // do name
                            var names = findLangs(term[i]);
                            obj[term.id + '/' + categoryId].name = {};
                            for(var x in names) {
                                obj[term.id + '/' + categoryId].name[x] = names[x];
                            }
                        }

                    }


                }
            }
            function translate(jsonStr, isoLang) {
                var isoLang = isoLang;
                if(!isoLang) isoLang = 'EN';
                try {
                    var obj = JSON.parse(jsonStr);
                    var lang = isoLang;
                    if(obj[lang]) {
                        return obj[lang];
                    } else {
                        return jsonStr;
                    } 
                } catch(e) {
                    return jsonStr;
                }

                return jsonStr;

            }

            for(var id in traits) {
               obj.push(traits[id]);
            }
            
            return obj;
    }
};
