require("apejs.js");
require("googlestore.js");

require("./fileupload.js");
require("./usermodel.js");
require("./auth.js");
require("./log.js");

var VERSION = "0.1.3";

var print = function(response) {
    return {
        json: function(j) {
            response.getWriter().println(JSON.stringify(j));
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
                        .replace(/{{VERSION}}/g, VERSION);
            response.getWriter().println(skin);
            
        }
    },
    "/ontologies": {
        get: function(request, response) {
            var ontologies = googlestore.query("ontology")
                    .fetch();

            var res = [];
            ontologies.forEach(function(onto){

                var username = "";
                if(onto.getProperty("user_key")) {
                    username = googlestore.get(onto.getProperty("user_key")).getProperty("username"); 
                }
                res.push({
                    ontology_id: ""+onto.getProperty("ontology_id"),
                    ontology_name: ""+onto.getProperty("ontology_name"),
                    ontology_summary: ""+onto.getProperty("ontology_summary"),
                    username: ""+username
                });
            });

            response.getWriter().println(JSON.stringify(res));
            
        }
    },
    "/ontology/([a-zA-Z0-9_\: ]+)": {
        get: function(request, response, matches) {
            var skin = render("skins/index.html")
                    .replace(/{{CONTENT}}/g, render("skins/onto.html"))
                    .replace(/{{VERSION}}/g, VERSION)
                    .replace(/{{ontologyid}}/g, matches[1]);
            response.getWriter().println(skin);
        }
    },
    "/get-ontology/([a-zA-Z0-9_\: ]+)": {
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
    "/get-ontology-roots/([a-zA-Z0-9_\: ]+)": {
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
    "/get-children/([a-zA-Z0-9_\: ]+)": {
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

                    ret.push({
                        "id": ""+term.getProperty("id"),
                        "name": ""+term.getProperty("name"),
                        "has_children": q.length
                    });
                });

                response.getWriter().println(JSON.stringify(ret));
            } catch (e) {
                response.sendError(response.SC_BAD_REQUEST, e);
            }
        }
    },
    "/get-attributes/([a-zA-Z0-9_\: ]+)": {
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
            function err(msg) { response.getWriter().println('<script>window.top.fileupload_done("'+msg+'");</script>'); }
            // only if logged in
            var session = request.getSession(true);
            var userKey = session.getAttribute("userKey");
            if(!userKey) {
                return err("Not logged in");
            }

            var key = request.getParameter("key"),
                term_id = request.getParameter("term_id");
            if(key == "" || term_id == "")
                return;

            var k = googlestore.createKey("attribute", key + "_" + term_id);
            googlestore.del(k);
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
    "/terms/([a-zA-Z0-9_\: ]+)/(.*)" : {
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
            var ret = [];

            if(!q || q == "") return print(response).json(ret);

            q = q.toLowerCase();

            var searchField = "normalized";
            var terms = googlestore.query("term")
                            .filter(searchField, ">=", q)
                            .filter(searchField, "<", q + "\ufffd")
                            .fetch();
            terms.forEach(function(t) {
                ret.push(googlestore.toJS(t));
            });
            
            return print(response).json(ret);
        }
    },
    "/login" : {
        get: function(request, response) {
            // find user with this key and return its data
            var user = auth.getUser(request),
                username = "";
            if(user)
                username = user.getProperty("username");
            response.getWriter().println('{"username":"'+username+'"}');
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
            var session = request.getSession(true);
            var userKey = session.getAttribute("userKey");
            if(!userKey) {
                response.sendError(response.SC_FORBIDDEN);
                return;
            }
            var termId = request.getParameter("termId"),
                comment = request.getParameter("comment");

            if(!comment || comment == "" || !termId || termId == "") {
                response.sendError(response.SC_BAD_REQUEST, "missing paramaters");
                return;
            }

            var comment = googlestore.entity("comment", {
                termId: termId,
                userKey: userKey,
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
                    ret.push({
                        "created": ""+comment.getProperty("created"),
                        "author": ""+googlestore.get(comment.getProperty("userKey")).getProperty("username"),
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
            var UPLOAD_URL = blobstore.createUploadUrl("/obo-upload");
            var html = render("./skins/index.html")
                        .replace(/{{CONTENT}}/g, render("skins/add-ontology.html"))
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
                    ontology_summary: ontologySummary
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

                // check that we own this ontology
                if(!ontoEntity.getProperty("user_key").equals(currUser.getKey()))
                    return response.sendError(response.SC_BAD_REQUEST, "you can't edit this ontology");


                // now edit it
                var ontologyName = request.getParameter("ontology_name"),
                    ontologySummary = request.getParameter("ontology_summary");

                if(!ontologyName || ontologyName == "" || !ontologySummary || ontologySummary == "")
                    return response.sendError(response.SC_BAD_REQUEST, "missing parameters");

                googlestore.set(ontoEntity, {
                    ontology_name: ontologyName,
                    ontology_summary: ontologySummary
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

            var currUser = auth.getUser(request);
            if(!currUser)
                return response.sendError(response.SC_BAD_REQUEST, "not logged in");

            var blobs = blobstore.blobstoreService.getUploadedBlobs(request),
                oboBlobKey = blobs.get("obofile");

            if(oboBlobKey == null) {
                return response.sendError(response.SC_BAD_REQUEST, "missing parameter");
            }
            try {
                var ontologyName = request.getParameter("ontology_name"),
                    ontologyId = request.getParameter("ontology_id"),
                    ontologySummary = request.getParameter("ontology_summary");

                if(!ontologyName || ontologyName == "" || !ontologyId || ontologyId == "" || !ontologySummary || ontologySummary == "")
                    return response.sendError(response.SC_BAD_REQUEST, "missing parameter");

                // first create ontology
                var ontoEntity = googlestore.entity("ontology", ontologyId, {
                    created_at: new java.util.Date(),
                    user_key: currUser.getKey(),
                    ontology_id: ontologyId,
                    ontology_name: ontologyName,
                    ontology_summary: ontologySummary
                });

                googlestore.put(ontoEntity);


                // let's use BlobstoreInputStream to read more than 1mb at a time.
                // we read and parse line by line because we don't want to allocate
                // memory - keeping it light
                var oboBlobKeyString = ""+oboBlobKey.getKeyString(),
                    ontologyIdString = ""+ontologyId,
                    ontologyNameString = ""+ontologyName;

                blobstore.readLine(oboBlobKey, function(line) {
                    // the callback is called when a complete Term is found
                    jsonobo.findTerm(line, function(term) {
                        // need a reference to the obo we just created
                        term.obo_blob_key = oboBlobKeyString;
                        // also need reference to the ontology
                        term.ontology_id = ontologyIdString;
                        term.ontology_name = ontologyNameString;

                        // we found a term, let's save it in datastore.
                        // XXX, the .put() in here is expensive - takes more than 30secs
                        // spawn a Task or something else
                        // pass the data as a JSON string
                        taskqueue.createTask("/create-term", JSON.stringify(term));
                    });
                });


                response.sendRedirect("/");
            } catch(e) {
                return response.sendError(response.SC_BAD_REQUEST, e);
            }

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
            
            var ontos = googlestore.query("ontology")
                            .filter("user_key", "=", currUser.getKey())
                            .fetch();

            var ret = [];
            ontos.forEach(function(onto) {
                ret.push({
                    ontology_id: ""+onto.getProperty("ontology_id"),
                    ontology_name: ""+onto.getProperty("ontology_name"),
                    ontology_summary: ""+onto.getProperty("ontology_summary")
                });
            });

            response.getWriter().println(JSON.stringify(ret));

        }
    },
    "/get-term-parents/([a-zA-Z0-9_\: ]+)": {
        get: function(request, response, matches) {
            function getParent(arr, termId) {
                var termKey = googlestore.createKey("term", termId),
                    termEntity = googlestore.get(termKey);
                
                // XXX default to first in array - so not showing if has many parents
                var parentArr = termEntity.getProperty("parent"),
                    parentId = parentArr ? ""+parentArr.get(0) : false;

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
    }
};
