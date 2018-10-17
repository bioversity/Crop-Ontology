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
	 * @return integer															The ontology version number
	 */
	function getVersion(ontologyId) {
		if(ontologyId == undefined || ontologyId == "") {
			return 1;
		} else {
			var current_version = this.getById(ontologyId).getProperty("ontology_version");
			if(current_version == undefined || current_version == "") {
				return 1;
			} else {
				return parseInt(current_version);
			}
		}
	}

    function catsSelectHtml() {
        var options = "<select name='category'>";
        for(var i=0; i<categories.length; i++) {
			if(categories[i]=="300-499 Phenotype and Trait Ontology"){
				options += "<option value='"+categories[i]+"' selected>"+categories[i]+"</option>";
			} else {
				options += "<option value='"+categories[i]+"'>"+categories[i]+"</option>";
			}
        }
        options += "</select>";
        return options;
    }

    function create(currUser, ontologyId, ontologyName, ontologyVersion, ontologySummary, category) {
        // create the ontology
        var ontoEntity = googlestore.entity("ontology", ontologyId, {
            created_at: new java.util.Date(),
            user_key: currUser.getKey(),
            ontology_id: ontologyId,
            ontology_name: ontologyName,
            ontology_version: ontologyVersion,
            ontology_summary: ontologySummary,
            category: category
        });

        googlestore.put(ontoEntity);
        memcache.clearAll();
    }

    function getById(ontologyId) {
        // check if this ontoId already exists
        try {
            var ontoKey = googlestore.createKey("ontology", ontologyId);
            var ontoEntity = googlestore.get(ontoKey);
            return ontoEntity;
        } catch (e) {
            // if we get here, ontology doesn't exist
            return false;
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
        catsSelectHtml: catsSelectHtml,
        create: create,
        getById: getById,
        owns: owns
    };
})();
exports = ontologymodel;
