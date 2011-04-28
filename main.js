require("apejs.js");
require("googlestore.js");


apejs.urls = {
    "/": {
        get: function(request, response) {
            var skin = render("skins/index.html");
            response.getWriter().println(skin);
        }
    }
};
