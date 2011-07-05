/**
 * Takes an OBO file and creates JSON out of it
 * and also takes a JSON and makes OBO out of it
 */

var jsonobo = (function(){

    var startsWith = function(orig, str){
        return (orig.indexOf(str) === 0);
    };

    function splitter(oboString) {
        return oboString.split("\n\n");
    }

    /**
     * takse a string like "id: something"
     * and returns {key:"id", value: "something"}
     */
    function getKeyValue(str) {
        var key = str.split(":")[0];

        var value = str.replace(key+":", "").trim();
        return {
            key: ""+key,
            value: ""+value
        }
    }

    function makeTerm(section) {
        var props = section.split("\n"),
            term = {};

        // start from 1 to skip the header [Term]
        for(var i=1,len=props.length; i<len; i++) {
            var keyVal = getKeyValue(props[i]);
            term[keyVal.key] = keyVal.value;
        }
        return term;
    }

    /**
     * recursion!!!
     */
    function findChildren(terms, currTerm) {
        currTerm.children = [];
        for(var i=0, len=terms.length; i<len; i++) {
            var term = terms[i];

            // XXX we need to take care of other relations, not only is_a
            if(term.is_a) { // there's a parent
                var s = term.is_a.split(" ! "),
                    parent_id = s[0],
                    parent_name = s[1];

                if(parent_id == currTerm.id) { // this term we found has parent_id the same
                                            // so it's a child of the currTerm
                    currTerm.children.push(term);

                    // run the function again to find children for this child term
                    findChildren(terms, term);
                }
            }

        }
    }

    /**
     * makes a JSON tree out of ordinary array of obo terms
     */
    function makeTree(terms) {
        var res = [];

        // find all the terms that have is_a as this id (or any other relation) .
        // start from root
        res.push(terms[0]);

        findChildren(terms, res[0]);

        return res;

    }

    function obotojson(oboString) {
        var sections = splitter(oboString);

        var header = sections[0];

        // start from 1 to skip the header
        var terms = [];
        for(var i=1, len=sections.length; i<len; i++) {
            var sec = sections[i];

            if(startsWith(sec, "[Term]")) { // it's a term
                terms.push(makeTerm(sec));
            }
        }

        var obj = makeTree(terms);
        return obj;
    }


    return {
        obotojson: obotojson
    };

})();
