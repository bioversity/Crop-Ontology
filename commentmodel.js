var commentmodel = {
    getCommentsByOnto: function(ontoId) {
        var comments = googlestore.query("comment")
                        .filter("ontology_id", "=", ontoId)
                        .sort("created", "DESC")
                        .fetch();
        
        var ret = [];

        comments.forEach(function(comment) {
            var c = googlestore.toJS(comment);
            // need the author in clean text
            var userKey = comment.getProperty("userKey"),
                userEntity = googlestore.get(userKey);

            c.author = ""+userEntity.getProperty("username");

            // keep the date as JAVA date!
            c.created = comment.getProperty("created");

            ret.push(c);
        });

        return ret;
    }
};
