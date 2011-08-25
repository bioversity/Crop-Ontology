var commentmodel = {
    getCommentsByOnto: function(ontoId) {
        var comments = googlestore.query("comment")
                        .filter("ontology_id", "=", ontoId)
                        .sort("created", "DESC")
                        .fetch();
        
        var ret = [];

        comments.forEach(function(comment) {
            var c = googlestore.toJS(comment),
                username = null;

            try {
                // need the author in clean text
                var userKey = comment.getProperty("userKey"),
                    userEntity = googlestore.get(userKey);

                username = userEntity.getProperty("username");
            } catch(e) {
            }

            c.author = ""+username;

            // keep the date as JAVA date!
            c.created = comment.getProperty("created");

            ret.push(c);
        });

        return ret;
    }
};
