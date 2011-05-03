require("apejs.js");
require("googlestore.js");
require("./fileupload.js");


apejs.urls = {
    "/": {
        get: function(request, response) {
            var skin = render("skins/index.html");
            response.getWriter().println(skin);
        }
    },
    "/get-attribute": {
        get: function(request, response) {
            var term_id = request.getParameter("term_id");
            if(!term_id) return response.getWriter().println("No term_id");

            var q = googlestore.query("attribute");
            q.addFilter("term_id", "=", term_id);
            var res = q.fetch(50);

            var json = "[";
            for(var i=0; i<res.length; i++) {
                if(i != 0)
                    json += ",";

                var value = res[i].getProperty("value");
                if(value instanceof Blob)
                    value = "<a target='_blank' href='/serve/"+res[i].getKey().getName()+".png'><img src='/serve/"+res[i].getKey().getName()+".png' /></a>";
                else
                    value = value.getValue();

                json += "{ \"key\":\""+res[i].getProperty("key").replace("\"","\\\"") + "\", \"value\":\""+value.replace("\"","\\\"") + "\"} ";
            }
            json += "]";
            response.getWriter().println(json);
        }
    },
    "/add-attribute": {
        post: function(request, response) {
            function err(msg) { response.getWriter().println(msg); }
            // get the multipart form data from the request

            var key = "", value = "", term_id = "";
            var data = fileupload.getData(request);

            for(var i=0; i<data.length; i++) {
                var fieldName = data[i].fieldName,
                    fieldValue = data[i].fieldValue,
                    isFile = data[i].file;

                if(isFile) {
                    //err("Got file with name: "+fieldName+"<br>");
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

            // the key is just key_GO:0000
            var attribute = googlestore.entity("attribute", key+"_"+term_id, {
                key: key,
                value: (value instanceof Blob ? value : new Text(value)),
                term_id: term_id
            });
            googlestore.put(attribute);

            err("<script>window.top.fileupload_done();</script>");

        }
    },
    "/remove-attribute": {
        post: function(request, response) {
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
            var url = request.getParameter("url");
            var ret = httpget(url);
            response.setContentType("text/xml");
            response.getWriter().println(ret);
        }
    },
    "/serve/([a-zA-Z0-9_\: ]+).png" : {
        get: function(request, response, matches) {
            response.setHeader("Cache-Control", "max-age=315360000");
            response.setContentType("image/png");

            var keyName = matches[1],
                // create key from the user id
                attrKey = googlestore.createKey("attribute", keyName),
                attr = googlestore.get(attrKey);

            var imageBlob = attr.getProperty("value"),
                imageBytes = imageBlob.getBytes();

            response.getOutputStream().write(imageBytes);

        }
    }
};
