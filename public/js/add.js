function err(msg) {
    var $error = $("#error");

    $error.show(); 
    $error.text(msg);

    setTimeout(function(){
        $error.fadeOut();
    }, 3000);
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
function getPars(o, $cont) {
    var name = $cont.find("input[name=name]:first").val();

    var term = {
        id: name,
        name: name,
        relation_name: "is_a",

        children: []
    };
    
    o.push(term);

    // children() returns only the top most elements
    $cont.find("li:first").children("ul").each(function(){
        getPars(term.children, $(this)); 
    });

}

/**
 * binds events for the tree layout adding system
 */
var bindEvents = function() {
    var $cont = $("#cont");

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
        var ret = [];
        getPars(ret, $("#cont"));

        var $this = $(this);
        $this.hide();
        $.post("/add-ontology", {json: JSON.stringify(ret)}, function(data) {

            $this.show();

            window.location.href = "/";

        }).error(function(e) {
            err("Something went wrong. Retry!");
            $this.show();
        });
        
        e.preventDefault();
        e.stopPropagation();
    });
};


/**
 * Main entry
 */
$(function() {
    bindEvents();    

});
