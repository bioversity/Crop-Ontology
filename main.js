require("apejs.js");
require("googlestore.js");

require("./fileupload.js");
require("./usermodel.js");
require("./auth.js");
require("./log.js");

var VERSION = "0.2.52";

var print = function(response) {
    return {
        json: function(j) {
            response.getWriter().println(JSON.stringify(j));
        },
        rss: function(title, arr) {
            require("./rss.js");

            response.getWriter().println(rss(title, arr));
        }
    };
}

apejs.urls = {
    "/": {
        get: function(request, response) {
            var skin = render("skins/index.html")
                        .replace(/{{CONTENT}}/g, render("skins/list-ontologies.html"))
                        .replace(/{{VERSION}}/g, VERSION);
            response.getWriter().println(skin);
            
        }
    },
    "/api": {
        get: function(request, response) {
            var skin = render("skins/index.html")
                        .replace(/{{CONTENT}}/g, render("skins/api.html"))
                        .replace(/{{VERSION}}/g, VERSION)
                        .replace(/{{URL}}/g, "http://www.cropontology-curationtool.org");
            response.getWriter().println(skin);
            
        }
    },
    "/ontologies": {
        get: function(request, response) {
            var category = request.getParameter("category"); 
            var ontologies = googlestore.query("ontology");

            ontologies.sort("ontology_name", "ASC");

            if(category && !category.equals(""))
                ontologies.filter("category", "=", category);

            ontologies = ontologies.fetch();

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
    "/ontology(?:/([a-zA-Z0-9_\: \.]+)(?:/([a-zA-Z0-9_\: \.]+)(?:/([a-zA-Z0-9]+))?)?)?": {
        get: function(request, response, matches) {
            require("./ontologymodel.js");

            var ontoId = matches[1];

            if(matches[3] && matches[3] == "rss") {
                require("./commentmodel.js");

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

            var skin = render("skins/index.html")
                    .replace(/{{CONTENT}}/g, render("skins/onto.html"))
                    .replace(/{{ONTOLOGY_CATEGORIES}}/g, ontologymodel.catsSelectHtml())
                    .replace(/{{VERSION}}/g, VERSION)
                    .replace(/{{ontologyid}}/g, matches[1]);
            response.getWriter().println(skin);
        }
    },
    "/get-ontology/([a-zA-Z0-9_\: \.]+)": {
        get: function(request, response, matches) {
            require("./blobstore.js");

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
    "/get-ontology-roots/([a-zA-Z0-9_\: \.]+)": {
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
    "/get-children/([a-zA-Z0-9_\: \.]+)": {
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

                    ret.push({
                        "id": ""+term.getProperty("id"),
                        "name": ""+(name instanceof Text ? name.getValue() : name),
                        "relationship": relationship,
                        "has_children": q.length
                    });
                });

                response.getWriter().println(JSON.stringify(ret));
            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/get-attributes/([a-zA-Z0-9_\: \.]+)": {
        get: function(request, response, matches) {
            require("./blobstore.js");

            var term_id = matches[1];
            if(!term_id) return response.getWriter().println("No term_id");

            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            var properties = termEntity.getProperties(),
                entries = properties.entrySet().iterator();

            var attributes = [];

            while(entries.hasNext()) {
                var entry = entries.next(),
                    key = entry.getKey(),
                    value = entry.getValue();

                if(!key || !value) continue;

                // let's skip certain keys
                if(key.equals("id") || key.equals("normalized") || key.equals("parent") || key.equals("ontology_id") || key.equals("ontology_name") || key.equals("is_a") || key.equals("relationship") || key.equals("obo_blob_key")|| value.equals(""))
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

                attributes.push({
                    "key": ""+ key,
                    "value": ""+value
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

            // check if we own this term
            var ontoKey = googlestore.createKey("ontology", termEntity.getProperty("ontology_id")),
                ontoEntity = googlestore.get(ontoKey);
            if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                return err("You don't have the permissions to remove this attribute");

            // set it to null
            termEntity.setProperty(key, null);
            googlestore.put(termEntity);

            /*
            var k = googlestore.createKey("attribute", key + "_" + term_id);
            googlestore.del(k);
            */
        }
    },
    "/httpget": {
        get: function(request, response) {
            require("./httpget.js");
            var url = request.getParameter("url"),
                contentType = request.getParameter("contentType");
            var ret = httpget(url);
            response.setContentType("text/xml");

            if(contentType && contentType != "")
                response.setContentType(contentType);

            response.getWriter().println(ret);
        }
    },
    "/serve/([a-zA-Z0-9_\: \-]+)" : {
        get: function(request, response, matches) {
            require("./blobstore.js");
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
    "/terms/([a-zA-Z0-9_\: \.]+)/(.*)" : {
        get: function(request, response, matches) {
            var termId = matches[1],
                termName = matches[2];

            // find the ontologyid form this term
            /*
            var termKey = googlestore.createKey("term", termId),
                termEntity = googlestore.get(termKey);

            // get ontology
            var ontologyId = termEntity.getProperty("ontology_id");
            */


            var skin = render("skins/index.html")
                    .replace(/{{CONTENT}}/g, render("skins/onto.html"))
                    .replace(/{{VERSION}}/g, VERSION)
                    .replace(/{{termid}}/g, termId);
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
                matchedTerms = []; // contains all the terms entities

            // for each word, apply a filter on the query
            for(var i=0; i<words.length; i++) {
                var searchValue = words[i];
                var terms = googlestore.query("term");
                terms.filter(searchField, ">=", searchValue);
                terms.filter(searchField, "<", searchValue + "\ufffd");
                terms = terms.fetch();

                if(terms.length) {

                    // but all the terms we found in a big array
                    terms.forEach(function(termEntity) {
                        matchedTerms.push(termEntity);
                    });

                    resultLength++;
                }
            }

            // check that the result length is same as words length
            // meaning that we found entities with all the words
            if(resultLength != words.length)
                return print(response).json([]);

            // found somewhere online
            function compressArray(original) {
                var compressed = [];
                // make a copy of the input array
                var copy = original.slice(0);
             
                // first loop goes over every element
                for (var i = 0; i < original.length; i++) {
                    var myCount = 0;    
                    // loop over every element in the copy and see if it's the same
                    for (var w = 0; w < copy.length; w++) {
                        if (original[i].equals(copy[w])) { // XXX changed this to .equals since it's an array of entities
                            // increase amount of times duplicate is found
                            myCount++;
                            // sets item to undefined
                            delete copy[w];
                        }
                    }
                    if (myCount > 0) {
                        var a = {};
                        a.value = original[i];
                        a.count = myCount;
                        compressed.push(a);
                    }
                }
             
                return compressed;
            };

            var compressed = compressArray(matchedTerms);

            var res = [];
            // loop through the compressed and see if the count matches the resultLength
            compressed.forEach(function(o) {
                var entity = o.value,
                    count = o.count;

                if(count == resultLength)
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
                password: request.getParameter("password")
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
                return response.sendError(response.SC_FORBIDDEN);

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
        post: function(request, response) {
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
                    var author = googlestore.get(comment.getProperty("userKey"));
                    ret.push({
                        "created": ""+comment.getProperty("created"),
                        "author": ""+author.getProperty("username"),
                        "author_id": ""+author.getKey().getId(),
                        "comment": ""+comment.getProperty("comment").getValue()

                    });
                }
                response.getWriter().println(JSON.stringify(ret));
            } catch(e) {
            }
        }
    },
    "/add-ontology" : {
        get: function(request, response) {
            require("./blobstore.js");
            require("./ontologymodel.js");

            var UPLOAD_URL = blobstore.createUploadUrl("/obo-upload");

            var html = render("./skins/index.html")
                        .replace(/{{CONTENT}}/g, render("skins/add-ontology.html"))
                        .replace(/{{ONTOLOGY_CATEGORIES}}/g, ontologymodel.catsSelectHtml())
                        .replace(/{{UPLOAD_URL}}/g, UPLOAD_URL)
                        .replace(/{{VERSION}}/g, VERSION);
            response.getWriter().println(html);
        },
        post: function(request, response) {
            require("./blobstore.js");
            require("./termmodel.js");
            
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
            require("./blobstore.js");
            var blobKey = new BlobKey(request.getParameter("blob-key"));

            blobstore.blobstoreService.serve(blobKey, response);
        }
    },
    "/obo-upload" : {
        post: function(request, response) {
            require("./blobstore.js");
            require("./termmodel.js");
            require("./taskqueue.js");
            require("./public/js/jsonobo.js"); // also client uses this, SWEET!!!

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
            require("./blobstore.js");
            var uploadUrl = blobstore.createUploadUrl("/obo-upload");
            response.getWriter().println(uploadUrl);
        }
    },
    "/create-term": {
        post: function(request, response) {
            require("./termmodel.js");
            /*
            importPackage(java.util.logging);
            var logger = Logger.getLogger("org.whatever.Logtest");

            var jsonTerm = request.getParameter("jsonTerm");
            logger.info("== RAN TASK - JSON TERM: "+jsonTerm);
            */

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
            require("./blobstore.js");

            var oboBlobKey = new BlobKey(request.getParameter("oboBlobKey"));
            if(!oboBlobKey)
                return response.sendError(response.SC_BAD_REQUEST, "missing parameter");


        }
    },
    "/attribute-upload-url": {
        get: function(request, response) {
            require("./blobstore.js");
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
            require("./blobstore.js");
            require("./termmodel.js");

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

            if(!term_id || term_id == "" || !key || key == "")
                return err("Must complete all fields");

            if(blobKey)
                value = blobKey;

            if(!value || value == "")
                return err("Must complete all fields");


            // get this term from it's id
            var termKey = googlestore.createKey("term", term_id),
                termEntity = googlestore.get(termKey);

            // check if own this term
            var ontoKey = googlestore.createKey("ontology", termEntity.getProperty("ontology_id")),
                ontoEntity = googlestore.get(ontoKey);

            if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                return err("You don't have the permissions to edit this attribute");

            // set this property value
            termEntity.setProperty(key, (value instanceof BlobKey ? value : new Text(value)));
            googlestore.set(termEntity, {
                "normalized": termmodel.normalize(googlestore.toJS(termEntity))
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
    "/get-term-parents/([a-zA-Z0-9_\: \.]+)": {
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
            arr.push({
                id: ""+termEntity.getProperty("id"),
                name: ""+termEntity.getProperty("name")
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
    "/users": {
        get: function(request, response) {
            require("./usermodel.js");
            try {
                var users = googlestore.query("user").fetch();
                    
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
            require("./usermodel.js");
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
            var skin = render("skins/index.html")
                        .replace(/{{CONTENT}}/g, render("skins/feedback.html"))
                        .replace(/{{VERSION}}/g, VERSION);
            response.getWriter().println(skin);
        }
    }
};
