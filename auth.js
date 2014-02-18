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
        return apejs.session.getAttribute('user');
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
