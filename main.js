var apejs = require("apejs.js");
var googlestore = require("googlestore.js");
var memcache = require("memcache.js");
var select = require("select.js");

var usermodel = require("./usermodel.js");
var ontologymodel = require("./ontologymodel.js");
var commentmodel = require("./commentmodel.js");
var termmodel = require("./termmodel.js");
var usermodel = require("./usermodel.js");

var fileupload = require("./fileupload.js");
var auth = require("./auth.js");
var log = require("./log.js");
var email = require("./email.js");
var rss = require("./rss.js");
var httpget = require("./httpget.js");
var blobstore = require("./blobstore.js");
var taskqueue = require("./taskqueue.js");
var jsonobo = require("./public/js/jsonobo.js"); // also client uses this, SWEET!!!
var excel = require("./excel.js");
var languages = require("./languages.js");

// commonjs modules
var Mustache = require("./common/mustache.js");

var VERSION = "0.8.26";
var URL = 'http://www.cropontology.org';

var isblank = function(javaStr) {
    if(javaStr == null || javaStr.equals(""))
        return true;
    return false;
};

var print = function(response) {
    return {
        // callback is a Java string that contains the name
        // of the callback, so we can run JSONP if it exists
        json: function(j, callback) {
            if(response == null) return;
            var jsonString = JSON.stringify(j);

            if(!isblank(callback)) { // JSONP
              jsonString = "" + callback + "(" + jsonString + ");";  
            }

            response.setContentType("application/json");
            response.getWriter().println(jsonString);
            return jsonString;
        },
        text: function(text) {
            if(response == null) return;
            response.getWriter().println(text);
        },
        rss: function(title, arr) {
            if(response == null) return;
            response.getWriter().println(rss(title, arr));
        }
    };
};

var error = function(response, msg) {
    response.sendError(response.SC_BAD_REQUEST, msg);
};

function defaultRelationship(relationship) {
  // relationship could be an array
  if(relationship && (relationship instanceof java.util.List))
      relationship = relationship.get(0);

  if(relationship instanceof Text)
      relationship = relationship.getValue();

  if(!relationship || relationship.equals("")) {
      relationship = "is_a";
  } else {
      relationship = ""+relationship.trim().split(" ")[0];
  }
  return relationship;
}

function renderIndex(htmlFile, data) {
  if(!data) data = {};
  var partials = { 
    CONTENT: render(htmlFile), 
    VERSION: VERSION,
    languages: JSON.stringify(languages.all)
  };
  var html = Mustache.to_html(render("skins/index.html"), data, partials);
  return html;
}
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

apejs.urls = {
    "/": {
        get: function(request, response) {
            var html = renderIndex("skins/list-ontologies.html");
            print(response).text(html);
        }
    },
    "/api": {
        get: function(request, response) {
            var html = renderIndex("skins/api.html", {URL:"http://www.cropontology.org" });
            print(response).text(html);
        }
    },
    "/about": {
        get: function(request, response) {
            var html = renderIndex("skins/about.html");
            print(response).text(html);
        }
    },
    "/video-tutorials": {
        get: function(request, response) {
            var html = renderIndex("skins/video-tutorials.html");
            print(response).text(html);
        }
    },
    "/help": {
        get: function(request, response) {
            var html = renderIndex("skins/help.html");
            print(response).text(html);
        }
    },
    "/latest": {
        get: function(request, response) {
            var html = renderIndex("skins/latest.html");
            print(response).text(html);
        },
        post: function(request, response) {
            var termsQuery = googlestore.query("term")
                                .sort("created_at", "DESC")
                                .fetch(10),
                ontosQuery = googlestore.query("ontology")
                                .sort("created_at", "DESC")
                                .fetch(10);

            var latestTerms = [],
                latestOntos = [];

            // do latest terms
            termsQuery.forEach(function(term) {
                var ontologyName = null,
                    author = null,
                    author_id = null;
                try {
                    var ontoKey = googlestore.createKey("ontology", term.getProperty("ontology_id")),
                        ontoEntity = googlestore.get(ontoKey);

                    ontologyName = ontoEntity.getProperty("ontology_name");

                    // find author from ontology
                    author = googlestore.get(ontoEntity.getProperty("user_key")).getProperty("username");
                    author_id = author.getKey().getId();

                } catch(e) {
                    // something happened, probably the term exists but not the ontology, which is BAD XXX
                    ontologyName = term.getProperty("ontology_name");
                }

                latestTerms.push({
                    "id": ""+term.getProperty("id"),
                    "name": ""+term.getProperty("name"),
                    "created": ""+term.getProperty("created_at"),
                    "ontology_name": ""+ontologyName,
                    "author": ""+author,
                    "author_id": ""+author_id
                });
            });

            // do latest ontos
            ontosQuery.forEach(function(onto) {
                var username = null,
                    userid = null;
                try {
                    if(onto.getProperty("user_key")) {
                        var user = googlestore.get(onto.getProperty("user_key"));
                        username = user.getProperty("username"); 
                        userid = user.getKey().getId();
                    }
                } catch(e){ // user might not exist for this ontology
                }

                latestOntos.push({
                    ontology_id: ""+onto.getProperty("ontology_id"),
                    ontology_name: ""+onto.getProperty("ontology_name"),
                    ontology_summary: ""+onto.getProperty("ontology_summary"),
                    username: ""+username,
                    userid: ""+userid
                });
            });

            print(response).json({
                "latestTerms": latestTerms,
                "latestOntos": latestOntos
            });
        }
    },
    "/ontologies": {
        get: function(request, response) {
            var category = request.getParameter("category"); 
            var ontologies = googlestore.query("ontology");

            ontologies.sort("ontology_name", "ASC");

            if(category && !category.equals(""))
                ontologies.filter("category", "=", category);

            ontologies = ontologies
                            //.setCacheKey("ontology_" + category)
                            .fetch();

            var res = [];
            ontologies.forEach(function(onto){

                var username = "",
                    userid = "";
                if(onto.getProperty("user_key")) {
                    var user = googlestore.get(onto.getProperty("user_key"));
                    username = user.getProperty("username"); 
                    userid = user.getKey().getId();

                }
                res.push({
                    ontology_id: ""+onto.getProperty("ontology_id"),
                    ontology_name: ""+onto.getProperty("ontology_name"),
                    ontology_summary: ""+onto.getProperty("ontology_summary"),
                    username: ""+username,
                    userid: ""+userid
                });
            });

            print(response).json(res, request.getParameter("callback"));
            
        }
    },
    // haha nice REGEX!
    "/ontology(?:/([^/]*)(?:/([^/]*)(?:/([^/]*))?)?)?": {
        get: function(request, response, matches) {

            var ontoId = matches[1];

            if(matches[3] && matches[3] == "rss") {

                var ontoComments = commentmodel.getCommentsByOnto(ontoId);

                // do rss comments
                /*
                print(response).json(ontoComments);
                return;
                */
                response.setContentType("application/xml");
                print(response).rss(matches[2] + " ("+matches[1]+") - Latest Comments", ontoComments);

                return;
            }
            var assoc = {
              "CO_334": "<img src='https://integratedbreeding.net/sites/default/files/uploads/ciat.jpg' /><img src='https://integratedbreeding.net/sites/default/files/uploads/iita.jpg'/>",
              "CO_338": "<img src='https://integratedbreeding.net/sites/default/files/uploads/icrisat_logo.jpg' /><img src='https://integratedbreeding.net/sites/default/files/uploads/icarda.jpg' />",
              "CO_322": "<img src='https://integratedbreeding.net/sites/default/files/uploads/cimmyt-logo.png' />",
              "CO_320": "<img src='https://integratedbreeding.net/sites/default/files/uploads/irri.png'/><img src='https://integratedbreeding.net/sites/default/files/uploads/africa_rice.png' />",
              "CO_324": "<img src='https://integratedbreeding.net/sites/default/files/uploads/icrisat_logo.jpg' />",
              "CO_321": "<img src='https://integratedbreeding.net/sites/default/files/uploads/cimmyt-logo.png' />"
            };
            var cropLogos = "<img src='https://integratedbreeding.net/sites/default/files/uploads/iita.jpg'/>";

            var cropLogos = assoc[matches[1]] || "";

            var html = renderIndex("skins/onto.html", {
              URL:"http://www.cropontology.org",
              ONTOLOGY_CATEGORIES: ontologymodel.catsSelectHtml(),
              ontologyid: matches[1],
              ontologyname: matches[2],
              CROP_LOGOS: cropLogos
            });
            print(response).text(html);
        }
    },
    "/get-ontology/([^/]*)": {
        get: function(request, response, matches) {
            var ontoId = matches[1];
            try {
                // get this ontology data from it's id
                var ontoKey = googlestore.createKey("ontology", ontoId),
                    ontoEntity = googlestore.get(ontoKey);
                var jsonBlobKey = ontoEntity.getProperty("jsonBlobKey");
                // just use serve() to get the jsonString from the blobstore
                blobstore.blobstoreService.serve(jsonBlobKey, response);
            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/get-ontology-roots/([^/]*)": {
        get: function(request, response, matches) {
            var ontoId = matches[1];
            try {
                var rootTerms = googlestore.query("term")
                                .filter("parent", "=", null)
                                .filter("ontology_id", "=", ontoId)
                                .fetch();
                var ret = [];

                rootTerms.forEach(function(term) {
                    var name = term.getProperty("name");
                    if(term.getProperty("is_obsolete") && term.getProperty("is_obsolete").equals("true")) return;

                    ret.push({
                        "id": ""+term.getProperty("id"),
                        "name": ""+(name instanceof Text ? name.getValue() : name)
                    });
                });

                print(response).json(ret, request.getParameter("callback"));
            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/get-ontology-id": {
        get: function(request, response) {
            var ontology_name = request.getParameter("ontology_name");
            if(isblank(ontology_name))
                return error(response, "Missing ontology_name");
            var search_value = ""+ontology_name,
                search_value = search_value.charAt(0).toUpperCase() + search_value.slice(1); // capitalize first letter

            var ontologies = googlestore.query("ontology")
                            .filter("ontology_name", ">=", search_value)
                            .filter("ontology_name", "<", search_value + "\ufffd")
                            .fetch(1);
            var ontology = ontologies[0];

            if(!ontology)
                return error(response, "No traits found for this ontology crop");

            print(response).text(ontology.getProperty("ontology_id"));
        }
    },
    "/delete-ontology": {
        post: function(request, response) {
            try {
                var ontologyId = request.getParameter("ontologyId");
                if(!ontologyId || ontologyId.equals(""))
                    return error(response, "Missing required parameter");

                var currUser = auth.getUser(request);
                if(!currUser)
                    return error(response, "Not logged in");

                var ontoKey = googlestore.createKey("ontology", ontologyId),
                    ontoEntity = googlestore.get(ontoKey);

                // check if own this ontology only if we're not admins
                if(!auth.isAdmin(currUser)) {
                    if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                        return error(response, "You don't have the permissions to delete this ontology");
                }

                // get all the terms that have this ontology_id so we can delete them
                var termsToDelete = googlestore.query("term")
                                        .filter("ontology_id", "=", ontologyId)
                                        .setKeysOnly()
                                        .fetchAsIterable();

                // termsToDelete is an Iterable<Entity>
                // since we need to pass it inside the delete method
                // we need an Iterable<Key>. Implement it using
                // JavaScript directly :)
                var obj = {
                    iterator: function() {
                        var it = termsToDelete.iterator();
                        return new java.util.Iterator({
                            hasNext: function() {
                                return it.hasNext();
                            },
                            next: function() {
                                return it.next().getKey();
                            },
                            remove: function(){
                                it.remove();
                            }
                        });
                    }
                };
                var iterable = new java.lang.Iterable(obj);

                googlestore.del(iterable);

                // now delete the actual ontology entity
                googlestore.del(ontoEntity.getKey());

                memcache.clearAll();
            } catch(e) {
                error(response, e);
            }
        }
    },
    "/get-children/([^/]*)": {
        get: function(request, response, matches) {
            var parentId = matches[1];
            if(!parentId)
                return response.sendError(response.SC_BAD_REQUEST, "missing parameters");

            try {
                var children = googlestore.query("term")
                                .filter("parent", "=", parentId)
                                .fetch();
                var ret = [];

                children.forEach(function(term) {
                    // figure out if this term has children
                    var q = googlestore.query("term")
                            .filter("parent","=", term.getProperty("id"))
                            .fetch(1);

                    var name = term.getProperty("name");

                    var relationship = defaultRelationship(term.getProperty("relationship"));

                    // get the method of this child
                    var method = term.getProperty("Describe how measured (method)");

                    var type = term.getProperty("Type of Measure (Continuous, Discrete or Categorical)"),
                    scales = [];

                    if(type == "Continuous") {
                        scales.push(term.getProperty("For Continuous: units of measurement"));
                    } else if(type == "Categorical") {
                        scales = [
                            term.getProperty("For Categorical: Class 1 - value = meaning"),
                            term.getProperty("For Categorical: Class 2 - value = meaning"),
                            term.getProperty("For Categorical: Class 3 - value = meaning"),
                            term.getProperty("For Categorical: Class 4 - value = meaning"),
                            term.getProperty("For Categorical: Class 5 - value = meaning")
                        ];
                    }
                    if(method instanceof Text)
                        method = method.getValue();

                    scales.forEach(function(s, i) {
                        if(s instanceof Text)
                            scales[i] = ""+s.getValue();
                        else
                            scales[i] = ""+s;
                    });
                    

                    ret.push({
                        "id": ""+term.getProperty("id"),
                        "name": ""+(name instanceof Text ? name.getValue() : name),
                        "relationship": relationship,
                        "has_children": q.length,
                        "method": ""+method,
                        "scales": scales
                    });
                });

                print(response).json(ret, request.getParameter("callback"));
            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/get-attributes/([^/]*)/rdf": {
        get: function(request, response, matches) {
            request.setCharacterEncoding("utf-8");
            response.setContentType("application/rdf+xml; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            var term_id = matches[1];
            if(!term_id) return response.getWriter().println("No term_id");

            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            var attributes = [];

            var attrObj = googlestore.toJS(termEntity);


            var string = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<rdf:RDF xmlns="http://purl.org/obo/owl/" \n' +
                'xmlns:owl="http://www.w3.org/2002/07/owl#" \n' +
                'xmlns:oboInOwl="http://www.geneontology.org/formats/oboInOwl#" \n' +
                'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" \n' +
                'xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" > \n' +
                '<owl:AnnotationProperty rdf:about="http://www.geneontology.org/formats/oboInOwl#hasSynonym"/> \n' +
                '<owl:Class rdf:about="http://www.cropontology.org/terms/' + attrObj["ontology_name"] + ":" + attrObj["ontology_id"] + '"> \n';

            if (attrObj["name"]) {
                string = string + '<rdfs:label xml:lang="en">' + attrObj["name"] + '</rdfs:label>\n';
            }

            if (attrObj["def"]) {
                string = string + '<oboInOwl:hasDefinition>\n<oboInOwl:Definition>\n' +
                    '<rdfs:label xml:lang="en">' + attrObj["def"] + '</rdfs:label>\n' +
                    '</oboInOwl:Definition>\n</oboInOwl:hasDefinition>';
            }

            if (attrObj["synonym"]) {
                string = string + '<oboInOwl:hasExactSynonym>\n<oboInOwl:Synonym>\n<oboInOwl:Definition>\n' +
                    '<rdfs:label xml:lang="en">' + attrObj["synonym"] + '</rdfs:label>\n' +
                    '</oboInOwl:Definition>\n</oboInOwl:Synonym>\n</oboInOwl:hasExactSynonym>';
            }

            if (attrObj["xref"]) {
                string = string + '<oboInOwl:hasDbXref>\n<oboInOwl:DbXref>\n<rdfs:label xml:lang="en">' +
                 attrObj["def"] + '</rdfs:label>\n</oboInOwl:DbXref>\n</oboInOwl:hasDbXref>\n';
            }

            if (attrObj["comment"]) {
                string = string + '<rdfs:comment>' + attrObj["comment"] + '</rdfs:comment>\n';
            }

            if (attrObj["parent"]) {
                string = string + '<rdfs:subClassOf rdf:resource="http://www.cropontology.org/terms/'
                + attrObj["ontology_name"] + ":" + attrObj["parent"] +  '"/>\n';
            }

            if (attrObj["is_a"]) {
                string = string + '<rdfs:subClassOf rdf:resource="http://www.cropontology.org/terms/'
                + attrObj["ontology_name"] + ":" + attrObj["is_a"] +  '"/>\n';
            }

            string = string + "</owl:Class>\n</rdf:RDF>";

            response.getWriter().println(string);
        }
    },
    "/get-attributes/([^/]*)/jsonrdf": {
        get: function(request, response, matches) {
            request.setCharacterEncoding("utf-8")
            response.setContentType("application/rdf+json; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            var term_id = matches[1];
            if(!term_id) return response.getWriter().println("No term_id");

            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            var attributes = [];

            var attrObj = googlestore.toJS(termEntity);

            // let's skip certain keys
            delete attrObj.id;
            delete attrObj.normalized;
            delete attrObj.relationship;
            delete attrObj.obo_blob_key;
            delete attrObj.excel_blob_key;

            var uri = "http://www.cropontology.org/terms/" + attrObj["ontology_name"] + ":" + attrObj["ontology_id"];

            var order = {
                //"created_date": true, // Skipped for the moment
                "name":"http://www.w3.org/2000/01/rdf-schema#label",
                "synonym":"http://www.w3.org/2000/01/rdf-schema#seeAlso",
                "def":"http://www.w3.org/2000/01/rdf-schema#isDefinedBy",
                //"Description of Trait":true, // I think this should go into comment
                "comment":"http://www.w3.org/2000/01/rdf-schema#comment"
            };

            // need the current user info to figure out what
            // language they set by default
            var currUser = auth.getUser(request);

            // do the first ones in order
            for(var i in order) {
                if(attrObj[i]) {
                    var obj = {};
                    obj[order[i]] = {
                        "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i]),
                        "type" : "Literal"
                    };
                    attributes.push(obj);
                }
            }

            // Then do specific ones which have a specific type
            var i = "created_at";
            order[i] = "";
            if(attrObj[i]) {
                attributes.push({
                    "http://purl.org/dc/terms/created": {
                        "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i]),
                        "type": "http://purl.org/dc/terms/date"
                        }
                });
            }

            // I think this won't quite give us the expected output but
            // we can tune that later
            var i = "parent";
            order[i] = "";
            if(attrObj[i]) {
                attributes.push({
                    "http://www.w3.org/2000/01/rdf-schemaSubclassOf": {
                        "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i]),
                        "type": "http://www.w3.org/2002/07/owl#class"
                        }
                });
            }

            // I think this won't quite give us the expected output but
            // we can tune that later
            var i = "is_a";
            order[i] = "";
            if(attrObj[i]) {
                attributes.push({
                    "http://www.w3.org/2000/01/rdf-schemaSubclassOf": {
                        "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i]),
                        "type": "http://www.w3.org/2002/07/owl#class"
                        }
                });
            }

            var i = "creation_date";
            order[i] = "";
            if(attrObj[i]) {
                attributes.push({
                    "http://purl.org/dc/terms/created": {
                        "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i]),
                        "type": "http://www.w3.org/2001/XMLSchema#date"
                        }
                });
            }

            // then do the rest
            for(var i in attrObj) {
                if(order[i]) continue; // skip the ones we already did above
                attributes.push({
                    "key": i,
                    "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i])
                });
            }
            var object = { uri : attributes };

            print(response).json(object, request.getParameter("callback"));
        }
    },
    "/get-attributes/(.*)": {
        get: function(request, response, matches) {
            request.setCharacterEncoding("utf-8")
            response.setContentType("text/html; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            var segments = matches[1].split('/');
            var term_id = segments[0];
            if(!term_id) return response.getWriter().println("No term_id");

            var method = segments[1],
                scale = segments[2];


            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            var attributes = [];

            var attrObj = googlestore.toJS(termEntity);

            // let's skip certain keys
            delete attrObj.id;
            delete attrObj.normalized;
            delete attrObj.parent;
            delete attrObj.relationship;
            delete attrObj.obo_blob_key;
            delete attrObj.excel_blob_key;

            function newAttrs(keys, obj) {
                var newAttrObj = {};
                for(var i=0; i<keys.length; i++) {
                    var key = keys[i];
                    if(obj[key]) {
                        newAttrObj[key] = obj[key];
                    }
                }
                return newAttrObj;
            }
        
            if(method && !scale) { // only show specific attributes
                var methodAttrs = ['Name of method','Describe how measured (method)','Growth stages','Bibliographic Reference Comments'];
                attrObj = newAttrs(methodAttrs, attrObj);
            } else if(scale) {
                var scaleAttrs = ["Type of Measure (Continuous, Discrete or Categorical)","For Continuous: units of measurement","For Continuous: reporting units (if different from measurement)","For Continuous: minimum","For Continuous: maximum","For Discrete: Name of scale or units of measurement","For Categorical: Name of rating scale","For Categorical: Class 1 - value = meaning","For Categorical: Class 2 - value = meaning ","For Categorical: Class 3 - value = meaning","For Categorical: Class 4 - value = meaning","For Categorical: Class 5 - value = meaning","For Categorical: Class 6 - value = meaning","For Categorical: Class 7 - value = meaning","For Categorical: Class 8 - value = meaning","For Categorical: Class 9 - value = meaning","For Categorical: Class 10 - value = meaning","For Categorical: Class 11 - value = meaning","For Categorical: Class 12 - value = meaning","For Categorical: Class 13 - value = meaning","For Categorical: Class 14 - value = meaning","For Categorical: Class 15 - value = meaning","For Categorical: Class 16 - value = meaning","For Categorical: Class 17 - value = meaning","For Categorical: Class 18 - value = meaning","For Categorical: Class 19 - value = meaning","For Categorical: Class 20 - value = meaning","For Categorical: Class 21- value = meaning"];
                attrObj = newAttrs(scaleAttrs, attrObj);
            }
            var order = {
                "creation_date":true,
                "created_at": true,
                "ontology_id":true,
                "ontology_name":true,
                "name":true,
                "synonym":true,
                "def":true,
                "Description of Trait":true,
                "comment":true,
                "is_a":true
            };

            // do the first ones in order
            for(var i in order) {
                if(attrObj[i]) {
                    attributes.push({
                        "key": i,
                        "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i])
                    });
                }
            }

            // then do the rest
            for(var i in attrObj) {
                if(order[i]) continue; // skip the ones we already did above
                attributes.push({
                    "key": i,
                    "value": ((attrObj[i] instanceof Object) ? JSON.stringify(attrObj[i]) : attrObj[i])
                });
            }

            print(response).json(attributes, request.getParameter("callback"));
        }
    },
    "/add-attribute": {
        get: function(){},
        post: function(request, response) {
            function err(msg) { response.getWriter().println('<script>window.top.fileupload_done("'+msg+'");</script>'); }
            // only if logged in
            var currUser = auth.getUser(request);
            if(!currUser)
                return err("Not logged in");

            // get the multipart form data from the request

            var key = "", value = "", term_id = "", filename = "";
            var data = fileupload.getData(request);

            for(var i=0; i<data.length; i++) {
                var fieldName = data[i].fieldName,
                    fieldValue = data[i].fieldValue,
                    isFile = data[i].file;

                if(isFile) {
                    //err("Got file with name: "+fieldName+"<br>");
                    filename = fieldName;
                    value = fieldValue;
                } else {
                    if(fieldName == "key") key = fieldValue; 
                    if(fieldName == "value") value = fieldValue;
                    if(fieldName == "term_id") term_id = fieldValue;
                    //err("Got form-field. "+fieldName+": "+fieldValue+"<br>");
                }
            }

            if(key == "" || value == "" || term_id == "")
                return err("Must complete all fields");

            // get this term from it's id
            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            // set this property value
            if(key === "ibfieldbook") {
                termEntity.setProperty(key, value);
            } else {
                termEntity.setProperty(key, (value instanceof Blob ? value : new Text(value)));
            }
            googlestore.put(termEntity);

            err("");

        }
    },
    "/remove-attribute": {
        post: function(request, response) {
            function err(msg) { 
                response.sendError(response.SC_BAD_REQUEST, msg);
            }
            // only if logged in
            var currUser = auth.getUser(request);
            if(!currUser)
                return err("Not logged in");

            var key = request.getParameter("key"),
                term_id = request.getParameter("term_id");
            if(key == "" || !key || !term_id || term_id == "")
                return err("Missing parameters");

            // get this term from it's id
            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            // check if we own this term only if we're not admins
            if(!auth.isAdmin(currUser)) {
                var ontoKey = googlestore.createKey("ontology", termEntity.getProperty("ontology_id")),
                    ontoEntity = googlestore.get(ontoKey);
                if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                    return err("You don't have the permissions to remove this attribute");
            }

            termEntity.removeProperty(key);
            googlestore.put(termEntity);

        }
    },
    "/httpget": {
        get: function(request, response) {
            /*
            require("./httpget.js");
            var url = request.getParameter("url"),
                contentType = request.getParameter("contentType");
            var ret = httpget(url);
            response.setContentType("text/xml");

            if(contentType && contentType != "")
                response.setContentType(contentType);

            response.getWriter().println(ret);
            */
        }
    },
    "/serve/([^/]*)" : {
        get: function(request, response, matches) {
            var blobKeyString = matches[1];

            var blobKey = new BlobKey(blobKeyString);

            // get metadata
            var blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
            response.setHeader("Cache-Control", "max-age=315360000");
            response.setContentType(blobInfo.getContentType());

            blobstore.blobstoreService.serve(blobKey, response);
            /*
            //response.setHeader("Cache-Control", "max-age=315360000");

            var keyName = matches[1],
                // create key from the user id
                attrKey = googlestore.createKey("attribute", keyName),
                attr = googlestore.get(attrKey);

            var value = attr.getProperty("value");

            if(value instanceof Blob) {
                var bytes = value.getBytes();
                var filename = attr.getProperty("filename");
                var mimeType = ApeServlet.CONFIG.getServletContext().getMimeType(filename);

                response.setContentType(mimeType);
                
                if(!mimeType && !mimeType.startsWith("image")) // if it's not an image, download it
                    response.setHeader("Content-Disposition", "attachment; filename=\"" + filename+"\"");

                response.getOutputStream().write(bytes);
            } else if (value instanceof Text) { // plain text
                response.setContentType("text/plain");
                response.getWriter().println(value.getValue());
            } else {
                response.setContentType("text/plain");
                response.getWriter().println(value);
            }
            */

        }
    },
    "/terms/([^/]*)/(.*)" : {
        get: function(request, response, matches) {
            var termId = matches[1],
                info = matches[2];

            // if info contains the string "static-html", show static HTML of this term
            if(info.indexOf("static-html") != -1) {
                // get the name of term from its ID
                var termKey = googlestore.createKey("term", termId),
                    termEntity = googlestore.get(termKey);


                var skin = Mustache.to_html(render("skins/term.html"), {
                  term_name:termEntity.getProperty("name"),
                  term_id:termId,
                  ontology_name: termEntity.getProperty("ontology_name"),
                  ontology_id: termEntity.getProperty("ontology_id")
                }, {VERSION:VERSION});
            } else {
                var skin = renderIndex("skins/onto.html", {
                  termid: termId
                });
            }
            response.getWriter().println(skin);
            /*
            var skin = render("skins/term.html")
                        .replace(/{{term_name}}/g, matches[2])
                        .replace(/{{term_id}}/g, matches[1]);
            response.getWriter().println(skin);
            */
        }
    },
    "/search" : {
        get: function(request, response, matches) {
            var q = request.getParameter("q");
            var callback = request.getParameter("callback");

            if(!q || q == "") return print(response).json([], callback);

            q = q.toLowerCase().trim();

            // split the search query into words
            var words = q.split(" ");

            var searchField = "normalized";

            var resultLength = 0,
                matchedTerms = [],
                termIds = {}, newTermIds = {};

            // for each word, apply a filter on the query
            for(var i=0; i<words.length; i++) {
                var searchValue = words[i];
                var terms = googlestore.query("term");
                terms.filter(searchField, ">=", searchValue);
                terms.filter(searchField, "<", searchValue + "\ufffd");
                terms = terms.fetch();

                // always clear the matchedTerms array
                matchedTerms.length = 0;

                if(terms.length) {
                    // look into this terms array and discard
                    // all terms that didn't appear in the earlier word iteration
                    // by checking an obj of term ids
                    for(var x=0, len=terms.length; x<len; x++) {
                        var termEntity = terms[x];
                        var id = ""+termEntity.getKey().getName();
                        // on the first word iteration just add all the termids,
                        // and after we start discarding
                        if(i == 0) {
                            termIds[id] = true;
                            matchedTerms.push(termEntity);
                        } else { 
                            if(termIds[id] === true)  {
                                matchedTerms.push(termEntity);
                                newTermIds[id] = true; // track new term ids
                            }
                            if(x == (len-1))
                                termIds = newTermIds;
                        }
                    }

                    resultLength++;
                }
            }

            // check that the result length is same as words length
            // meaning that we found at least an entity for each word
            if(resultLength != words.length)
                return print(response).json([], callback);

            var res = [];
            // convert the terms to JS objects
            matchedTerms.forEach(function(entity) {
                res.push(googlestore.toJS(entity));
            });
            
            return print(response).json(res, callback);
        }
    },
    "/login" : {
        get: function(request, response) {
            // find user with this key and return its data
            var user = auth.getUser(request),
                username = "",
                userid = "";
            if(user) {
                username = user.getProperty("username");
                userid = user.getKey().getId();
            }
            
            print(response).json({
                username: ""+username,
                userid: ""+userid
            });
            //response.getWriter().println('{"username":"'+username+'"}');
        },
        post: function(request, response) {
            var username = request.getParameter("username"),
                password = request.getParameter("password");

            var l = auth.login(response, username, usermodel.sha1(password));

            if(!l)
                response.getWriter().println("Username or password is wrong!");

        }
    },
    "/logout": {
        get: function(request, response) {
            // just delete it on the server
            var userEntity = auth.getUser(request);
            if(userEntity) {
                userEntity.setProperty("token", null); 
                googlestore.put(userEntity);
            }
        }
    },
    "/register": {
        post: function(request, response) {
            var user = {
                created: new java.util.Date(),
                username: request.getParameter("username"),
                email: request.getParameter("email"),
                password: request.getParameter("password"),
                language: request.getParameter("language")
            }, o = {}, error = false;

            for(var i in user)
                if(user[i] == "") error = "Complete the entire form!";


            user.admin = false;

            if(usermodel.emailExists(user.email))
                error = "This email already exists!";

            // check email format
            if(!usermodel.validateEmail(user.email))
                error = "Email is formatted incorrectly";

            if(usermodel.usernameExists(user.username))
                error = "This username already exists";
                
            if(!usermodel.validUsername(user.username))
                error = "The username is not of valid format";

            if(error) {
                response.getWriter().println('{"error":"'+error+'"}');
            } else {
                // sha1 the password
                user.password = usermodel.sha1(user.password);

                var entity = googlestore.entity("user", user);
                var userKey = googlestore.put(entity);

                // ok just login
                auth.login(response, user.username, user.password);

            }
        }
    },
    "/add-comment" : {
        post: function(request, response) {
            var currUser = auth.getUser(request);
            if(!currUser)
                return response.sendError(response.SC_BAD_REQUEST, "Please log in to comment");

            var termId = request.getParameter("termId"),
                ontologyId = request.getParameter("ontologyId"),
                comment = request.getParameter("comment");

            if(!comment || comment == "" || !termId || termId == "") {
                response.sendError(response.SC_BAD_REQUEST, "missing paramaters");
                return;
            }

            var comment = googlestore.entity("comment", {
                termId: termId,
                ontology_id: ontologyId,
                userKey: currUser.getKey(),
                created: new java.util.Date(),
                comment: new Text(comment)
            });

            googlestore.put(comment);
        }
    },
    "/get-comments" : {
        get: function(request, response) {
            var termId = request.getParameter("termId");
            if(termId == "" || !termId) {
                response.sendError(response.SC_BAD_REQUEST, "missing paramaters");
                return;
            }
            // get comments for this term id
            try {
                var comments = googlestore.query("comment")
                    .filter("termId", "=", termId)
                    .fetch();
                var ret = [];
                for(var i=0; i<comments.length; i++) {
                    var comment = comments[i];
                    // conver them all to JS strings so the JSON.stringify can read them
                    var author = false;
                    try {
                        author = googlestore.get(comment.getProperty("userKey"));
                    } catch(e) {
                    }

                    if(author) {
                        ret.push({
                            "created": ""+comment.getProperty("created"),
                            "author": ""+author.getProperty("username"),
                            "author_id": ""+author.getKey().getId(),
                            "comment": ""+comment.getProperty("comment").getValue()

                        });
                    }
                }
                response.getWriter().println(JSON.stringify(ret));
            } catch(e) {
                return response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/add-ontology" : {
        get: function(request, response) {

            var UPLOAD_URL = blobstore.createUploadUrl("/obo-upload");
            var EXCEL_UPLOAD_URL = blobstore.createUploadUrl("/excel-template-upload");

            var html = renderIndex("skins/add-ontology.html", {
                ONTOLOGY_CATEGORIES: ontologymodel.catsSelectHtml(),
                UPLOAD_URL: UPLOAD_URL,
                EXCEL_UPLOAD_URL: EXCEL_UPLOAD_URL
            });
            response.getWriter().println(html);
        },
        post: function(request, response) {
            var currUser = auth.getUser(request);
            if(!currUser)
                return response.sendError(response.SC_BAD_REQUEST, "not logged in");
                
            var json = request.getParameter("json");

            try {
                // let's parse it so we know it's fine
                // maybe it can be a CSV of JSON objects
                // that would be very memory friendly
                var arr = JSON.parse(json);

                var ontologyName = request.getParameter("ontology_name"),
                    ontologyId = request.getParameter("ontology_id"),
                    ontologySummary = request.getParameter("ontology_summary");

                if(!ontologyName || ontologyName == "" || !ontologyId || ontologyId == "" || !ontologySummary || ontologySummary == "")
                    return response.sendError(response.SC_BAD_REQUEST, "missing parameter");

                // create ontology
                var ontoEntity = googlestore.entity("ontology", ontologyId, {
                    created_at: new java.util.Date(),
                    user_key: currUser.getKey(),
                    ontology_id: ontologyId,
                    ontology_name: ontologyName,
                    ontology_summary: ontologySummary,
                    category: request.getParameter("category")
                });

                googlestore.put(ontoEntity);

                memcache.clearAll();

                // now create the terms.
                // a term is each item in the JSON array
                for(var i=0,len=arr.length; i<len; i++) {
                    var term = arr[i];
                    term.ontology_id = ontologyId;
                    term.ontology_name = ontologyName;
                    // XXX someone posting a term with an already existing ID might edit it
                    termmodel.createTerm(term);
                }

            } catch(e) {
                return response.sendError(response.SC_BAD_REQUEST, e);
            }
        
        }
    },
    "/edit-ontology" : {
        get: function(request, response) {
            var html = render("./skins/add-ontology.html")
                        .replace(/{{VERSION}}/g, VERSION);
            response.getWriter().println(html);
        },
        post: function(request, response) {
            var currUser = auth.getUser(request);
            if(!currUser)
                return response.sendError(response.SC_BAD_REQUEST, "not logged in");

            try {
                var ontologyId = request.getParameter("ontology_id");
                var ontoKey = googlestore.createKey("ontology", ontologyId),
                    ontoEntity = googlestore.get(ontoKey);

                // check that we own this ontology only if we're not admins
                if(!auth.isAdmin(currUser)) {
                    if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                        return response.sendError(response.SC_BAD_REQUEST, "you can't edit this ontology");
                }

                // now edit it
                var ontologyName = request.getParameter("ontology_name"),
                    ontologySummary = request.getParameter("ontology_summary"),
                    category = request.getParameter("category");

                if(!ontologyName || ontologyName == "" || !ontologySummary || ontologySummary == "" || !category || category == "")
                    return response.sendError(response.SC_BAD_REQUEST, "missing parameters");

                googlestore.set(ontoEntity, {
                    ontology_name: ontologyName,
                    ontology_summary: ontologySummary,
                    category: category
                });
                googlestore.put(ontoEntity);
                memcache.clearAll();

            } catch(e) {
                return response.sendError(response.SC_BAD_REQUEST, e);
            }

        }
    },
    "/serve" : {
        get: function(request, response) {
            var blobKey = new BlobKey(request.getParameter("blob-key"));

            blobstore.blobstoreService.serve(blobKey, response);
        }
    },
    "/obo-upload" : {
        post: function(request, response) {

            function err(msg) { response.sendRedirect('/attribute-redirect?msg='+msg); }

            var currUser = auth.getUser(request);
            if(!currUser)
                return err("Not logged in");

            var blobs = blobstore.blobstoreService.getUploadedBlobs(request),
                oboBlobKey = blobs.get("obofile");

            if(oboBlobKey == null) {
                return err("Something is missing. Did you fill out all the fields?");
            }
            try {
                var ontologyName = request.getParameter("ontology_name"),
                    ontologySummary = request.getParameter("ontology_summary");

                if(!ontologyName || ontologyName == "" || !ontologySummary || ontologySummary == "")
                    return err("Something is missing. Did you fill out all the fields?");


                // let's use BlobstoreInputStream to read more than 1mb at a time.
                // we read and parse line by line because we don't want to allocate
                // memory - keeping it light
                var oboBlobKeyString = ""+oboBlobKey.getKeyString(),
                    ontologyNameString = ""+ontologyName;


                var first = true,
                    ontologyId = 0,
                    stop = false;
                blobstore.readLine(oboBlobKey, function(line) {
                    if(stop) return;
                    jsonobo.findTerm(line, function(term) { // the callback is called when a complete Term is found
                        // let's safely assume the first term we find contains
                        // the ontology id
                        if(first) {
                            var split = term.id.split(":");
                            ontologyId = split[0];

                            first = false;

                            // check if this ontoId already exists
                            // (of course only runs the first time)
                            try {
                                var ontoKey = googlestore.createKey("ontology", ontologyId);
                                var ontoEntity = googlestore.get(ontoKey);
                                stop = true;
                            } catch (e) {
                                // if we get here, ontology doesn't exist
                                stop = false;
                            }
                        }
                        
                        if(stop) return;

                        // need a reference to the obo we just created
                        term.obo_blob_key = oboBlobKeyString;
                        // also need reference to the ontology
                        term.ontology_name = ontologyNameString;

                        // use this terms ontology ID, if it's different from the rest
                        // it will not show up - it's the OBO's fault
                        term.ontology_id = ontologyId;


                        // we found a term, let's save it in datastore.
                        // XXX, the .put() in here is expensive - takes more than 30secs
                        // spawn a Task or something else
                        // pass the data as a JSON string
                        taskqueue.createTask("/create-term", JSON.stringify(term));
                    });
                });

                if(stop) {
                    return err("Ontology ID already exists");
                }

                // create the ontology
                var ontoEntity = googlestore.entity("ontology", ontologyId, {
                    created_at: new java.util.Date(),
                    user_key: currUser.getKey(),
                    ontology_id: ontologyId,
                    ontology_name: ontologyName,
                    ontology_summary: ontologySummary,
                    category: request.getParameter("category")
                });

                googlestore.put(ontoEntity);
                memcache.clearAll();

                return err("");
            } catch(e) {
                return err(e);
            }

        }
    },
    "/obo-upload-url": {
        get: function(request, response) {
            var uploadUrl = blobstore.createUploadUrl("/obo-upload");
            response.getWriter().println(uploadUrl);
        }
    },
    "/excel-upload-url": {
        get: function(request, response) {
            var uploadUrl = blobstore.createUploadUrl("/excel-template-upload");
            response.getWriter().println(uploadUrl);
        }
    },
    "/create-term": {
        post: function(request, response) {
            /*
            importPackage(java.util.logging);
            var logger = Logger.getLogger("org.whatever.Logtest");

            var jsonTerm = request.getParameter("jsonTerm");
            logger.info("== RAN TASK - JSON TERM: "+jsonTerm);
            */

            // XXX if the term id or relationship already exists, do something!

            // parse the JSON
            var jsonTerm = request.getParameter("jsonTerm");
            var term = JSON.parse(jsonTerm);

            // if there's a language passed and
            // it's not ENglish, find the entity, and tranform its properties
            // into JSON - to represent both languages
            if(term.language && term.language !== 'EN') {
                var term = termmodel.translate(term, languages);
            }
            
            // add it to datastore
            termmodel.createTerm(term);
        }
    },
    "/next-id": {
        get: function(request, response) {
            var ontologyId = request.getParameter("ontology_id");
            if(!ontologyId || ontologyId == "")
                return response.sendError(response.SC_BAD_REQUEST, "missing parameter");

            // find all terms with this ontology_id
            var terms = googlestore.query("term")
                        .filter("ontology_id", "=", ontologyId)
                        .fetch();

            var ret = [],
                biggestInt = 0;
            terms.forEach(function(term) {
                // find biggest id
                var id = term.getProperty("id"),
                    idInt = id.split(":");
                if(idInt.length > 1)
                    idInt = idInt[1];
                else
                    idInt = idInt[0];

                idInt = parseInt(idInt, 10);

                if(idInt > biggestInt)
                    biggestInt = idInt;

            });
            print(response).json({"id": pad(biggestInt+1, 7)});
        }
    },

    /**
     * finds the OBO blob and converts it to a JSON
     * blob which is also then inserted in the blob store and a reference of it
     * is added to the ontology entity
     */
    "/obo-to-json": {
        get: function(request, response) {

            var oboBlobKey = new BlobKey(request.getParameter("oboBlobKey"));
            if(!oboBlobKey)
                return response.sendError(response.SC_BAD_REQUEST, "missing parameter");


        }
    },
    "/attribute-upload-url": {
        get: function(request, response) {
            var uploadUrl = blobstore.createUploadUrl("/attribute-upload");
            response.getWriter().println(uploadUrl);
        }
    },
    "/attribute-redirect": {
        get: function(request, response) {
            request.setCharacterEncoding("utf-8")
            response.setContentType("text/html; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            var msg = request.getParameter("msg");
            response.getWriter().println('<script>window.top.fileupload_done("'+msg+'");</script>');
        }
    },
    "/attribute-upload": {
        post: function(request, response) {
            request.setCharacterEncoding("utf-8")
            response.setContentType("text/html; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            function err(msg) { response.sendRedirect('/attribute-redirect?msg='+msg); }

            // only if logged in
            var currUser = auth.getUser(request);
            if(!currUser)
                return err("Not logged in");

            var blobs = blobstore.blobstoreService.getUploadedBlobs(request),
                blobKey = blobs.get("value");
                
            var value = request.getParameter("value");
            var term_id = request.getParameter("term_id"); 
            var key = request.getParameter("key");
            var lang = request.getParameter("language");

            if(!term_id || term_id == "" || !key || key == "")
                return err("Must complete all fields");

            if(blobKey)
                value = blobKey;

            if(!value || value == "")
                return err("Must complete all fields");

            // get this term from it's id
            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            var jsEntity = googlestore.toJS(termEntity);

            // check if own this term
            var ontoKey = googlestore.createKey("ontology", termEntity.getProperty("ontology_id")),
                ontoEntity = googlestore.get(ontoKey);

            // check if it's our ontology only if we're not admins
            if(!auth.isAdmin(currUser)) {
                if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                    return err("You don't have the permissions to edit this attribute");
            }

            if(key == "ibfieldbook") {
                value = ""+value;
            } else if(!(value instanceof BlobKey)) {
              value = ""+value;
              var obj = jsEntity[key];
              // obj is either instanceof Object or type "string"
              if(!(obj instanceof Object)) {
                // means object is a string.
                // if it exists add it to the obj as the default langauge
                var cpy = obj;
                obj = {};
                if(cpy !== "") {
                  obj[languages.default] = cpy;   
                }
              }
              if(isblank(lang)) {
                obj[languages.default] = value;
              } else {
                obj[lang] = value;
              }
              value = new Text(JSON.stringify(obj));
            }

            termEntity.setProperty(key, value);

            // clear normalized before setting it
            jsEntity.normalized = "";
            googlestore.set(termEntity, {
                "normalized": termmodel.normalize(jsEntity)
            });
            googlestore.put(termEntity);

            err("");
        }
    },
    "/curruser-ontologies": {
        get: function(request, response) {
            var currUser = auth.getUser(request);
            if(!currUser)
                response.sendError(response.SC_BAD_REQUEST, "Not logged in");

            
            var ontos = googlestore.query("ontology");
            // return all ontologies if admin
            if(!auth.isAdmin(currUser)) {
                ontos.filter("user_key", "=", currUser.getKey());
            }

            ontos = ontos.fetch();

            var ret = [];
            ontos.forEach(function(onto) {
                var category = onto.getProperty("category");
                if(!category || category.equals(""))
                    category = "";

                ret.push({
                    ontology_id: ""+onto.getProperty("ontology_id"),
                    ontology_name: ""+onto.getProperty("ontology_name"),
                    ontology_summary: ""+onto.getProperty("ontology_summary"),
                    category: ""+category
                });
            });

            response.getWriter().println(JSON.stringify(ret));

        }
    },
    "/get-term-parents/(.*)": {
        get: function(request, response, matches) {
            function getParent(arr, untouched, branch, termId) {
                var termKey = googlestore.createKey("term", termId),
                    termEntity = googlestore.get(termKey);
                
                var parentList = termEntity.getProperty("parent");

                if(!parentList) { // reached a root term, stop
                    return;
                }

                if(!(parentList instanceof java.util.List)) { // if it's not a list? make it
                    parentList = java.util.Arrays.asList(parentList);
                }

                for(var i=0; i<parentList.size(); i++) {
                  // we have parent. get parent information
                  var parentId = parentList.get(i);
                  var parentKey = googlestore.createKey("term", parentId),
                      parentEntity = googlestore.get(parentKey);

                  var id = ""+parentEntity.getProperty("id"),
                      name = parentEntity.getProperty("name");
                  var o = {
                      id: id,
                      name: ""+(name instanceof Text ? name.getValue() : name),
                      relationship: defaultRelationship(parentEntity.getProperty("relationship"))
                  };
                  if(i === 0) {
                    if(parentList.size() > 0) { // has parents
                      untouched = branch.slice(0);   
                    }
                    branch.push(o);
                  } else if(i > 0) {
                    // copy all stuff from current branch
                    // slice(0) seems to make me clone the array somehow! no idea why
                    var newBranch = untouched.slice(0);
                    newBranch.push(o);
                    arr.push(newBranch);
                    branch = newBranch;
                  }

                  // now look for parents of this parent
                  getParent(arr, untouched, branch, id);
                }
            }

            var termId = matches[1].split("/")[0];
            // start the array with the current term
            var termKey = googlestore.createKey("term", termId),
                termEntity = googlestore.get(termKey);

            var name = termEntity.getProperty("name");
            var o = {
                id: ""+termEntity.getProperty("id"),
                name: ""+(name instanceof Text ? name.getValue() : name),
                relationship: defaultRelationship(termEntity.getProperty("relationship"))
            };
            var arr = [];
            var branch = [];
            branch.push(o);

            arr.push(branch);

            var untouched = branch.slice(0);

            getParent(arr, untouched, branch, termId);

            // reverse() so the forst element is actually the first parent (root)
            for(var i=0; i<arr.length; i++) {
              arr[i] = arr[i].reverse();
            }
            print(response).json(arr, request.getParameter("callback"));
            return arr;
        }
    },
    "/get-categories": {
        get: function(request, response) {
            // to get categories we need to get all ontologies and
            // filter the unique values
            var ontologies = googlestore.query("ontology")
                            //.setCacheKey("get-categories") 
                            .fetch();

            var categories = {}; // use an object so keys are unique :D
            ontologies.forEach(function(onto){
                if(onto.getProperty("category")) 
                    categories[""+onto.getProperty("category")] = 0;
            });
            // convert object to simple array
            var cats = [];
            for(var i in categories) 
                cats.push(i);

            print(response).json(cats);
        }
    },
    "/get-ontologies": {
        get: function(request, response) {
            var cacheKey = "/get-ontologies";
            var data = memcache.get(cacheKey);
            if(data) return print(response).json(JSON.parse(data), request.getParameter("callback"));

            var ontologies = googlestore.query("ontology")
                            .sort("ontology_name", "ASC")
                            .fetch();

            var categories = {}; // use an object so keys are unique :D
            ontologies.forEach(function(onto){
                if(onto.getProperty("category")) {
                    var key = ""+onto.getProperty("category");
                    if(!categories[key]) categories[key] = [];
                    // convert this ontology into something JSON can read
                    var username = "",
                        userid = "";
                    if(onto.getProperty("user_key")) {
                        var user = googlestore.get(onto.getProperty("user_key"));
                        username = user.getProperty("username"); 
                        userid = user.getKey().getId();
                    }
                    // get all terms for this ontology
                    // maybe we can cache this... let's see how it performs
                    var terms = googlestore.query("term") 
                                  .filter("ontology_id", "=", onto.getProperty("ontology_id"))
                                  .fetch();
                    // get the terms and filter on 'obo_blob_key' to tell if it has an obo, otherwise it's template
                    var oboTerms = googlestore.query("term")
                                    .filter("ontology_id", "=", onto.getProperty("ontology_id"))
                                    .filter("obo_blob_key", "!=", null)
                                    .fetch();

                    categories[key].push({
                        ontology_id: ""+onto.getProperty("ontology_id"),
                        ontology_name: ""+onto.getProperty("ontology_name"),
                        ontology_summary: ""+onto.getProperty("ontology_summary"),
                        username: ""+username,
                        userid: ""+userid,
                        tot: terms.length,
                        oboTerms: oboTerms.length
                    });
                }
            });
            memcache.put(cacheKey, JSON.stringify(categories));
            print(response).json(categories, request.getParameter("callback"));
        }
    },
    "/users": {
        get: function(request, response) {
            try {
                var users = googlestore.query("user")
                            .fetch();
                    
                var ret = [];

                users.forEach(function(userEntity) {
                    ret.push(usermodel.out(userEntity));
                });
                print(response).json(ret);

            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/users/([a-zA-Z0-9_]+)": {
        get: function(request, response, matches) {
            var userid = matches[1];

            try {
                // get this user data
                var userKey = googlestore.createKey("user", parseInt(userid, 10)),
                    userEntity = googlestore.get(userKey);

                print(response).json(usermodel.out(userEntity));
            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/user-ontologies": {
        get: function(request, response) {
            var userid = request.getParameter("userid");
            if(!userid || userid.equals(""))
                return response.sendError(response.SC_BAD_REQUEST, "missing userid");

            try {
                var userKey = googlestore.createKey("user", parseInt(userid, 10));

                var ontologies = googlestore.query("ontology")
                                    .filter("user_key", "=", userKey)
                                    .fetch();

                var ret = [];

                ontologies.forEach(function(ontology) {
                    ret.push(googlestore.toJS(ontology));
                });

                print(response).json(ret);

            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/admin": {
        get: function(request, response) {
            /*
            var key = googlestore.createKey("user", 2);
            var rose = googlestore.get(key);

            rose.setProperty("admin", true);

            googlestore.put(rose);
            */

        }
    },
    "/feedback": {
        get: function(request, response) {
            var skin = renderIndex("skins/feedback.html");
            response.getWriter().println(skin);
        }
    },
    "/annotation-tool": {
        get: function(request, response) {
            var skin = render("skins/annotation-tool.html");
            response.getWriter().println(skin);
        }
    },
    "/csv-download": {
        post: function(request, response) {
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition","attachment;filename=result.csv"); 
            
            var csvString = request.getParameter("csvString");
            response.getWriter().println(csvString);
        }
    },
    "/excel-template-upload": {
        get: function(request, response) {
            var UPLOAD_URL = blobstore.createUploadUrl("/excel-template-upload");
            var skin = "<form method='post' enctype='multipart/form-data' action='"+UPLOAD_URL+"'><input type='file' name='excelfile' /><input type='submit' /></form>";
            response.getWriter().println(skin);
        },
        post: function(request, response) {
            function err(msg) { response.sendRedirect('/attribute-redirect?msg='+msg); }

            var currUser = auth.getUser(request);
            if(!currUser)
                return err("Not logged in");

            function getTrait(row) {
                var obj = {};
                for(var i in row) {
                    obj[i] = row[i]; 
                    if(obj[i] == "") delete obj[i];
                    if(i == 'Trait Class') break;
                }
                if(row['ibfieldbook']) obj['ibfieldbook'] = row['ibfieldbook'];
                return obj;
            }

            function getMethod(row) {
                var obj = {};
                var startCopy = false;
                for(var i in row) {
                    if(startCopy) {
                        obj[i] = row[i]; 
                        if(obj[i] == "") delete obj[i];
                    }
                    if(i == 'Comments') break;
                    if(i == 'Trait Class') startCopy = true;
                }
                delete obj['ibfieldbook'];
                return obj;
            }
            function getScale(row) {
                var obj = {};
                var startCopy = false;
                for(var i in row) {
                    if(startCopy) {
                        obj[i] = row[i]; 
                        if(obj[i] == "") delete obj[i];
                    }
                    if(i == 'Comments') startCopy = true;
                }
                delete obj['ibfieldbook'];
                return obj;
            }

            var blobs = blobstore.blobstoreService.getUploadedBlobs(request),
                blobKey = blobs.get("excelfile"),
                ontologyName = request.getParameter("ontology_name"),
                ontologyId = request.getParameter("ontology_id"),
                ontologySummary = request.getParameter("ontology_summary"),
                category = request.getParameter("category");

            if(blobKey == null || isblank(ontologyId) || isblank(ontologyName) || isblank(ontologySummary) || isblank(category)) {
                return err("Something is missing. Did you fill out all the fields?");
            }

            var blobKeyString = blobKey.getKeyString();

            try {
                // check wheter ontologyId already exists
                var ontoEntity = ontologymodel.getById(ontologyId);
                if(ontoEntity) {
                    // check that we own this ontology
                    if(!ontologymodel.owns(currUser, ontoEntity)) {
                        return err("Ontology with this ID already exists");
                    }
                }

                var id = 0; // start id at 0
                var idlen = 7;

                var rootId = ontologyId + ":ROOT";

                var mod = "Trait ID for modification, Blank for New",
                    ib = "ib primary traits",
                    langKey = "Language of submission (only in ISO 2 letter codes)",
                    methodMod = "Method ID for modification, Blank for New",
                    scaleMod = "Scale ID for modification, Blank for New";

                // list of ids that are in the Term ID column to modify
                // we do these, and then we do the new ones so we know what ID to start using
                var editedIds = []; 
                var newTerms = [];

                var terms = [];
                // add the terms
                excel.parseTemplate(6, blobKey, function(term) {
                    // need a reference to the blob of the excel
                    term.excel_blob_key = ""+blobKeyString;

                    var parent = rootId;

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
                    trait.ontology_name = ""+ontologyName;
                    trait.ontology_id = ""+ontologyId;
                    trait.parent = parent; // parent is Trait Class
                    trait.language = term[langKey];

                    var method = getMethod(term);
                    method.name = method["Name of method"] || method["Describe how measured (method)"];
                    method.ontology_name = ""+ontologyName;
                    method.ontology_id = ""+ontologyId;
                    method.relationship = "method_of";
                    method.language = term[langKey];

                    // make method children of this trait
                    trait.method = method;

                    var scale = getScale(term);
                    scale.name = scale["Type of Measure (Continuous, Discrete or Categorical)"];
                    scale.ontology_name = ""+ontologyName;
                    scale.ontology_id = ""+ontologyId;
                    scale.relationship = "scale_of";
                    scale.language = term[langKey];

                    // make scale children of this method
                    method.scale = scale;

                    if(term[mod]) editedIds.push(term[mod]);
                    if(term[methodMod]) editedIds.push(term[methodMod]);
                    if(term[scaleMod]) editedIds.push(term[methodMod]);

                    terms.push(trait);
                });


                if(!terms.length) return err("Seems like an empty template?");

                // check that the terms array contains an element "Name of Trait".
                // this is our validation to make sure the template is correct
                if(!(terms[0]['Name of Trait'])) {
                    return err("Check that your template is structured correctly!");
                }

                // create ROOT
                taskqueue.createTask("/create-term", JSON.stringify({
                    id: rootId,
                    ontology_name: ""+ontologyName,
                    ontology_id: ""+ontologyId,
                    name: ""+ontologyName,
                    language: terms[0][langKey],
                    parent: 0
                }));

                // figure out the id, as in the biggest of the editedIds
                // THIS SHIT SUCKS
                var freeEditedId = 0;
                if(editedIds.length) {
                    freeEditedId = parseInt((editedIds.sort().reverse()[0]).split(':')[1], 10) + 1;
                    if(!freeEditedId) {
                        return err("Something wrong with your template. Check that the ID's that you're providing are of correct form such as: C0_NNN:nnnnnnn");
                    }
                }
                var freeStoreId = termmodel.findFreeId(ontologyId);
                var freeId = freeEditedId;
                if(freeStoreId > freeEditedId) {
                    freeId = freeStoreId;
                }

                // MAIN LOOP
                for(var i in terms) {
                    var trait = terms[i];
                    if(trait[mod]) {
                        trait.id = trait[mod];
                    } else {
                        trait.id = ontologyId + ':' + pad(freeId++, 7);
                    }

                    var method = trait.method;
                    if(method[methodMod]) {
                        method.id = method[methodMod];
                    } else {
                        method.id = ontologyId + ':' + pad(freeId++, 7);
                    }
                    method.parent = trait.id;

                    var scale = method.scale;
                    if(scale[scaleMod]) {
                        scale.id = scale[scaleMod];
                    } else {
                        scale.id = ontologyId + ':' + pad(freeId++, 7);
                    }
                    scale.parent = method.id;

                    // add scale
                    taskqueue.createTask("/create-term", JSON.stringify(scale));

                    // add method
                    delete method['scale'];
                    taskqueue.createTask("/create-term", JSON.stringify(method));

                    // add trait
                    delete trait['method'];
                    taskqueue.createTask("/create-term", JSON.stringify(trait));

                }

                taskqueue.createTask("/memcache-clear", "");

                // create the ontology
                if(!ontoEntity) {
                    ontologymodel.create(currUser, ontologyId, ontologyName, ontologySummary, category);
                }
                return err("");
            } catch(e) {
                return err(e);
            }
        }
    },
    "/backup": {
        get: function(request, response) {
            var kind = request.getParameter("kind");
            if(isblank(kind))
                return error(response, "Need kind");

            var currUser = auth.getUser(request);
            if(!currUser)
                return error(response, "Not logged in");
            if(!auth.isAdmin(currUser)) 
                return error(response, "Need to be an admin");

            // CSV?
            try {
                var entities = googlestore.query(kind)
                                .fetch();
                var arr = [];
                entities.forEach(function(entity) {
                    arr.push(googlestore.toJS(entity)); 
                });
                return print(response).json(arr);
            } catch (e) {
                return error(response, e);
            }
        }
    },
    "/report": {
        post: function(request, response) {
            var ontoId = request.getParameter("ontology_id");
            if(isblank(ontoId)) return error(response, "Invalid parameter");
            var terms = {};
            select('term')
                .find({ ontology_id: ontoId })
                .each(function() {
                    terms[this.id] = this;
                });

            function addTo(obj, obj2, id) {
                for(var i in obj2) {
                    var newi = i;
                    if(i == 'id') newi = id + '_' + i;
                    if(i == 'relationship') newi = id + '_' + i;
                    obj[newi] = obj2[i];
                }
            }

            var traits = [];
            for(var id in terms) {
                var term = terms[id];
                if(term.relationship == 'scale_of') {
                    var obj = {};
                    var scale = term;
                    var method = terms[scale.parent];
                    var trait = terms[method.parent];

                    addTo(obj, trait, 'trait');
                    addTo(obj, method, 'method');
                    addTo(obj, scale, 'scale');

                    traits.push(obj);
                }
            }
            print(response).json(traits); 
        },
        get: function(request, response) {
            var ontoId = request.getParameter("ontology_id");
            if(isblank(ontoId)) return error(response, "Invalid parameter");

            print(response).text(
                  render("./skins/report.html")
                      .replace(/{{ontology_id}}/g, ""+ontoId)
                      .replace(/{{VERSION}}/g, VERSION)
            );
        }
    },
    "/edit-profile": {
      post: function(req, res) {
        var language = req.getParameter("language");
        var currUser = auth.getUser(req);
        if(!currUser) return error(res, "Not logged in");
        if(isblank(language)) return error(res, "You need to insert a language");

        currUser.setProperty("language", language);
        googlestore.put(currUser);
      }
    },
    "/add-parent": {
        get: function(req, res) {
            try {
                // only if logged in
                var currUser = auth.getUser(req);
                if(!currUser) throw "Not logged in";

                var termId = req.getParameter("termId");
                var parentId = req.getParameter("parentId");

                if(isblank(termId) || isblank(parentId)) throw "Missing parameters";

                var termKey = googlestore.createKey("term", termId),
                    termEntity = googlestore.get(termKey);

                var parentKey = googlestore.createKey("term", parentId),
                    parentEntity = googlestore.get(parentKey);

                // find parents of this term (reusing http api, powerful)
                // and be sure this parentId doesn't exist in there
                var getTermParents = apejs.urls["/get-term-parents/([^/]*)"]["get"]; 
                var pathsToParent = getTermParents({ getParameter: function(){ return "";}}, null, [0, parentId]);

                pathsToParent.forEach(function(path) {
                    path.forEach(function(parent) {
                        if(parent.id == termId) {
                            throw "You can't make this element a child of itself";
                        }
                    });
                });

                // be sure the ontologies are the same
                if(!termEntity.getProperty("ontology_id").equals(parentEntity.getProperty("ontology_id")))
                    throw "You're moving a term in another ontology. Can't do that.";

                // check if it's our ontology only if we're not admins
                if(!auth.isAdmin(currUser)) {
                    // check if own this term
                    var ontoKey = googlestore.createKey("ontology", termEntity.getProperty("ontology_id")),
                        ontoEntity = googlestore.get(ontoKey);

                    if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                        throw "You don't have the permissions to edit this term";
                }

                // at this point we can do the add
                var parent = termEntity.getProperty("parent");
                if(!(parent instanceof java.util.List)) { // if it's not a list? make it
                    parent = java.util.Arrays.asList(parent);
                }
                parent.add(parentId);
                termEntity.setProperty("parent", parent);
                googlestore.put(termEntity);

            } catch(e) {
                return error(res, e);
            }
        }
    },
    "/agtrials": {
        get: function(req, res) {
            var html = renderIndex("skins/agtrials.html");
            print(res).text(html);
        }
    },
    "/primary": {
        get: function(req, res) {
            var currUser = auth.getUser(req);
            if(!auth.isAdmin(currUser))
                return error(res, "Not admin");

            var ids = req.getParameter("ids");

            var arr = JSON.parse(ids);

            print(res).text(arr.length + " terms to be set primary<br><br>");

            arr.forEach(function(id) {
                var termKey = googlestore.createKey("term", id),
                    termEntity = googlestore.get(termKey);

                termEntity.setProperty("ibfieldbook", "default");
                googlestore.put(termEntity);
                print(res).text(id + " was set");
            });

        }
    },
    "/ibfieldbook": {
        get: function(req, res) {
            var ontologyId = req.getParameter("ontologyId");
            var html = req.getParameter("html");

            var obj = {};

            var terms = googlestore.query("term")
                            .sort("ibfieldbook")
                  //          .sort("name")
                            .filter("ibfieldbook", "!=", null)
                            .fetch();
            terms.forEach(function(term) {
                var ontoId = term.getProperty("ontology_id");
                if(!obj[ontoId])
                    obj[ontoId] = [];
                
                // toJS is SLOW
                // only do it if it has JSON
                var name = term.getProperty("name");
                if(name instanceof Text) name = name.getValue();
                name = ""+name;
                /*
                if(name.charAt(0) == "{") // wow weird JSON checkup lol
                    name = JSON.parse(name)[languages.default] || "";
                */

                obj[ontoId].push({
                    id: ""+term.getProperty("id"),
                    name: name,
                    has_children: 1
                });
            });

            // if we pass ontologyid, filter by that
            if(!isblank(ontologyId)) {
                if(obj[ontologyId])
                    return print(res).json(obj[ontologyId]);
            }

            if(html) {
                var html = renderIndex("skins/ibfieldbook.html");
                return print(res).text(html);
            }

            print(res).json(obj);
        }
    },
    "/forgot-password": {
        get: function(req, res) {
            var html = renderIndex("skins/forgot-password.html");
            print(res).text(html);
        },
        post: function(req, res) {
            var data = {};
            var emailPar = req.getParameter('email');

            // find if this email exists
            var foundUser = false;
            select('user')
                .find({ email: emailPar })
                .limit(1)
                .each(function() {
                    foundUser = this; 
                });

            if(!foundUser) data.error = "User with this email doesn't exist";

            if(!data.error) {
                var from = {
                    address: "admin@cropontology-curationtool.org",
                    personal: "Crop Ontology Curation Tool"
                };
                var to = {
                    address: foundUser.email,
                    personal: foundUser.username
                };
                email.send(from, to, "Password reset!", "Please click on this link to reset your password: " + URL + '/reset-password?email=' + foundUser.email + '&secret=' + foundUser.password); 

                data.success = "Check your email!";
            }

            var html = renderIndex("skins/forgot-password.html", data);
            print(res).text(html);
        }
    },
    "/reset-password": {
        get: function(req, res) {
            var emailPar = req.getParameter('email');
            var secret = req.getParameter('secret');

            var data = {};

            data.email = emailPar;
            data.secret = secret;

            var foundUser = false;
            select('user')
                .find({ 
                    email: emailPar,
                    password: secret
                })
                .limit(1)
                .each(function() {
                    foundUser = this; 
                });

            if(!foundUser) data.error = 'Something went wrong. Please try again';

            var html = renderIndex("skins/reset-password.html", data);
            print(res).text(html);
        },
        post: function(req, res) {
            var emailPar = req.getParameter('email');
            var secret = req.getParameter('secret');
            var newpassword = req.getParameter('newpassword');
            var renewpassword = req.getParameter('renewpassword');

            var data = {};
            data.email = emailPar;
            data.secret = secret;

            var user = select('user')
                        .find({ 
                            email: emailPar,
                            password: secret
                        })
                        .limit(1);

            user.values(function(values) {
                if(!values.length)  {
                    data.error = 'Something went wrong. Try recovering your password again!';
                } else {
                    // we found a user, let's change its password
                    // we can get the user select scope from above, sweet!
                    if(isblank(newpassword)) {
                        data.error = "Your password can't be blank";
                    } else if(!newpassword.equals(renewpassword)) {
                        data.error = "Your passwords don't match. Re-type them";
                    } else {
                        user.attr({ password: usermodel.sha1(newpassword) });
                    }
                }
            });

            if(!data.error) data.success = 'Your password was successfully changed! You can now log in using your new password';


            var html = renderIndex("skins/reset-password.html", data);
            print(res).text(html);

        }
    },
    "/memcache-clear": {
        post: function(req, res) {
            memcache.clearAll();
        }
    }
};
