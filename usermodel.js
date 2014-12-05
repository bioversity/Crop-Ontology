importPackage(java.lang);

var usermodel = {
    emailExists: function(email) {
        var result = googlestore.query("user")
            .filter("email", "=", email)
            .fetch(1);
        if(result.length)
            return true;
        else 
            return false;
    },
    usernameExists: function(username) {
        var result = googlestore.query("user")
            .filter("username", "=", username)
            .fetch(1);
        if(result.length)
            return true;
        else 
            return false;
    },
    validUsername: function(username) {
        var re = /^(?=.{4})(?!.{21})[\w.-]*[a-z][\w-.]*$/i;
        return username.match(re);
    },
    validateEmail: function(email){ 
         var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return email.match(re);
    },
    // makes a sha1 string out of a string
    sha1: function(text) {
        function bytesToHex(b) {
            var hexDigit = ['0', '1', '2', '3', '4', '5', '6', '7',
                         '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            var buf = new StringBuffer();
            for (var j=0; j<b.length; j++) {
                buf.append(hexDigit[(b[j] >> 4) & 0x0f]);
                buf.append(hexDigit[b[j] & 0x0f]);
            }
            return buf.toString();
        }
        var md = java.security.MessageDigest.getInstance("SHA-1");
        md.update(text.getBytes("iso-8859-1"), 0, text.length());
        var sha1hash = md.digest();
        return bytesToHex(sha1hash);
    },
    hideEmail: function(email) {
        return email.split("@")[0];
    },

    // makes a md5 string out of a string
    md5: function(text) {
        function bytesToHex(b) {
            var hexDigit = ['0', '1', '2', '3', '4', '5', '6', '7',
                         '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            var buf = new StringBuffer();
            for (var j=0; j<b.length; j++) {
                buf.append(hexDigit[(b[j] >> 4) & 0x0f]);
                buf.append(hexDigit[b[j] & 0x0f]);
            }
            return buf.toString();
        }
        var md = java.security.MessageDigest.getInstance("MD5");
        md.update(text.getBytes("iso-8859-1"), 0, text.length());
        var hash = md.digest();
        return bytesToHex(hash).toLowerCase();
    },

    /**
     * takse care of outputting the user entity as a JS object
     * and making sure password and other fields are not show
     */
    out: function(u) {
        var props = [
            "username", 
            "created", 
            "email"
        ];


        var ret = {};

        // do gravatar
        ret["gravatar"] = ""+usermodel.md5(u.getProperty("email").trim().toLowerCase());

        for(var i=0; i<props.length; i++) {
            var value = u.getProperty(props[i]);

            if(value instanceof Text)
                value = value.getValue();

            if(value == null) value = "";

            ret[props[i]] = ""+value;
        }

        // hide email
        ret["email"] = usermodel.hideEmail(ret["email"]);

        // also we want the id
        ret["userid"] = ""+u.getKey().getId();

        ret["key"] = ""+KeyFactory.keyToString(u.getKey());

        return ret;

    },
    /**
     * modified from "out"
     * outputs users' properties for editing by the user
     */
    outEdit: function(u) {
        var props = [
            "name", 
            "surname", 
            "username", 
            "institution", 
            "created", 
            "email"
        ];

        var ret = {};

//        // do gravatar
//        ret["gravatar"] = ""+usermodel.md5(u.getProperty("email").trim().toLowerCase());

        for(var i=0; i<props.length; i++) {
            var value = u.getProperty(props[i]);

            if(value instanceof Text)
                value = value.getValue();

            if(value == null) value = "";

            ret[props[i]] = ""+value;
        }

//        // hide email
//        ret["email"] = usermodel.hideEmail(ret["email"]);

        // also we want the id
        ret["userid"] = ""+u.getKey().getId();
	
	return ret;
	}

};
exports = usermodel;
