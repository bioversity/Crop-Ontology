function err(msg) {
    var $error = $("#error");

    $error.show();
    $error.text(msg);

    /*
    setTimeout(function(){
        $error.fadeOut();
    }, 3000);
    */
}

function getTerm() {
    var $term = $("#term_tmpl");

    var $clone = $term.clone();

    $clone.get(0).id = "";
    $clone.attr("id", "");

    return $clone;
}


function insertTerm(parentLi, term) {
    term.show();

    parentLi.append(term);
}
function removeTerm(parentUl) {
    parentUl.remove();
}

/**
 * Gets parameters from the state of the heirarchy in the UI
 * in form of plain JSON
 *
 * $cont is an UL element
 */
var counter = 0,
    ontoId;
function getPars(o, $cont, parent) {
    var term = {};
    if($cont.attr("id") != "cont") { // we dont want to save the root
        var name = $cont.find("input[name=name]:first").val();

        term = {
            id: ontoId+":"+counter++,
            name: name,
            parent: parent
        };

        o.push(term);
    }

    // children() returns only the top most elements
    $cont.find("li:first").children("ul").each(function(){
        getPars(o, $(this), term.id || null);
    });

}

/**
 * binds events for the tree layout adding system
 */
var bindEvents = function() {
    var $cont = $("#cont");

	/**
	 * Set the new ontology version
	 */
	$("#ontology_id_et").blur(function(e) {
		$.getJSON("./get-ontology-roots/" + $(this).val(), function(data) {
			$("#ontology_version_et").val(data[0].ontology_version + 1);
		})
	});
	$("#ontology_id_co").blur(function(e) {
		$.getJSON("./get-ontology-roots/" + $(this).val(), function(data) {
			$("#ontology_version_co").val(data[0].ontology_version + 1);
		})
	});

    // for each "plus" elements bind a click event
    // that triggers the addition of a child DOM element
    $cont.find("li a.add").live("click", function(e){
        var $this = $(this),
            $parentLi = $this.parent();

        // get the ul term DOM element
        var term = getTerm();

        insertTerm($parentLi, term);

        e.preventDefault();
        e.stopPropagation();
    });
    $cont.find("li a.remove").live("click", function(e){
        // alert
        if(!confirm("Are you sure you want to remove this term and all its children?")) return;
        var $parentUl = $(this).parent().parent();
        removeTerm($parentUl);

        e.preventDefault();
        e.stopPropagation();
    });

    // save the "state" of the ontology
    $("#save").click(function(e){
        ontoId = $("#ontology_id").val();
        counter = 0;
        var ret = [];
        getPars(ret, $("#cont"));

        // we need to obey the API which is a list of objects.
        // the tree is given by referencing each id
        // so the developer needs to give us IDs for us to know about
        // relation logic
        var pars = {
            ontology_name: $("#ontology_name").val(),
            ontology_id: $("#ontology_id").val(),
            ontology_summary: $("#ontology_summary").val(),
            category: $("#create_ontology_cont select[name=category]").val(),
            json: JSON.stringify(ret)
        };

        if(!pars.ontology_name || !pars.ontology_id)
            return err("Must insert the name of ontology and its ID");

        var $this = $(this);
        $this.hide();
        $.post("/add-ontology", pars, function(data) {

            $this.show();

            window.location.href = "/";

        }).error(function(e) {
            var responseText = $(e.responseText).eq(0).text();
            err(responseText);
            $this.show();
        });

        e.preventDefault();
        e.stopPropagation();
    });



    $("[target=obo_upload_iframe], [target=excel_upload_iframe]").submit(function() {

        var $this = $(this);

        var submitBtn = $this.find("[type=submit]");
        submitBtn.hide();

    });
};


/**
 * Main entry
 */
$(function() {
    bindEvents();

});

// for obo upload errors
var fileupload_done = function(error) {
    var form = $("form[target=obo_upload_iframe]"),
        excel_form = $("form[target=excel_upload_iframe]");

    if(error) {
        err(error);
        $.get("/obo-upload-url", function(url) {
            form.attr("action", url);

            form.find("[type=submit]").show();
        });
        $.get("/excel-upload-url", function(url) {
            excel_form.attr("action", url);

            excel_form.find("[type=submit]").show();
        });
    } else {
        window.location = "/";
    }
};
