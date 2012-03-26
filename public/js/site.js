;(function() {

function index() {
    var $btn = $(".ibfieldbook-button");
    $btn.text("Show IBFieldbook list");
    $btn.attr("href", "#!/ibfieldbook");

    var $treeview = $(".treeview");
    $treeview.show();
}

function showFieldbook() {
    var $btn = $(".ibfieldbook-button");
    var oldText = $btn.text();
    $btn.text("Show all");
    $btn.attr("href", "#!/");

    var $treeview = $(".treeview");
    $treeview.hide();

    $.getJSON("/ibfieldbook", function(data) {
        $.each(data, function() {
            console.log(this);

        });
    });
}

$(function() {
    $.sammy(function() {
        // routes
        //this.get("", index);
        this.get("#!/", index);
        this.get("#!/ibfieldbook", showFieldbook);

    }).run();
});

})();
