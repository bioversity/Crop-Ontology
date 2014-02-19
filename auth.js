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
    function getUser() {
        var userInSession = apejs.session.getAttribute('user');
        if(userInSession) {
            return userInSession;
        } else { // let's use the remember-me cookie to get user from db
            var cookies = apejs.cookies;

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

            var t = token.split(':');
            var username = t[0];
            var hashedPassword = t[1];

            // check if it exists in datastore
            var arr = sparql.query('select * where { ?s a foaf:Person; cov:username ?username; cov:password ?password. FILTER(?username = '+JSON.stringify(''+username)+' && ?password = '+JSON.stringify(''+hashedPassword)+')}')

            if(!arr.length) // doesn't exist
                return false;

            apejs.session.setAttribute('user', arr[0]);

            return arr[0];
        }
    }

    /**
     * username&password, generate token, store it in DB for this user
     * and add the "user" cookie
     */
    function login(response, username, hashedPassword) {
        var arr = sparql.query('select * where { ?s a foaf:Person; cov:username ?username; cov:password ?password. FILTER(?username = '+JSON.stringify(''+username)+' && ?password = '+JSON.stringify(''+hashedPassword)+')}')

        if(!arr.length) { // user not found 
            return false;
        } else {
            apejs.session.setAttribute('user', arr[0]);

            // add a cookie
            var cookie = new Cookie("user", username + ':' + hashedPassword);
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

    function getLanguage(userEntity) {
      if(!userEntity) return false;
      var language = userEntity.getProperty("language");
      return language;
    }

    return {
        getUser: getUser,
        login: login,
        isAdmin: isAdmin,
        getLanguage: getLanguage
    };

})();

exports = auth;
