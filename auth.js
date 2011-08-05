importPackage(javax.servlet.http);
/**
 * authentication system!!!
 */
var auth = (function(){

    /**
     * check if we're logged in
     * by looking inside the request for a "user" cookie token
     * and checking if it exists in the datastore.
     * if it exists, return the entire user-entity of that result,
     * otherwise return false
     */
    function getUser(request) {
        var cookies = request.getCookies();

        if(!cookies)
            return false;
        
        // find the user cookie
        var userCookie = false;
        for(var i=0; i<cookies.length; i++) {
            if(cookies[i].getName().equals("user")) {
                userCookie = cookies[i];
            }
        }

        if(!userCookie) // no user cookie found
            return false;

        // get the token (value of cookie)
        var token = userCookie.getValue();

        // make sure the token is not an empty string :)
        if(token.equals("") || !token)
            return false;

        // check if it exists in datastore
        var users = googlestore.query("user")
                    .filter("token", "=", token)
                    .fetch();


        if(!users.length) // doesn't exist
            return false;

        //if(q.length > 1) // what?!? more than 1 token, XXX logout
        
        // great we found it, return it!
        return users[0];
    }

    /**
     * username&password, generate token, store it in DB for this user
     * and add the "user" cookie
     */
    function login(response, username, hashedPassword) {
        var res = googlestore.query("user")
            .filter("username", "=", username)
            .filter("password", "=", hashedPassword)
            .fetch(1);

        if(!res.length) { // user not found 
            return false;
        } else {
            var userEntity = res[0],
                token = tokenGenerator();

            userEntity.setProperty("token", token);
            googlestore.put(userEntity);

            // add a cookie
            var cookie = new Cookie("user", token);
            // 30 years :)
            cookie.setMaxAge(30 * 365 * 24 * 60 * 60);
            response.addCookie(cookie);

            return true;
        }

    }
    function tokenGenerator() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 8; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function isAdmin(userEntity) {
        var admin = userEntity.getProperty("admin");
        if(admin && admin == true)
            return true;
        else
            return false;
    }

    return {
        getUser: getUser,
        login: login,
        isAdmin: isAdmin
    };

})();
