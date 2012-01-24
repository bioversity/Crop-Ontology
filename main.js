var apejs = require("apejs.js");
var googlestore = require("googlestore.js");

var usermodel = require("./usermodel.js");
var ontologymodel = require("./ontologymodel.js");
var commentmodel = require("./commentmodel.js");
var termmodel = require("./termmodel.js");
var usermodel = require("./usermodel.js");

var fileupload = require("./fileupload.js");
var auth = require("./auth.js");
var log = require("./log.js");
var rss = require("./rss.js");
var blobstore = require("./blobstore.js");
var taskqueue = require("./taskqueue.js");
var jsonobo = require("./public/js/jsonobo.js"); // also client uses this, SWEET!!!
var excel = require("./excel.js");
var languages = require("./languages.js");

// commonjs modules
var Mustache = require("./common/mustache.js");

var VERSION = "0.7.2";

var print = function(response) {
    return {
        json: function(j) {
            var jsonString = JSON.stringify(j);
            response.getWriter().println(jsonString);
            return jsonString;
        },
        text: function(text) {
            response.getWriter().println(text);
        },
        rss: function(title, arr) {

            response.getWriter().println(rss(title, arr));
        }
    };
};

var isblank = function(javaStr) {
    if(javaStr == null || javaStr.equals(""))
        return true;
    return false;
};

var error = function(response, msg) {
    response.sendError(response.SC_BAD_REQUEST, msg);
};

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

            response.getWriter().println(JSON.stringify(res));
            
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

                response.getWriter().println(JSON.stringify(ret));
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

                    var relationship = term.getProperty("relationship");
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

                response.getWriter().println(JSON.stringify(ret));
            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/get-attributes/([^/]*)": {
        get: function(request, response, matches) {
            var term_id = matches[1];
            if(!term_id) return response.getWriter().println("No term_id");

            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            var attributes = [];

            var attrObj = googlestore.toJS(termEntity);

            // let's skip certain keys
            delete attrObj.id;
            delete attrObj.normalized;
            delete attrObj.parent;
            delete attrObj.ontology_id;
            delete attrObj.ontology_name;
            delete attrObj.is_a;
            delete attrObj.relationship;
            delete attrObj.obo_blob_key;
            delete attrObj.excel_blob_key;

            /*
            var properties = termEntity.getProperties(),
                entries = properties.entrySet().iterator();

            while(entries.hasNext()) {
                var entry = entries.next(),
                    key = entry.getKey(),
                    value = entry.getValue();

                if(!key || !value) continue;

                // let's skip certain keys
                if(key.equals("id") || key.equals("normalized") || key.equals("parent") || key.equals("ontology_id") || key.equals("ontology_name") || key.equals("is_a") || key.equals("relationship") || key.equals("obo_blob_key")|| value.equals("") || key.equals("excel_blob_key"))
                    continue;

                if(value instanceof BlobKey) {
                    // get metadata
                    var blobInfo = new BlobInfoFactory().loadBlobInfo(value),
                        contentType = blobInfo.getContentType();
                    // based on the mime type we need to figure out which image to show
                    if(!contentType.startsWith("image")) { // default to plain text
                        value = "<a target='_blank' href='/serve/"+value.getKeyString()+"'>"+blobInfo.getFilename()+"</a>";
                    } else {
                        value = "<a target='_blank' href='/serve/"+value.getKeyString()+"'><img src='/serve/"+value.getKeyString()+"' /></a>";
                    }

                } else if(value instanceof Text)
                    value = value.getValue();

                attrObj[""+key] = ""+value;
            }
            */

            var order = {
                "creation_date":true,
                "created_at": true,
                "name":true,
                "synonym":true,
                "def":true,
                "Description of Trait":true,
                "comment":true
            };

            // need the current user info to figure out what
            // language they set by default
            var currUser = auth.getUser(request);

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

            response.getWriter().println(JSON.stringify(attributes));
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
            termEntity.setProperty(key, (value instanceof Blob ? value : new Text(value)));
            googlestore.put(termEntity);

            /*
            // the key is just key_GO:0000
            var attribute = googlestore.entity("term", term_id, {
                key: key,
                filename: filename,
                value: (value instanceof Blob ? value : new Text(value)),
                term_id: term_id
            });
            // only if logged in and has permissions
            googlestore.put(attribute);
            */

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

            /*
            var k = googlestore.createKey("attribute", key + "_" + term_id);
            googlestore.del(k);
            */
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
                });
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

            if(!q || q == "") return print(response).json(ret);

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
                return print(response).json([]);

            var res = [];
            // convert the terms to JS objects
            matchedTerms.forEach(function(entity) {
                res.push(googlestore.toJS(entity));
            });
            
            return print(response).json(res);
        }
    },
    "/login" : {
        get: function(request, response) {
            // find user with this key and return its data
            var user = auth.getUser(request),
                username = "",
                userid = "",
                language = "";
            if(user) {
                username = user.getProperty("username");
                userid = user.getKey().getId();
                language = user.getProperty("language");
            }
            if(!language) language = "";
            
            print(response).json({
                username: ""+username,
                userid: ""+userid,
                language: ""+language
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
            print(response).json({"id": biggestInt+1});
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

            var msg = request.getParameter("msg");
            response.getWriter().println('<script>window.top.fileupload_done("'+msg+'");</script>');
        }
    },
    "/attribute-upload": {
        post: function(request, response) {

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

            if(!(value instanceof BlobKey)) {
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
    "/get-term-parents/([^/]*)": {
        get: function(request, response, matches) {
            function getParent(arr, termId) {
                var termKey = googlestore.createKey("term", termId),
                    termEntity = googlestore.get(termKey);
                
                // XXX default to first in array - so not showing if has many parents
                var parentArr = termEntity.getProperty("parent"),
                    parentId;

                if(parentArr instanceof java.util.List) {
                    parentId = parentArr ? ""+parentArr.get(0) : false;
                } else {
                    parentId = parentArr ? ""+parentArr : false;;
                }

                if(!parentId) // reached a root term, stop
                    return;

                // we have parent. get parent information
                var parentKey = googlestore.createKey("term", parentId),
                    parentEntity = googlestore.get(parentKey);

                var id = ""+parentEntity.getProperty("id"),
                    name = parentEntity.getProperty("name");
                arr.push({
                    id: id,
                    name: ""+(name instanceof Text ? name.getValue() : name)
                });

                // now look for parents of this parent
                getParent(arr, id);

            }

            var arr = [];
            var termId = matches[1];
            // start the array with the current term
            var termKey = googlestore.createKey("term", termId),
                termEntity = googlestore.get(termKey);

            var name = termEntity.getProperty("name");
            arr.push({
                id: ""+termEntity.getProperty("id"),
                name: ""+(name instanceof Text ? name.getValue() : name)
            })

            getParent(arr, termId);

            // reverse() so the forst element is actually the first parent (root)
            print(response).json(arr.reverse());
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
                                  .setCacheKey("totTerms_" + onto.getProperty("ontology_id"))
                                  .fetch();
                    categories[key].push({
                        ontology_id: ""+onto.getProperty("ontology_id"),
                        ontology_name: ""+onto.getProperty("ontology_name"),
                        ontology_summary: ""+onto.getProperty("ontology_summary"),
                        username: ""+username,
                        userid: ""+userid,
                        tot: terms.length
                    });
                }
            });
            print(response).json(categories);
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
                if(ontologymodel.exists(ontologyId)) {
                    return err("Ontology with this ID already exists");
                }

                // add the terms
                excel.parseTemplate(6, blobKey, function(term) {
                    // need a reference to the blob of the excel
                    term.excel_blob_key = ""+blobKeyString;

                    var parent = 0; // root by default

                    // create the "trait class" term which is the parent
                    if(term["Trait Class"]) {
                        // set the parent to be this trait
                        parent = ontologyId + ":" + term["Trait Class"];
                        taskqueue.createTask("/create-term", JSON.stringify({
                            id: parent,
                            ontology_name: ""+ontologyName,
                            ontology_id: ""+ontologyId,
                            name: term["Trait Class"]
                        }));
                    }

                    term.name = term["Name of Trait"];

                    // set the actual id of this trait as the ontologyId:TERM-NAME
                    term.id = ontologyId + ":" + term.name;

                    // also need reference to the ontology
                    term.ontology_name = ""+ontologyName;
                    term.ontology_id = ""+ontologyId;
                    term.parent = parent;

                    delete term[""]; // WTF DUDE OMG

                    taskqueue.createTask("/create-term", JSON.stringify(term));
                });

                // create the ontology
                ontologymodel.create(currUser, ontologyId, ontologyName, ontologySummary, category);
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
    }
};
