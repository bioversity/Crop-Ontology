/**
 * Takes an OBO file and creates JSON out of it
 * and also takes a JSON and makes OBO out of it
 */

var jsonobo = (function(){

    var startsWith = function(orig, str){
        return (orig.indexOf(str) === 0);
    };

    function splitter(oboString) {
        // remove all the \r from obostring
        // so we only worry about \n when parsing
        var tempString = ""+oboString,
            tempString = tempString.replace(/\r/g, ""); 
        return tempString.split("\n\n");
    }

    /**
     * takes a string like "id: something"
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

            // if this key exists already, make it an array and push into it
            if(term[keyVal.key]) {
                // start the array only if it's not an array
                if(!(term[keyVal.key] instanceof Array)) {
                    term[keyVal.key] = [term[keyVal.key]]; // start array put in what was there before
                }

                term[keyVal.key].push(keyVal.value);
            } else { // otherwise just add it as an object property
                term[keyVal.key] = keyVal.value;
            }
        }
        return term;
    }

    /**
     * figures out which relationship this term has
     * whether it's is_a or part_of etc
     */
    var rel = function(term) {

        function hasRelationship() {
            if(term.is_a || term.relationship)
                return true;
            else
                return false;
        }

        function getIds() {
            // look in the term object for the key
            // "is_a" or "relationship" as they're the only 2
            // keys that define a relationship
            var ids = [];

            // find all the is_a ids
            if(term.is_a) {
                if(term.is_a instanceof Array) {
                    var arr = term.is_a;
                    for(var i=0,len=arr.length; i<len; i++) {
                        var s = arr[i].split(" ! ");
                        ids.push(s[0]);
                    }
                } else {
                    var s = term.is_a.split(" ! ");
                    ids.push(s[0]);
                }
            }


            // find all ids with other relationship
            //
            // XXX keep track of what type of relation is "part_of" etc
            if(term.relationship) {
                if(term.relationship instanceof Array) {
                    var arr = term.relationship;
                    for(var i=0,len=arr.length; i<len; i++) {
                        var s = arr[i].split(" ! ");
                        var type = s[0].split(" "); // hope "space" is enough
                        // XXX type[0] is the type of relationship, store it somewhere
                        ids.push(type[1]);
                    }
                } else {
                    var s = term.relationship.split(" ! ");
                    var type = s[0].split(" "); // hope "space" is enough
                    // XXX type[0] is the type of relationship, store it somewhere
                    ids.push(type[1]);
                }

            }
            
            
            return ids;
        }

        function findMatch(ids, currTerm) {
            for(var x=0, len=ids.length; x<len; x++) {
                if(ids[x] == currTerm.id) {
                    return true;
                }
            }
            return false;
        }

        return {
            hasRelationship: hasRelationship,
            getIds: getIds,
            findMatch: findMatch
        };
    };

    /**
     * Finds children of currTerm in recursion.
     * so it traverses the entire terms array 
     * to find a term with "is_a" or "relationship" the same as "id" of currTerm.
     * being recursive, currTerm changes based on which level of the 
     * tree we're at. (i know a bit complicated, just read code to understand)
     */
    function findChildren(terms, currTerm) {
        currTerm.children = [];
        for(var i=0, len=terms.length; i<len; i++) {
            var term = terms[i];

            var r = rel(term);
            if(r.hasRelationship()) { // there's a parent

                // loop through all the relationship ids
                // and see if they match this currTerm id
                var ids = r.getIds();
                if(r.findMatch(ids, currTerm)) {
                    currTerm.children.push(term); // push makes a copy (i think)

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

    //////// NEW CODE
    function isEmpty(line) {
        if(!line || line == "" || line == null)
            return true;

        return false;
    }

    var termRec = false,
        currTerm = {};
    function findTerm(line, func) {
        // if term recording is on
        // and the current line is empty, then
        // we found a *complete* term
        if(termRec && isEmpty(line))
            func(currTerm);

        // if the line is empty, turn term recording OFF
        if(isEmpty(line))
            termRec = false;

        if(termRec) {
            var keyVal = getKeyValue(line);
            // if this key exists already, make it an array and push into it
            if(currTerm[keyVal.key]) {
                // start the array only if it's not an array
                if(!(currTerm[keyVal.key] instanceof Array)) {
                    currTerm[keyVal.key] = [currTerm[keyVal.key]]; // start array put in what was there before
                }

                currTerm[keyVal.key].push(keyVal.value);
            } else { // otherwise just add it as an object property
                currTerm[keyVal.key] = keyVal.value;
            }

            // find out parent
            var r = rel(currTerm);
            if(r.hasRelationship()) {
                currTerm["parent"] = r.getIds();
            }
        }

        if(startsWith(line, "[Term]")) { // term recording ON
            termRec = true;
            currTerm = {}; // restart the object
        }
    }

    return {
        obotojson: obotojson,
        findTerm: findTerm
    };

})();
if(exports) {
  exports = jsonobo;
}
