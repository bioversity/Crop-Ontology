var ontologymodel = require("./ontologymodel.js");

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

		//term.parent = term.parent || null; // important to track the roots

		//term.normalized = normalize(term); // important for search

		if(term.comment) {
			term.comment = new Text(term.comment);
		}
		if(term.def) {
			term.def = new Text(term.def);
		}
		// Backup current version
		term.term_version = ontologymodel.backup_previous_version("term", term.id, "term_versions");

		// XXX a bit hacky - make it faster
		for(var i in term) {
			if(term[i] != null && term[i].length && term[i].length > 400) {
				term[i] = new Text(term[i]);
			}
		}

		// create in datastore
		var termEntity;
		try {
			var termKey = googlestore.createKey("term", term.id);
			termEntity = googlestore.get(termKey);
			googlestore.set(termEntity, term);
		} catch (e) {
			// no entity foudn with this id, create it
			termEntity = googlestore.entity("term", term.id, term);
		}

		googlestore.put(termEntity);
		return term.term_version;
	}

	function translate(term, languages) {
		var ignore = {
			'parent': true,
			'relationship': true,
			'id': true,
			ontology_id: true,
			ontology_name: true,
			ontology_version: true,
			language: true
		}
		// find the entity
		var termStored = false;
		try {
			var termKey = googlestore.createKey("term", term.id),
				termEntity = googlestore.get(termKey);

			termStored = googlestore.toJS(termEntity);
		} catch(e) { // not found
			termStored = false;
		}

		// each value should be a JSON
		for(var i in term) {
			if(ignore[i]) continue;
			var obj = {}
			if(termStored && termStored[i]) { // fill obj, with info from termStored
				obj = termStored[i]
			}
			obj[languages.iso[term.language]] = term[i]

			term[i] = JSON.stringify(obj)
		}
		return term;
	}

	function findFreeId(ontologyId) {
		// find all terms with this ontology_id
		var terms = googlestore.query("term")
					.filter("ontology_id", "=", ontologyId)
					.filter('id', '>=', ontologyId + ':0')
					.filter('id', '<', ontologyId + ':0\ufffd')
					.sort('id', 'DESC')
					.limit(1)
					.fetch();

		var id = 0;
		if(terms.length) {
			id = terms[0].getProperty('id');
			id = id.split(':');
			if(id.length > 1)
				id = id[1];
			else
				id = id[0];

			id = parseInt(id, 10);
			id++;
		}

		return id;
	}

	return {
		createTerm: createTerm,
		normalize: normalize,
		translate: translate,
		findFreeId: findFreeId
	};

})();
exports = termmodel;
