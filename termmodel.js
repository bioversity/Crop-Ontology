var termmodel = (function(){


    function splitter(value) {
        return value.split(/\s*[ ,;]\s*/);
    }

    /**
     * take a JS object representation of a term
     * and figures out what needs to be normalized
     */
    function normalize(term) {
      var arr = [];
      for(var i in term) {
        // normalize everything!
        var value = term[i];
        if(value instanceof Object) {
          // it's an object, loop through these values as well
          var a = normalize(value);
          a.forEach(function(el) {
            arr.push(el);
          });
        }
        value = ""+value; // JS string
        // ok for each value we must trim() it and lowercase() it
        value = value.trim().toLowerCase();
        // then we must split it by space, comma and other things
        var words = splitter(value);

        for(var x=0; x<words.length; x++) {
          // add each word to our main array
          arr.push(words[x]);
        }
      }
      return arr;
    }

    /**
     * Create a new term
     * term is a JS object from the API
     */
    function createTerm(term) {
        term.created_at = new java.util.Date();
        if(!term.ontology_id || !term.ontology_name)
            throw new Error("Missing references to ontology");

        term.parent = term.parent || null; // important to track the roots

        term.normalized = normalize(term); // important for search

        if(term.comment)
            term.comment = new Text(term.comment);
        if(term.def)
            term.def = new Text(term.def);

        // XXX a bit hacky - make it faster
        for(var i in term) {
            if(term[i] != null && (typeof term[i] === "string") && term[i].length > 490)
                term[i] = new Text(term[i]);
        }

        var termEntity = googlestore.entity("term", term.id, term);

        googlestore.put(termEntity);
    }

    return {
        createTerm: createTerm,
        normalize: normalize
    };

})();
exports = termmodel;
