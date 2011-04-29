require("apejs.js");
require("googlestore.js");


apejs.urls = {
    "/": {
        get: function(request, response) {
            var skin = render("skins/index.html");
            response.getWriter().println(skin);
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
