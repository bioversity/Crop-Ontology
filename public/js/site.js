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
        var parent = $("<ul></ul>");
        li.append(parent);
        load_branch(parent, "/ibfieldbook?ontologyId="+ontologyid);
    });

}

$(function() {
    $.sammy(function() {
        // routes
        this.notFound = function(){};
        this.get("#!/", index);
        this.get("#!/ibfieldbook", ibfieldbook);


        this.get("/add-ontology#!/add/:action", function() {
            var action = this.params["action"];
            $("#upload_obo_cont, #create_ontology_cont, #upload_excel_cont").hide(); // hide all
            $(".add_title a").removeClass("selected");

            var $this = $("[cont=" + action + "_cont]");
            if($this.length) {
                $this.addClass("selected");
                // show this cont
                $("#" + action + "_cont").show();
            }
        });

    }).run();
});

})();
