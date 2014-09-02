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
var rdf = require("./rdf.js");
var httpget = require("./httpget.js");
var blobstore = require("./blobstore.js");
var taskqueue = require("./taskqueue.js");
var jsonobo = require("./public/js/jsonobo.js"); // also client uses this, SWEET!!!
var excel = require("./excel.js");
var languages = require("./languages.js");
var template = require('./template.js');
var search = require('./search.js');

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
    response.setCharacterEncoding("UTF-8");
    return {
        // callback is a Java string that contains the name
        // of the callback, so we can run JSONP if it exists
        json: function(j, callback) {
            if(response == null) return;
            var jsonString = JSON.stringify(j, null, 2);

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
        textPlain: function(text) {
            if(response == null) return;
            response.setContentType("text/plain");
            response.getWriter().println(text);
        },
        html: function(html) {
            if(response == null) return;
            response.setContentType("text/html");
            response.getWriter().println(html);
        },
        rss: function(title, arr) {
            if(response == null) return;
            response.getWriter().println(rss(title, arr));
        }
    };
};

function translate(jsonStr, isoLang) {
    var isoLang = isoLang;
    if(!isoLang) isoLang = 'EN';
    try {
        var obj = JSON.parse(jsonStr);
        var lang = languages.iso[isoLang];
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

var error = function(response, msg) {
    response.sendError(response.SC_BAD_REQUEST, msg);
};

function defaultRelationship(relationship) {
    if(!relationship) relationship = 'is_a';
  // relationship could be an array
  if(relationship && (relationship instanceof java.util.List))
      relationship = relationship.get(0);

/*
  if(relationship.length)
    relationship = relationship[0];
    */

  if(relationship instanceof Text)
      relationship = relationship.getValue();

  if(!(relationship instanceof java.lang.String)) {
    relationship = new java.lang.String(relationship);
  }

  if(!relationship || relationship.equals("")) {
      relationship = "is_a";
  } else {
      relationship = ""+relationship.trim().split(" ")[0];
  }
  return relationship;
}

function defaultParent(parent) {
    if(!parent) parent = 0;
    if(parent === 'null') parent = 0;
    if(typeof parent === 'string')
        return parent;

    if(parent.length)
        parent = parent[0];

    return parent;
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

            var token = request.getParameter("token"); 
            if(!isblank(token)) {
                try {
                    var url = 'https://www.integratedbreeding.net/auth/?key=cropon_nc39F34j&token=' + token;
                    var result = httpget(url);
                    var j = JSON.parse(result);
                    if(j.error) throw "Invalid token";
                    // if we get here, we can login this user!
                    // try logging in with username=username and password=token
                    // if not, register (all on the client using Ajax APIs)
                    j.token = token;
                    var ibpHtml = Mustache.to_html(render("skins/ibp.html"), j);
                    print(response).text(ibpHtml);
                } catch(e) {
                }
            }
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
                    ontologyName = term.getProperty("uttontology_name");
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
            if(matches[3] && matches[3] == "ttl") {
                response.sendRedirect('nt');
                return;
            }
            if(matches[3] && (matches[3] == "nt" || matches[3] == "rdf")) {
                if(matches[3] == 'rdf') { // send this triple data to converter!
                    var converter = 'http://rdf-translator.appspot.com/convert/nt/pretty-xml/http%3A%2F%2Fwww.cropontology.org%2Fontology%2F'+encodeURIComponent(matches[1])+'%2Ffoo%2Fnt';
                    response.sendRedirect(converter);
                    return;
                }
                response.setContentType('text/plain');
                // get this ontology data from it's id
                var ontoKey = googlestore.createKey("ontology", ontoId),
                    ontoEntity = googlestore.get(ontoKey),
                    ontologyId = ontoEntity.getProperty('ontology_id');

                var nt = new rdf().buildNtriples(ontologyId);
                print(response).text(nt);
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
            request.setCharacterEncoding("utf-8");
            response.setContentType("application/json; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            var ontoId = matches[1];
            try {
                var rootTerms = googlestore.query("term")
                                .filter("parent", "=", null)
                                .filter("ontology_id", "=", ontoId)
                                .fetch();
                var ret = [];

                var excelBlobKey = googlestore.query('term')
                                    .filter("ontology_id", "=", ontoId)
                                    .filter("excel_blob_key", "!=", null)
                                    .limit(1)
                                    .fetch();
                if(excelBlobKey.length)
                    excelBlobKey = excelBlobKey[0].getProperty('excel_blob_key')

                try {
                    var o = JSON.parse(excelBlobKey);

                    for(var i in o) {
                        excelBlobKey = o[i]; 
                        break;
                    }


                }catch(e){}


                rootTerms.forEach(function(term) {
                    var name = term.getProperty("name");
                    if(term.getProperty("is_obsolete")) return;

                    ret.push({
                        "id": ""+term.getProperty("id"),
                        "name": ""+(name instanceof Text ? name.getValue() : name),
                        oboBlobKey: ''+term.getProperty('obo_blob_key'),
                        excelBlobKey: ''+excelBlobKey
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
            request.setCharacterEncoding("utf-8");
            response.setContentType("application/json; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

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

            var ret = [];
            ret.push({"id": ""+ontology.getProperty("ontology_id")});
            print(response).json(ret, request.getParameter("callback"));
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
    "/get-children/(.*)": {
        get: function(request, response, matches) {
            request.setCharacterEncoding("utf-8")
            response.setContentType("text/html; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            var parentId = matches[1];
            if(!parentId)
                return response.sendError(response.SC_BAD_REQUEST, "missing parameters");

            try {
                var children = googlestore.query("term")
                                .sort("name")
                                .filter("parent", "=", parentId)
                                .fetch();
                var ret = [];

                children.forEach(function(term) {
                    // figure out if this term has children
                    var q = googlestore.query("term")
                            .filter("parent","=", term.getProperty("id"))
                            .fetch(1);

                    var name = term.getProperty("For Continuous: units of measurement") || term.getProperty("For Discrete: Name of scale or units of measurement") ||
                                    term.getProperty("For Categorical: Name of rating scale") || term.getProperty("name");

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
            //var term_id = segments[0];
            var term_id = matches[1];
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
    "/obo/([^/]*)": {
        get: function(request, response, matches) {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("UTF-8");
            response.setContentType('text/plain');

            var ontologyId = matches[1];
            if(!ontologyId) return response.getWriter().println("No ontology id");

            var isoLang = request.getParameter('isoLang');

            response.setHeader("Content-Disposition","attachment;filename="+ontologyId+".obo"); 

            print(response).textPlain('format-version: 1.2');
            print(response).textPlain('ontology: TEMP');
            print(response).textPlain('');

            select('term')
                .find({ 
                    ontology_id: ontologyId
                })
                .sort('id', 'DESC')
                .each(function() {
                    var order = ['id', 'name', 'parent', 'subClassOf', 'methodOf', 'scaleOf'];
                    print(response).textPlain('[Term]');

                    var r = new rdf();
                    print(response).textPlain('id: ' + r.encodeID(this.id));
                    print(response).textPlain('name: ' + translate(this.name, isoLang));
                    if(this['Description of Trait']) {
                        print(response).textPlain('def: "' + translate(this['Description of Trait'], isoLang) + '" []');
                    }
                    if(this['Describe how measured (method)']) {
                        print(response).textPlain('def: "' + translate(this['Describe how measured (method)'], isoLang) + '" []');
                    }

                    if(this.relationship) {
                        print(response).textPlain('relationship: ' + this.relationship + ' ' + r.encodeID(this.parent));
                    } else if(this.parent && this.parent != "null") {
                        print(response).textPlain('relationship: is_a ' + r.encodeID(this.parent));
                    }

                    print(response).text('');
                });
            print(response).text('[Typedef]')
            print(response).text('id: method_of')
            print(response).text('is_transitive: true');
            print(response).text('')
            print(response).text('[Typedef]')
            print(response).text('id: scale_of')
            print(response).text('is_transitive: true');

        },
    },
    "/rdf/([^/]*)/(.*)": {
        get: function(request, response, matches) {
            response.sendRedirect('/rdf/' + matches[1]);
        }
    },
    "/rdf/([^/]*)": {
        get: function(request, response, matches) {
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("UTF-8");
            response.setContentType('text/plain');

            var term_id = matches[1];
            if(!term_id) return response.getWriter().println("No term_id");

            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            var termJS = select.fn.toJS(termEntity);

            var nt = new rdf().buildTriple(termJS);
            print(response).text(nt);
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
            response.setHeader( "Content-Disposition", "filename=" + blobInfo.getFilename() );

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

            var lang = request.getParameter('language');


            // if info contains the string "static-html", show static HTML of this term
            if(info.indexOf("static-html") != -1) {
                // get the name of term from its ID
                var termKey = googlestore.createKey("term", termId),
                    termEntity = googlestore.get(termKey);

                var name = termEntity.getProperty('name');
                if(name instanceof Text) name = name.getValue();
                try { 
                    var jname = JSON.parse(name);
                    name = jname[lang] || jname[languages.default];
                } catch(e) {
                }

                var skin = Mustache.to_html(render("skins/term.html"), {
                  term_name:name,
                  term_id:termId,
                  ontology_name: termEntity.getProperty("ontology_name"),
                  ontology_id: termEntity.getProperty("ontology_id"),
                  language: lang
                }, {
                    VERSION:VERSION,
                    languages: JSON.stringify(languages.all)
                });
            } else {
                var skin = renderIndex("skins/onto.html", {
                  termid: termId
                });
            }
            //response.getWriter().println(skin);
            print(response).html(skin);
            /*
            var skin = render("skins/term.html")
                        .replace(/{{term_name}}/g, matches[2])
                        .replace(/{{term_id}}/g, matches[1]);
            response.getWriter().println(skin);
            */
        }
    },
    /*
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
    */
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
                    category = request.getParameter("category"),
                    userKey = request.getParameter('userKey');

                if(!ontologyName || ontologyName == "" || !ontologySummary || ontologySummary == "" || !category || category == "")
                    return response.sendError(response.SC_BAD_REQUEST, "missing parameters");

                googlestore.set(ontoEntity, {
                    ontology_name: ontologyName,
                    ontology_summary: ontologySummary,
                    category: category,
                    user_key: KeyFactory.stringToKey(userKey),
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

            function err(msg) { response.sendRedirect('/attribute-redirect?msg='+JSON.stringify(''+msg)); }

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

                        if(!term.parent) term.parent = null;


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

            // every term should have a langauge
            var term = termmodel.translate(term, languages);
            
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
            response.getWriter().println('<script>window.top.fileupload_done('+msg+');</script>');
        }
    },
    "/attribute-upload": {
        post: function(request, response) {
            request.setCharacterEncoding("utf-8")
            response.setContentType("text/html; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            function err(msg) { response.sendRedirect('/attribute-redirect?msg='+JSON.stringify(''+msg)); }

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
                    category: ""+category,
                    userKey: ''+KeyFactory.keyToString(onto.getProperty('user_key'))
                });
            });

            response.getWriter().println(JSON.stringify(ret));

        }
    },
    "/get-term-parents/(.*)": {
        get: function(request, response, matches) {
            request.setCharacterEncoding("utf-8");
            response.setContentType("application/json; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

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

            //var termId = matches[1].split("/")[0];
            var termId = matches[1];
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
                                  .filter("Crop", "!=", null)
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
            function err(msg) { response.sendRedirect('/attribute-redirect?msg='+JSON.stringify(''+msg)); }

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
            
            function getCol(obj, col) {
                var count = 0;
                for(var i in obj) { 
                    count++; 
                    if(count == col) return obj[i]; 
                }
            }
            function isEmpty(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }

                return true;
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
                    if(!auth.isAdmin(currUser)) { // if we're not admins check that we own this ontology
                        if(!ontologymodel.owns(currUser, ontoEntity)) {
                            return err("Ontology with this ID already exists, and you don't own it");
                        }
                    }
                }

                // this has all the logics for parsing the template
                // and creating terms
                new template(blobKey, ontologyId, ontologyName)

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
        get: function(request, response) {
            var ontoId = request.getParameter("ontology_id");
            if(isblank(ontoId)) return error(response, "Invalid parameter");

            var language = request.getParameter('language');
            if(isblank(language)) 
                language = languages.default;

            var terms = {};
            var parents = {};
            select('term')
                .find({ 
                    ontology_id: ontoId
                })
                .each(function() {
                    /*
                    var isoLang = languages.getIso[language]
                    try {
                        var jlang = JSON.parse(this.language)
                        if(!jlang[language]) return;
                        
                    } catch(e) { // it's just a regular string
                        if(this.language != isoLang) return;
                    }
                    */
                    terms[this.id] = this;
                    parents[''+defaultParent(this.parent)] = true;
                });

            function translate(value, language) {
                try {
                    var j = JSON.parse(value);
                    if(j[language]) {
                        value = j[language];
                    } else {
                        // could be "undefined"
                        if(j['undefined'])
                            return j['undefined'];
                        else
                            return false;
                    } 
                } catch(e) {
                    if(language != languages.default) {
                        return false;
                    }
                }
                return value;

            }
            function addTo(obj, obj2, id) {
                if(!obj2) return;
                if(id == 'trait') {
                    var order = ['ibfieldbook','Name of submitting scientist','Institution','Language of submission (only in ISO 2 letter codes)', 'Date of submission'  ,'Crop'    ,'Name of Trait',   'Abbreviated name','Synonyms (separate by commas)','Trait ID for modification, Blank for New',    'Description of Trait',    'How is this trait routinely used?',   'Trait Class'];

                } else if(id == 'method') {
                    var order = ['Method ID for modification, Blank for New',   'Name of method',  'Describe how measured (method)',  'Growth stages',   'Bibliographic Reference', 'Comments'];

                } else if(id == 'scale') {
                    var order = ['Scale ID for modification, Blank for New', 'Type of Measure (Continuous, Discrete or Categorical)', 'For Continuous: units of measurement','For Continuous: reporting units (if different from measurement)','For Continuous: minimum','For Continuous: maximum','For Discrete: Name of scale or units of measurement','For Categorical: Name of rating scale','For Categorical: Class 1 - value = meaning','For Categorical: Class 2 - value = meaning','For Categorical: Class 3 - value = meaning','For Categorical: Class 4 - value = meaning','For Categorical: Class 5 - value = meaning','For Categorical: Class 6 - value = meaning','For Categorical: Class 7 - value = meaning','For Categorical: Class 8 - value = meaning','For Categorical: Class 9 - value = meaning','For Categorical: Class 10 - value = meaning', 'For Categorical: Class 11 - value = meaning', 'For Categorical: Class 12 - value = meaning'
                    ];

                }
                for(var i in order) {
                    var o = order[i];
                    var newo = o;
                    if(o == 'Trait ID for modification, Blank for New' ||
                        o == 'Method ID for modification, Blank for New' ||
                        o == 'Scale ID for modification, Blank for New')
                         {
                        newo = 'id';
                    }
                    if(obj2[newo]) {
                        var t = ''+translate(obj2[newo], language);
                        if(!t) continue;
                        obj[o] = t;
                    } else {
                        obj[o] = '';
                    }
                }
                if(id == 'scale' || id == 'obo') {
                    for(var i in obj2) {
                        if(i == 'id' || id == 'relationship') continue;
                        var t = ''+translate(obj2[i], language);
                        if(!t) continue;
                        obj[i] = t;
                    }
                }
            }

            var traits = [];
            for(var id in terms) {
                var term = terms[id];
                var relationship = term.relationship;
                if(typeof relationship == 'object') {
                    relationship = ''+relationship[0];
                }
                if(relationship)
                    relationship = ''+relationship.split(' ')[0];

                if(relationship == 'scale_of') {
                    var obj = {};
                    var scale = term;
                    scale.parent = ''+defaultParent(scale.parent);
                    var method = terms[scale.parent];
                    if(!method) continue;
                    method.parent = ''+defaultParent(method.parent);
                    var trait = terms[method.parent];

                    addTo(obj, trait, 'trait');
                    addTo(obj, method, 'method');
                    addTo(obj, scale, 'scale');

                    traits.push(obj);
                } else if(relationship == 'method_of' && !parents[id]) { // this method isn't parent of anything
                    var obj = {};
                    var scale = {};
                    var method = term;
                    method.parent = ''+defaultParent(method.parent);
                    var trait = terms[method.parent];

                    addTo(obj, method, 'method');

                    traits.push(obj);
                } else if(!parents[id]) { // this should be trait, isn't parent of anything - or it could also be OBO last child
                    var obj = {};
                    var scale = {};
                    var method = {};
                    var trait = term;

                    //addTo(obj, trait, 'trait');

                    traits.push(term);
                }
            }
            if(!traits.length) { // probably no methods nor scales, just get the last child
                function hasChildren(termId) {
                    for(var i in terms) {
                        var term = terms[i];
                        term.parent = ''+defaultParent(term.parent);
                        if(term.parent == termId)
                            return false;
                    }
                    return true;
                }
                for(var id in terms) {
                    var term = terms[id];

                    if(hasChildren(term.id)) {
                        var empty = true;
                        var obj = {};
                        addTo(obj, term, 'obo');
                        // check that obj is full before adding
                        for(var x in obj) {
                            empty = false;
                            break;
                        }
                        if(!empty) {
                            traits.push(obj);
                        }
                    }
                }
            }
function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';

    var head = array[0];
    for (var index in array[0]) {
        var value = index + "";
        line += '"' + value.replace(/"/g, '""') + '",';
    }

    line = line.slice(0, -1);
    str += line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';

        for (var index in array[i]) {
            var value = array[i][index] + "";
            line += '"' + value.replace(/"/g, '""') + '",';
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
    
}
            response.setContentType("application/csv");
            response.setHeader('Content-Disposition', 'attachment; filename='+ontoId+'.csv');
            print(response).text(JSON2CSV(traits));
        },
        post: function(request, response) {
            var ontoId = request.getParameter("ontology_id");
            if(isblank(ontoId)) return error(response, "Invalid parameter");

            /*

            var excels = {
                'CO_334': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Cassava%2020120524%20EN-Default%20trait%20set%20english.xlsx',
                'CO_324': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Sorghum%2020130121%20EN%20Trait%20Dicitonary%20ver%204.xls',
                'CO_338': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Chickpea%2020120801%20EN%20TD_Ontology.xls?attredirects=0&d=1',
                'CO_335': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Common%20Bean%20EN%2020121102%20200%20Traits%20Template%204%20plus%20term_ids%20.xlsx?attredirects=0&d=1',
                'CO_340': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Cowpea%2020120413%20EN-50TraitTemplatever3_1FINAL.xlsx?attredirects=0&d=1',
                'CO_337': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Groundnut%2020120529%20EN-Default%20Trait%20Set.xls?attredirects=0&d=1',
                'CO_322': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Maize%2020120327%20EN-50%20Trait_TTemplate_ver3-IBP-RS-1_EAIDs.xlsx?attredirects=0&d=1',
                'CO_327': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Pearl%20millet%2020130116%20EN%20TraitTemplate_ver_4.xlsx?attredirects=0&d=1',
                'CO_341': 'http://www.cropontology.org/serve/AMIfv96Hm4mX_ThvGCrodMBSLgoa3XENZFuQY-9HsSlTLfJyP7yCl4aci4jbhX1l682H-woHvN8a6FmJZgfr4VlVM_aLiMje7uOMt-maPD_RKb6oiB1OaXBRL1sEgpFF-jKUJHALrzQDg2HcpSMq5DuoJMj7PRIjv5whgOBaOIao1-OXdorcqvyqtEYawhKr8MYsEt768k3B',
                'CO_320': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Rice%2020120521%20CN%20-Default%20Set%20NB%20plus%20revised%20method%20names.xlsx?attredirects=0&d=1',
                'CO_321': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Wheat%2020120506%20EN-50%20Traits-AP-RS-Revised-.xlsx?attredirects=0&d=1',
                'CO_343': 'http://genesys.cgxchange.org/gcp-crop-ontology/m-crop-ontology-curation-tool/latest-versions-trait-sets-received/Yam%2020121129%20EN%20Traits%20Template%20v4.xlsx?attredirects=0&d=1'
              
            };

            if(excels[ontoId]) {

                return response.sendRedirect(excels[ontoId]);
            } else {
                return error(response, "Sorry there's no Excel version of this ontology");
            }

            return;
            */

            var ontoId = request.getParameter("ontology_id");
            if(isblank(ontoId)) return error(response, "Invalid parameter");
            var language = request.getParameter('language');
            if(isblank(language)) 
                language = languages.default;

            print(response).text(
                  render("./skins/report.html")
                      .replace(/{{ontology_id}}/g, ""+ontoId)
                      .replace(/{{language}}/g, ""+language)
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
            req.setCharacterEncoding("utf-8")
            res.setContentType("text/html; charset=UTF-8");
            res.setCharacterEncoding("UTF-8");

            var ontologyId = req.getParameter("ontologyId");
            var html = req.getParameter("html");

            var obj = {};

            var terms = googlestore.query("term")
                            .sort("ibfieldbook")
                            .sort("name")
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
    "/rebuild-search-index": {
        get: function(req, res) {
            var s = new search();
            select('term')
                .find() // do it in chunks
                .each(function() {
                    // add document to search index
                    try {
                        s.add(this);
                    }catch(e){
                        
                    }
                    
                });

        }
    },
    "/search": {
        get: function(req, res) {
            var q = req.getParameter('q');
            var s = new search();
            var results = s.search(q);
            var iter = results.iterator();
            var arr = [];
            while(iter.hasNext()) {
                var scoredDoc = iter.next();

                var fields = scoredDoc.getExpressions();

                var obj = {}
                obj.id = ''+scoredDoc.getOnlyField('id').getText();
                obj.name = ''+scoredDoc.getOnlyField('name').getText();
                obj.ontology_name = ''+scoredDoc.getOnlyField('ontology_name').getText();
                // try parsing the name as it might be a JSON string
                try {
                    obj.name = JSON.parse(obj.name);
                } catch(e) {
                    // if parsing failed, revert to what it was
                    obj.name = obj.name;
                }
                try {
                    obj.ontology_name = JSON.parse(obj.ontology_name);
                } catch(e) {
                    // if parsing failed, revert to what it was
                    obj.ontology_name = obj.ontology_name;
                }
                arr.push(obj);
            }
            print(res).json(arr);
        }
    },
    "/memcache-clear": {
        post: function(req, res) {
            memcache.clearAll();
        }
    },
    "/get-terms-by-property": {
        get: function(req, res) {
            var property = req.getParameter('property');

            var terms = googlestore.query("term")
                            .filter(property, "!=", null)
                            .fetch();

            var result = [];
            terms.forEach(function(term){
                result.push(googlestore.toJS(term));
            });


            print(res).json(result);
            
        }
    },
    "/dump": {
        get: function(req, res) {
            var offset = req.getParameter('offset') || 0;
            var terms = googlestore.query("term")
                            .offset(offset)
                            .fetch(1000);
            var arr = []
            for(var i=0; i<terms.length; i++) {
                var t = terms[i];
                var j = select.fn.toJS(t);
                if(j.normalized)
                    delete j.normalized;
                if(j.obo_blob_key)
                    delete j.obo_blob_key;
                if(j.excel_blob_key)
                    delete j.excel_blob_key;

                arr.push(j);
            }
            print(res).json(arr);
        }
    },
    "/default-list": {
        get: function(request, response) {

            var ontologyId = request.getParameter("ontologyId");
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
                if(parent.getClass().isArray()){
                    for(var i = 0; i<parent.length;i++){
                        var p = parent[i];
                        if(traits[p]){
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
                if(parent.getClass().isArray()){
                    for(var i = 0; i<parent.length;i++){
                        var p = parent[i];
                        if(methods[p]){
                            //this is a scale
                            if(!methods[p]["scale"]) methods[p]["scale"] = {};

                            methods[p]["scale"]["" + term.getProperty("id")] = { name : get("name", term) }
                        }
                    }
                } else {
                    if(methods[parent]){
                        //this is a scale
                        if(!methods[parent]["scale"]) methods[parent]["scale"] = {};

                        methods[parent]["scale"]["" + term.getProperty("id")] = { name : get("name", term) }
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
            print(response).json(traits);
        }
    }
};
