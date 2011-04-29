require("apejs.js");
require("googlestore.js");


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
            q.queryFilter("term_id", "=", term_id);
            var res = q.result();

            var json = "[";
            for(var i=0; i<res.length; i++) {
                if(i != 0)
                    json += ",";
                json += "{ \"key\":\""+res[i].getKey().getName().replace("\"","\\\"") + "\", \"value\":\""+res[i].getProperty("value").getValue().replace("\"","\\\"") + "\"} ";
            }
            json += "]";
            response.getWriter().println(json);
        }
    },
    "/add-attribute": {
        post: function(request, response) {
            function err(msg) { response.getWriter().println(msg); }

            var key = request.getParameter("key"),
                value = request.getParameter("value"),
                term_id = request.getParameter("term_id");
            if(key == "" || value == "" || term_id == "") return err("Must complete all fields");

            var attribute = googlestore.entity("attribute", key, {
                value: new Text(value),
                term_id: term_id
            });
            googlestore.datastore.put(attribute);

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
