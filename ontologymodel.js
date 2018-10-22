var ontologymodel = (function() {

	var categories = [
		"010-089 General Germplasm Ontology",
		"090-099 Taxonomic Ontology",
		"100-299 Plant Anatomy & Development Ontology",
		"300-499 Phenotype and Trait Ontology",
		"500-699 Structural and Functional Genomic Ontology",
		"700-799 Location and Environmental Ontology",
		"800-899 General Science Ontology",
		"900-999 Other (Sub-domain or Site-Specific) Ontology"
	];

	/**
	 * Get or create the ontology version number
	 * @param  string						ontologyId							The ontology ID
	 * @param  string 						backup_ontology_name				The backup ontology entity name
	 * @return integer															The ontology version number
	 */
	function getVersion(ontologyId, backup_ontology_name) {
		if(ontologyId == undefined || ontologyId == "") {
			return 1;
		} else {
			if(this.getById(ontologyId)) {
				var current_version = this.getById(ontologyId).getProperty(backup_ontology_name);
				if(current_version == undefined || current_version == null || current_version == "") {
					return 1;
				} else {
					return parseInt(current_version);
				}
			} else {
				return 1;
			}
		}
	}

	/**
	 * Save the current ontology version to a separate collection
	 * @param  string 						ontology_name						The target ontology entity name
	 * @param  string 						ontology_id							The target ontology ID
	 * @param  string 						backup_ontology_name				The backup ontology entity name
	 * @return integer															The ID incremented by 1
	 */
	function backup_previous_version(ontology_name, ontology_id, backup_ontology_name) {
		var ontology_backup_key = googlestore.createKey(ontology_name, ontology_id),
			ontology_version = this.getVersion(ontology_id, backup_ontology_name);
		if(ontology_backup_key) {
			var ontology_backup_entity = googlestore.get(ontology_backup_key),
				current_version = googlestore.entity(backup_ontology_name, googlestore.toJS(ontology_backup_entity));

			googlestore.put(current_version);
		}
		if(ontology_version >= 1) {
			ontology_version += 1;
		}
		return ontology_version;
	}

	function catsSelectHtml() {
		var options = "<select name='category'>";
		for(var i=0; i<categories.length; i++) {
			if(categories[i]=="300-499 Phenotype and Trait Ontology"){
				options += "<option value='" + categories[i] + "' selected>" + categories[i] + "</option>";
			} else {
				options += "<option value='" + categories[i] + "'>" + categories[i] + "</option>";
			}
		}
		options += "</select>";
		return options;
	}

	function create(currUser, ontologyId, ontologyName, ontologyVersion, ontologySummary, category, old_id, diff) {
		if(old_id == "undefined" || old_id == null) { old_id = ""; }
		if(diff == "undefined" || diff == null) { diff = ""; }

		// create the ontology
		var ontoEntity = googlestore.entity("ontology", ontologyId, {
			created_at: new java.util.Date(),
			user_key: currUser.getKey(),
			ontology_id: ontologyId,
			ontology_name: ontologyName,
			ontology_summary: ontologySummary,
			ontology_version: ontologyVersion,
			ontology_version_diff: diff,
			ontology_parent_version_ID: old_id,
			category: category
		});

		googlestore.put(ontoEntity);
		memcache.clearAll();
	}

	function getById(ontologyId, entityName) {
		if(entityName == "undefined" || entityName == null) { entityName = "ontology" }
		// check if this ontoId already exists
		try {
			var ontoKey = googlestore.createKey(entityName, ontologyId);
			var ontoEntity = googlestore.get(ontoKey);
			return ontoEntity;
		} catch (e) {
			// if we get here, ontology doesn't exist
			return false;
		}
	}

	/**
	 * Shortway to retrieve an Ontoloy data
	 *
	 * @param  string						entityName						The subject entity name
	 * @param  integer 						ontologyId						The subject entity ID
	 * @param  bool 						stringified						Return a stringified value? If yes return a stringified object, otherwise an object. Default is false
	 * @return string|object												The result could be a string or an object, depending on "stringified" passed parameter. Default is object
	 */
	function getOntology(entityName, ontologyId, stringified) {
		if(stringified == undefined || stringified == null) { stringified = false; }

		var ontoKey = googlestore.createKey(entityName, ontologyId);
		var ontoEntity = googlestore.get(ontoKey);
		if(ontoEntity && ontoEntity !== undefined) {
			var resultObj = googlestore.toJS(ontoEntity);
			return stringified ? JSON.stringify(resultObj) : resultObj;
		} else {
			return {"ontology_name": "", "ontology_summary": ""};
		}
	}

	function owns(currUser, ontoEntity) {
		if(ontoEntity.getProperty("user_key").equals(currUser.getKey())) {
			return true;
		} else {
			return false;
		}
	}

	return {
		getVersion: getVersion,
		backup_previous_version: backup_previous_version,
		catsSelectHtml: catsSelectHtml,
		create: create,
		getById: getById,
		getOntology: getOntology,
		owns: owns
	};
})();
exports = ontologymodel;
