exports = {
    getDefaultList: function(ontologyId) {

            var terms = googlestore.query("term")
                            //.sort("ibfieldbook")
                            //.sort("name")
                            .filter("ontology_id", "=", ontologyId)
                            //.filter("ibfieldbook", "!=", null)
                            .fetch();

            var traits = {};
            terms.forEach(function(term){
                var ibfieldbook = term.getProperty("ibfieldbook");
                if(ibfieldbook == null){
                    return;
                }
                var name = get("name", term);


                traits["" + term.getProperty("id")] = {
                    name : name
                }
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

                            traits[p]["method"]["" + term.getProperty("id")] = { name : get("name", term) }

                            methods["" + term.getProperty("id")] = traits[p]["method"]["" + term.getProperty("id")];

                        }
                    }
                } else {
                    if(traits[parent]){
                        //this is a method
                        if(!traits[parent]["method"]) traits[parent]["method"] = {};

                        traits[parent]["method"]["" + term.getProperty("id")] = { name : get("name", term) }
                        
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

                            var obj = { name : get("name", term) };
                            addCategory(term, obj);

                            methods[p]["scale"]["" + term.getProperty("id")] = obj;

                        }
                    }
                } else {
                    if(methods[parent]){
                        //this is a scale
                        if(!methods[parent]["scale"]) methods[parent]["scale"] = {};

                        var obj = { name : get("name", term) };
                        addCategory(term, obj);

                        methods[parent]["scale"]["" + term.getProperty("id")] = obj;

                        

                    }
                }

            }); 

            function get(property, term) {
                var val = "" + term.getProperty(property);

                try {
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
