/**
 * authentication system!!!
 */
var auth = (function(){

    function getUser(request) {
        var session = request.getSession(true);
        var userKey = session.getAttribute("userKey");
        if(!userKey) {
            return false;
        } else {
            return googlestore.get(userKey);
        }
    }

    return {
        getUser: getUser
    };

})();
