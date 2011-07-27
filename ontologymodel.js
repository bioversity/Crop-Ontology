var ontologymodel = (function() {

    var categories = [
        "010-089 General Germplasm Ontology Ontology",
        "090-099 Taxonomic Ontology",
        "100-299 Plant Anatomy & Development Ontology",
        "300-499 Phenotype and Trait Ontology Ontology",
        "500-699 Structural and Functional Genomic Ontology",
        "700-799 Location and Environmental Ontology",
        "800-899 General Science Ontology",
        "900-999 Other (Sub-domain or Site-Specific) Ontology"
    ];

    function catsSelectHtml() {
        var options = "<select name='category'>";
        for(var i=0; i<categories.length; i++) {
            options += "<option value='"+categories[i]+"'>"+categories[i]+"</option>";
        }
        options += "</select>";
        return options;
    }

    return {
        catsSelectHtml: catsSelectHtml
    };
})();
