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
                                       name : "toto", 
                                       // type : type, 
                                       // minimum : min, 
                                       // maximum : max
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
                                       name : "toto", 
                                       // type : type, 
                                       // minimum : min, 
                                       // maximum : max
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
                    // var ibfieldbook = term.getProperty("ibfieldbook");
                    // if(ibfieldbook == null){
                    //     return;
                    // }
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
    }
};
