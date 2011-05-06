(function(){
 
var URL = "http://test.development.grinfo.net/Luca/datadict";
var roots_loaded = false;
 
function tooltip() {
    // tool tip
    //
    $('.minibutton').poshytip({
        className: 'tip-twitter',
        showTimeout: 1,
        alignTo: 'target',
        alignX: 'center',
        offsetY: 5,
        allowTipHover: false,
        fade: false,
        slide: false
    });
}
 
/*
 * takes care of assigning proper
 * click events for expanding this li
 */
function expand_collapse(li) {
    var div = li.find(".hitarea");
 
    div.click(function() {
 
        var parent = li.find("ul").first();
 
 
        // check whether we need to expand or collapse
        if(li.hasClass("collapsable")) { // collapsing
            li.removeClass("collapsable");
            li.addClass("expandable");
            var hitarea = li.find(".hitarea").first();
            hitarea.removeClass("collapsable-hitarea");
            hitarea.addClass("expandable-hitarea");
            if(li.hasClass("lastCollapsable")) {
                li.removeClass("lastCollapsable");
                li.addClass("lastExpandable");
                hitarea.removeClass("lastCollapsable-hitarea");
                hitarea.addClass("lastExpandable-hitarea");
            }
 
            // let's clear the ul contents
            parent.hide();
 
 
        } else if(li.hasClass("expandable")) { // expanding
            li.removeClass("expandable");
            li.addClass("collapsable");
            var hitarea = li.find(".hitarea").first();
            hitarea.removeClass("expandable-hitarea");
            hitarea.addClass("collapsable-hitarea");
            if(li.hasClass("lastExpandable")) {
                li.removeClass("lastExpandable");
                li.addClass("lastCollapsable");
                hitarea.removeClass("lastExpandable-hitarea");
                hitarea.addClass("lastCollapsable-hitarea");
            }
 
            // if parent contains a filled UL, dont run the ajax call again, just show it
            if(parent.children().length) {
                parent.show();
            } else {
 
                var id = li.find(".id").val();

                load_branch(parent, "http://cropontology.org/ontology-lookup/tree.view?q=treebuilder&ontologyname="+id.split(":")[0]+"&id="+id);
                // TODO - fix this - for now we just have a global variable tracking if we
                // need to load the root ontology (only the first time) and nodes for the rest
                /*
                if(roots_loaded) {

                    load_branch(parent, URL+"/OntologyDataWrapperProxy.php?out-format=json&command=GetNodeChildren&NodeID="+id);
                } else {
                    load_branch(parent, URL+"/OntologyDataWrapperProxy.php?out-format=json&command=ListOntologyRoots&NodeOntology="+id);
                    // roots loaded
                    roots_loaded = true;
                }
                */
            }
 
        }
 
    });
 
}
 
// load comments on the right side
var comments = (function(){
    var template;
 
    function make_comment(data) {
        var clone = template.clone()
 
        var link = clone.find("strong.author a");
        link.attr("href", "#");
        link.text(data.user);
 
        clone.find(".date .relatize").text(data.date);
 
        clone.find(".body .content-body p").text(data.comment);
 
        return clone;
    }
    function load(data) {
        if(!template)
            template = $(".comment").first().clone();
        
        // clear comment list
        $(".comment-list").html("");
 
        for(var i=0; i<data.length; i++) {
            $(".comment-list").append(make_comment(data[i]));
        }
 
    }
 
    return {
        load: load
    };
})();
 
// global, blah
term_loader = function(show) {
    var context = $(".context-loader");
    if(show) {
        //fade.fadeTo("fast", 0.5);
        $(".error").hide();
        context.show();
 
 
    } else {
        context.hide();
        //fade.fadeTo("fast", 1);
    }
 
}
 
// attributes is an object of key:value pairs
function show_attributes(id, name, attributes) {
    var str = "", count = 0;;
    // identifier is first
    str += '<div class="attribute"><label for="">Identifier</label><span class="value">'+id+'</span></div>';

    $.each(attributes, function(i){
        count++;
        str += '<div class="attribute editable"><label for="'+i+'">'+i+'</label><span class="value">'+attributes[i]+'</span></div>';
    });
    if(count == 0)
        str += "<div class='error'>No additional information available.</div>";
    str += '<span class="add_attribute">Add a new attribute</span>';

    $(".right ul.filters li a").text(name);
    $("#term_id").text(id);
    $(".term_id").attr("href", "/terms/"+name+"/"+id);
    $("#pages .general").html(str);
    /*
    var str = '<table cellspacing="0" cellpadding="0" class="attributes">';

    $.each(attributes, function(i) {
        var attr = this,
            class_name = "";
        if(i == attributes.length-1) // last
            class_name = "last";

        var storedLocallyClass = "";
        if(attr.local)
            storedLocallyClass = "storedLocally";

        var iseven = false;
        if(i%2 === 0) // is even
            iseven = true;
            
        str += "<tr class='"+class_name+ " " +(iseven ? "even" : "")+" "+storedLocallyClass+"'><td class='key'>"+attr.key + "</td><td class='value'>"+ attr.value+"</td></tr>";
 
    });
    if(!attributes.length)
        str += "<tr class='last'><td class='error' colspan=2>No additional information available.</td><td></td></tr>";

    str += "</table>";


 
    */
}
 
// click event function
// must load data for this specifict
load_term = function(li) {
    // get info for this specific term name located under /datadict/TermName/json
    term_loader(true);

 
    var id = li.find(".id").val();
    var name = li.find("a.minibutton span").text();
 
    var parent = li.parent();
 
    var ontology_name = id.split(":")[0];
    var url = "http://cropontology.org/ontology-lookup/definition.view?&termid="+id+"&ontologyname="+ontology_name+"&q=termmetadata&_=";
 
    /* get node info (attributes) */
    $.get("/httpget", {url:url}, function(xml){
        var jxml = $(xml);
        var attributes = {};
        jxml.find("item").each(function(){
            var key = $(this).find("name").text(),
                value = $(this).find("value").text();

            if(attributes[key]) // if attribute already exists, add it as a comma separated
                attributes[key] += ", "+value;
            else
                attributes[key] = value;
        });
        // let's also load the attributes stored locally for this term
        $.getJSON("/get-attribute", {term_id: id}, function(this_attrs) {
            $.each(this_attrs, function(i) {
                attributes[this_attrs[i].key] = this_attrs[i].value;
            });

            // let's show the attributes
            show_attributes(id, name, attributes);
            term_loader(false);
        });
        
        // load comments
        //comments.load(data.comments);

 
    }, "xml");
 
    /* get comments */
    /*
    var comm_url = URL+"/OntologyDataWrapperProxy.php?out-format=json&command=ListTopics&CommentNode="+id;
    $.getJSON(comm_url, function(data){
        console.log(data);
        //comments.load(data.comments);
 
    });
    */
}
 
/*
 *
 * @returns a jquery dom element
 */
function make_li(obj, last) {
 
    // generic attributes
    var id = obj.id;
    var name = obj.name;
    var label = obj.label;
    var summary = obj.summary;
    var has_children = obj.has_children,
        hitarea;

    var li = $("<li></li>");
    if(last)
        li.addClass("last");
 
 
    // add a hidden input to track the id of this node
    li.append('<input type="hidden" class="id" value="'+id+'" />');
 
    if(has_children){
        li.addClass("expandable");
        hitarea = $('<div class="hitarea expandable-hitarea"></div>'); 
        li.append(hitarea);
    }
    if(last && has_children) {
        li.addClass("lastExpandable");
        hitarea.addClass("lastExpandable-hitarea");
    }
 
    var link = $('<a title="'+summary+'" class="minibutton btn-watch"><span>'+name+'</span></a>');
 
    link.click(function(e) {
        load_term(li);
        e.preventDefault();
        e.stopPropagation();
    });
 
    li.append(link);
 
    if(label)
        li.append('<div class="meta">'+label+'</div>');
 
    // last child
    if(has_children){
        li.append('<ul style="display:none;"></ul>');
 
        // assign click events for expansion/collapse
        expand_collapse(li);
    }
 
    return li;
}
 
function loader(parent, show) {
    var jimg = $("<img>").attr("src", "/images/metabox_loader.gif");
 
    if(show) {
        jimg.insertBefore(parent);
    } else { // hide
        $(parent).prev().remove();
    }
 
}
function get_id_desc(ontologyName, func) {
    // first get id
    $.get("/httpget", {url: "http://cropontology.org/ontology-lookup/tree.view?q=treebuilder&ontologyname="+ontologyName}, function(xml) {
        var id = $(xml).find("node").attr("accession");
        var has_children = $(xml).find("node").attr("has_children");
        // then get  of root
        $.get("/httpget", {url: "http://cropontology.org/ontology-lookup/ontologydef.view?&targetid=ontologyDefinition&ontologyname="+ontologyName+"&q=ontologydef&_="}, function(cxml) {
            var description = $(cxml).find("value").text();

            // call the callback
            func(id, description, has_children);
            
        }, "xml");

    }, "xml");
}
 
/*
 * loads a single branch given an array of objects
 * @parent - the container of the branch, a jquery DOM element; 
 *           this gets populated with the elements
 * @url - the json array of objects to do an AJAX request to
 */
function load_branch(parent, url) {
    var obj, li;
 
    // insert before the parent a loading image
    loader(parent, true);
 
    parent.show();
 
    $.get("/httpget", {url: url}, function(xml) {
        // hide the loading image
        var jxml = $(xml);

        var items = jxml.find("item");
        if(items.length) { // it's a root branch we're loading
            var count = 0;

            var devcount = 0;
            items.each(function(i) {
                devcount++; if(devcount > 10) return;


                var onto_name = $(this).find("name").text();
                var onto_id = $(this).find("value").text();


                // get ontology id and description
                get_id_desc(onto_id, function(id, description, has_children){
                    var obj = {
                        id: id,
                        name: onto_name,
                        has_children: (has_children == "1" ? true : false)
                    }, li;
                    
                    if(i == items.length-1) // last
                        li = make_li(obj, true);
                    else
                        li = make_li(obj);

                    parent.append(li);

                    count++;
                    if(count == items.length)
                        loader(parent, false);
                });
            });
        } else { // it's a inner branch we're loading
            var nodes = jxml.find("node");
            nodes.each(function(i) {
                var $this = $(this);
                obj = {
                    id: $this.attr("accession"),
                    name: $this.attr("name"),
                    has_children: ($this.attr("has_children") == "1" ? true : false)
                };
                if(i == nodes.length-1) // last
                    li = make_li(obj, true);
                else
                    li = make_li(obj);
                
                parent.append(li);
            });
            loader(parent, false);
        }
        
        // assign tooltip hovering
        //tooltip();
 
    }, "xml");
}
 
function mylogin() {
    var jmylogin = $("#mylogin");
    var jmain = $("#main");
 
    if(jmylogin.is(":visible")) {
        jmylogin.hide();
        jmain.css("opacity", "1");
 
 
    } else { // show it
        jmylogin.show();
        jmain.css("opacity", "0.2");
 
 
    }
 
}


var row_edit_template = '\
    <div class="attribute">\
        <form enctype="multipart/form-data" method="post" action="/add-attribute" id="form_add_attribute" target="upload_iframe">\
            <input type="hidden" name="term_id" />\
            <label><input type="text" name="key" /></label>\
            <span class="value">\
                <textarea class="textfield" name="value"></textarea>\
                <p>\
                    <select class="textimage-switch">\
                        <option>Text</option>\
                        <option>File</option>\
                    </select>\
                </p>\
                <div class="form-actions">\
                    <button type="submit" class="minibutton"><span>Save</span></button> &nbsp; <a href="#" class="cancel">Cancel</a>\
                </div>\
            </span>\
        </form>\
    </div>\
        ';
 
/*
 * Events assignment
 * clicks, mouseovers etc etc..
 */
var events = function(){
    // right navigation
    $("ul.sorts li").click(function(){
        var $this = $(this);
 
        // deselect all navigation buttons
        $("ul.sorts li").removeClass("desc");
 
        // select this nav button
        $this.addClass("desc");
 
        // get the id of this node
        var id = $this.attr("id");
 
        // hide all pages
        $("#pages").children().hide();

        if(id == "general") {
            if(jcurrEditing)
                toolbar.show();
        } else {
            toolbar.hide();
        }
 
        // load page pased on this id
        $("."+id).show();
 
    });
 
    
 
    // mousedown event
    $(".minibutton, .classy").live("mousedown", function() {
        $(this).addClass("mousedown");
    });
    $(".minibutton, .classy").live("mouseup", function() {
        $(this).removeClass("mousedown");
    });
    $(".minibutton, .classy").live("mouseout", function() {
        $(this).removeClass("mousedown");
    });
 
    // comment post
    $(".new-comments .form-actions button").click(function(e) {
        var comment = $(".new-comments .comment-form textarea").val();
        var term_id = $(".browser-content .filters li a").text();
 
        term_loader(true);
 
        $.ajax({
          type: 'POST',
          url: 'http://test.development.grinfo.net/Luca/datadict/google-login',
          data: {
            "term_id" : term_id,
            "text" :comment
          },
          success: function(data) {
            term_loader(false);
            // load comments of this term again
            // simulate click on this, rather ugly
            //load_term(term_id);
            // clear textarea
            $(".new-comments .comment-form textarea").val("");
          }
        });
 
        e.preventDefault();
        e.stopPropagation();
    });
    $("#login-close").click(function(e){
 
        mylogin();
 
        e.preventDefault();
        e.stopPropagation();
    });
 
    $("#login_form").submit(function(e){
        $(".context-loader").show();
        $.ajax({
          type: 'POST',
          url: 'http://test.development.grinfo.net/Luca/datadict/google-login',
          data: {
            "username":$("#login_form input[name=username]").val(),
            "password":$("#login_form input[name=password]").val()
          },
          success: function(data){
            $(".error").hide();
            $(".error_box").hide();
            term_loader(false);
 
 
          }
        });
 
        e.preventDefault();
        e.stopPropagation();
    });


    // adding new attribute
    jcurrAdding = false;
    $(".add_attribute").live("click",function(e) {
        // if we're editing or already added
        if(jcurrEditing || jcurrAdding) return;
        jcurrAdding = true;
        var new_attr = $(row_edit_template);
        $("#pages div.editable").die();
        toolbar.die();
        new_attr.insertBefore($(this));
    });

    //
    $(".textimage-switch").live("change",function(e) {
        var text = '<textarea class="textfield" name="value"></textarea>';
        var img = '<input name="value" type="file" />';
        var $this = $(this);
        var cont = $this.parent().prev();
        if($this.val() == "File") {
            cont.replaceWith(img);
        } else { 
            cont.replaceWith(text);
        }
    });

    $(".attribute a.cancel").live("click", function(e) {
        var $this = $(this);
        var div = $this.parents(".attribute");
        div.remove();

        if(jcurrEditing) jcurrEditing.show();

        bind_attributes_events();

        e.preventDefault();
        e.stopPropagation();
    });

    $("#form_add_attribute").live("submit",function(e) {
        // add the key and term_id to the form
        // start upload by target
        var term_id = $("#term_id").text();
        $(this).find("input[name=term_id]").val(term_id);
        term_loader(true);
    });

    
    toolbar = $(".toolbar");
    jcurrHovered = false,
        jcurrEditing = false;

    bind_attributes_events = function() {
        $("#pages div.editable").live("mouseover", function(){
            var $this = $(this);
            jcurrHovered = $this;

            var p = $this.offset();
            toolbar.show();
            toolbar.css("top", p.top-1+"px");
            toolbar.css("left", p.left + $this.width()+"px");

        });
        $("#pages div.editable").live("mouseout", function(){
            toolbar.hide();
        });

        toolbar.live("mouseover", function(){
            jcurrHovered.addClass("hovered");
            $(this).show();
        });
        toolbar.live("mouseout", function(){
            jcurrHovered.removeClass("hovered");
            $(this).hide();
        });
        toolbar.hide();
        if(jcurrHovered)
            jcurrHovered.removeClass("hovered");

        if(jcurrEditing) {
            jcurrEditing = false;
        }
        jcurrAdding = false;
    }
    bind_attributes_events();

    $(".toolbar_edit").live("click", function() {
        if(jcurrEditing) return;

        // the toolbar needs to be visible until we click cancel/or remove the attribute
        // so let's unbind the mouseover for the attributes
        $("#pages div.editable").die();
        toolbar.die();

        var edit_row = $(row_edit_template);
        jcurrEditing = jcurrHovered;

        edit_row.addClass("hovered");

        var key = jcurrEditing.find("label").text();
        var value = jcurrEditing.find("span.value").text();

        edit_row.find("input[name=key]").val(key);
        edit_row.find("textarea[name=value]").val(value);

        // make the key input read-only
        var input = edit_row.find("label input[type=text]");
        input.attr("readonly", "readonly");

        edit_row.insertAfter(jcurrEditing);
        jcurrEditing.hide();
    });
    $(".toolbar_remove").live("click", function() {
        var key = jcurrHovered.find("label").text();
        var term_id = $("#term_id").text();
        term_loader(true);
        var answer = confirm("Are you sure you want to delete this attribute?");
        if(answer) {
            $.post("/remove-attribute",{key:key, term_id: term_id}, function(){

                term_loader(false);
                // great term was saved, let's reload this term
                // to reload the term re-using load_term(li) we need to find the li object
                var li = $("input.id[value=\""+term_id+"\"]").parent();
                load_term(li);

                bind_attributes_events();

            });
        } else{ term_loader(false); }

    });
 
};
 
$(document).ready(function(){
 
    /* load initial root branch - left-side */
    //load_branch($("#root"), "http://cropontology.org/ontology-lookup/direct.view?q=ontologyfilter");
    load_branch($("#root"), "http://cropontology.org/ontology-lookup/tree.view?q=treebuilder&ontologyname="+ontologyname);
 
    /* assign some events for ui */
    events();
 
    /* global ajax setup thing */
    $.ajaxSetup({
        "success": function() {   
            $(".error").hide();
            $(".error_box").hide();
            term_loader(false);
        },
        "error": function() {   
            term_loader(false);
            $(".error").show();
            $(".error_box").show();
        },
        "cache": false
    });
 
});
 
})();
 

function fileupload_done() {
    var term_id = $("#term_id").text();
    term_loader(false);
    // great term was saved, let's reload this term
    // to reload the term re-using load_term(li) we need to find the li object
    var li = $("input.id[value=\""+term_id+"\"]").parent();
    load_term(li);

    bind_attributes_events();
}

