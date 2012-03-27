;(function() {

function index() {
    var $btn = $(".ibfieldbook-button");
    $btn.text("Show IBFieldbook list");
    $btn.attr("href", "#!/ibfieldbook");

    var $root = $("#root");
    $root.show();

    var $ibfieldbook = $("#ibfieldbook");
    $ibfieldbook.hide();
}

function ibfieldbook() {
    var $root = $("#root");
    $root.hide();


    var $btn = $(".ibfieldbook-button");
    var oldText = $btn.text();
    $btn.text("Show all");
    $btn.attr("href", "#!/");

    var $ibfieldbook = $("#ibfieldbook");
    if($ibfieldbook.is("*")) {
        $ibfieldbook.show();
        return;
    }

    var $ul = $("<ul class='treeview' id='ibfieldbook'></ul>");
    $(".cont").append($ul);
    load_branch($ul, "/get-ontology-roots/"+ontologyid, function(li) {
        var hitarea = li.find(".hitarea:first");
        console.log(hitarea);
        //hitarea.click();
        var parent = li.find("ul").first();
        load_branch(parent, "/ibfieldbook?ontologyId="+ontologyid);
    });

}

$(function() {
    $.sammy(function() {
        // routes
        //this.get("", index);
        this.get("#!/", index);
        this.get("#!/ibfieldbook", ibfieldbook);

    }).run();
});

})();
