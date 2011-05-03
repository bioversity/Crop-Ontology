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
                json += "{ \"key\":\""+res[i].getProperty("key").replace("\"","\\\"") + "\", \"value\":\""+res[i].getProperty("value").getValue().replace("\"","\\\"") + "\"} ";
            }
            json += "]";
            response.getWriter().println(json);
        }
    },
    "/add-attribute": {
        post: function(request, response) {
            function err(msg) { response.getWriter().println(msg); }
            // get the multipart form data from the request
            var data = fileupload.getData(request);

            for(var i=0; i<data.length; i++) {
                var fieldName = data[i].fieldName,
                    fieldValue = data[i].fieldValue,
                    isFile = data[i].file;

                if(isFile) {
                    //err("Got file with name: "+fieldName+"<br>");
                } else {
                    //err("Got form-field. "+fieldName+": "+fieldValue+"<br>");
                }

            }
            err("<script>window.top.fileupload_done();</script>");
            return;
        

            return err(request.getParameter("value") + " - " +request.getParameter("image"));

            var key = request.getParameter("key"),
                value = request.getParameter("value"),
                term_id = request.getParameter("term_id");
            if(key == "" || value == "" || term_id == "") return err("Must complete all fields");

            // the key is just key_GO:0000
            var attribute = googlestore.entity("attribute", key+"_"+term_id, {
                key: key,
                value: new Text(value),
                term_id: term_id
            });
            googlestore.put(attribute);

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
    }
};
