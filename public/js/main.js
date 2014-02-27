jQuery.prototype.draggable = function(dropSelector, cb){
    var that = this;
    var dragged, mousex, mousey, coordinates = [],
        startObjectX,
        startObjectY,
        startMouseX,
        startMouseY,
        fromEl;

    var continueDragging = function(e) {
        // Change the location of the draggable object
        dragged.css({
            left:startObjectX+(e.pageX-startMouseX)+'px',
            top:startObjectY+(e.pageY-startMouseY)+'px'
        });

        // Check if we hit any boxes
        for (var i in coordinates) {
            if (mousex >= coordinates[i].left && mousex <= coordinates[i].right) {
                if (mousey >= coordinates[i].top && mousey <= coordinates[i].bottom) {
                    // Yes, the mouse is on a droppable area
                    // Lets change the background color
                    coordinates[i].dom.addClass("somethingover");
                } else {
                    coordinates[i].dom.removeClass("somethingover");
                }
            } else {
                // Nope, we did not hit any objects yet
                coordinates[i].dom.removeClass("somethingover");
            }
        }

        // Keep the last positions of the mouse coord.s
        mousex = e.pageX;
        mousey = e.pageY;
    }

    var endDragging = function(e) {
        // Remove document event listeners
        var $document = $(document);
        $document.unbind("mousemove", continueDragging);
        $document.unbind("mouseup", endDragging);

        // Check if we hit any boxes
        for (var i in coordinates) {
            if (mousex >= coordinates[i].left && mousex <= coordinates[i].right) {
                if (mousey >= coordinates[i].top && mousey <= coordinates[i].bottom) {
                    // Yes, the mouse is on a droppable area
                    droptarget = coordinates[i].dom;
                    droptarget.removeClass("somethingover").addClass("dropped");
                    cb(fromEl, droptarget);

                    dragged.hide("fast", function() {
                        $(this).remove();
                    });
                }
            }
        }

        if(dragged) dragged.remove();

        // Reset variables
        mousex = 0;
        mousey = 0;
        dragged = null;
        coordinates = [];
    }

    var startDragging = function(e) {
        // Find coordinates of the droppable bounding boxes
        $(dropSelector).each(function() {
            var $this = $(this);
            var lefttop = $this.offset();
            // and save them in a container for later access
            coordinates.push({
                dom: $this,
                left: lefttop.left,
                top: lefttop.top,
                right: lefttop.left + $this.width(),
                bottom: lefttop.top + $this.height()
            });
        });

        var $this = $(this);
        fromEl = $this;
        // When the mouse down event is received
        if (e.type == "mousedown") {
            dragged = $("<span class='treeview'></span>");
            dragged.append($this.clone());
            dragged.css({
                position: "absolute",
                opacity: "0.7"
            });
            // set the start of the object
            startMouseX = e.pageX;
            startMouseY = e.pageY;
            var pos = $this.offset();
            startObjectX = pos.left;
            startObjectY = pos.top;
            $(document.body).append(dragged);
            // Bind the events for dragging and stopping
            var $document = $(document);
            $document.bind("mousemove", continueDragging);
            $document.bind("mouseup", endDragging);
        }
        e.stopPropagation();
        //e.preventDefault();
    }

    // Start the dragging
    this.live("mousedown", startDragging);    
};
var currUser = false;
(function(){
 
var URL = "http://test.development.grinfo.net/Luca/datadict";
var OLS_MAINURL = "http://cropontology.org";
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


DEFAULT_LANGUAGE = "english";
function findTranslation(lang, obj) {
  var translation = "";
  translation = obj[lang];  
  if(!obj[lang]) { 
    // this object doesn't contain the language.
    // show the first key
    for(var i in obj) {
      translation = obj[i];
      lang = i;
      break;
    }
  }
  return {lang: lang, translation: translation};
}
translate = function(currUser, value) {
  try {
    var obj = $.parseJSON(value);
    if(!obj) {
        throw 'value is null';
    }
    var lang = currUser.language;
    if(!lang) { // show default language
      lang = DEFAULT_LANGUAGE;
    }
    var t = findTranslation(lang, obj);

    return {lang: t.lang, translation: t.translation};
  } catch(e) {
    // value is a string with no translations.
    // default to what it is
    return {lang: DEFAULT_LANGUAGE, translation: value};
  }
}

// does login WOW this code is so messy it's not even funny
// but there's a demo in 2 weeks and i have to build facebook like interface
Login = function(func) {
    // reach /login and see if there's a session
    $.get("/login", function(data) {
        if(data.username != "") {
            currUser = data;
            $("#dologin").hide();
            $("#doregister").hide();

            var jprofile = $("#doprofile");
            jprofile.show().html(data.username);
            jprofile.click(function(e) {

                UserWidget.show(data.userid);


                e.stopPropagation();
                e.preventDefault();
            });

            $("#dologout").show();

            func(data);
        } else {
            $("#dologin").show();
            $("#doregister").show();

            $("#doprofile").hide();
            $("#dologout").hide();
            func(false);

        }
            
    }, "json");
}
 
/*
 * takes care of assigning proper
 * click events for expanding this li
 */
function expand_collapse() {
    var div = $(".hitarea");
 
    div.live("click", function() {
 
        var $this = $(this);

        var li = $this.parent();

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

                load_branch(parent, "/get-children/"+id);
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
function slugify(s) {
    if(!s) return s;
    var _slugify_strip_re = /[^\w\s-]/g;
    var _slugify_hyphenate_re = /[-\s]+/g;
    s = s.replace(_slugify_strip_re, '').trim().toLowerCase();
    s = s.replace(_slugify_hyphenate_re, '-');
    return s;
}
 
// load comments on the right side
var comments = (function(){
    var template;
 
    function make_comment(data) {
        var clone = template.clone();
 
        var link = clone.find("strong.author a");
        link.attr("href", "#");
        link.text(data.author);
        link.attr("userid", data.author_id);
 
        clone.find(".date .relatize").text(data.created);
 
        clone.find(".body .content-body p").html(markdown(data.comment));
 
        return clone;
    }
    function load(data) {
        if(!template)
            template = $(".comment").first().clone();
        
        // add the number in the comments tab
        var nc = $("#new-comments");

        nc.text( data.length + " Comments" );
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

function firstWord(word) {
    return word.split(" ")[0].toLowerCase();
}

function findWord(key, obj) {
    for(var i in obj) {
        var first = firstWord(i);
        if(first === key) {
            return i; 
        }
    }
}

runInOrder = function(first, last, obj, cb, hideObj) {
    var keys = {};
    // first run the ones in order and call the callback if found
    for(var i in first) {
        var firstW = firstWord(i);
        var key = findWord(firstW, obj);
        if(key) {
            keys[key] = true;
            cb(key);
        }
    }
    for(var i in last) {
        var firstW = firstWord(i);
        var key = findWord(firstW, obj);
        if(key) keys[key] = true;
    }


    // now do the rest, omitting the keys we already did
    for(var i in obj) {
        if(hideObj[i]) continue;
        if(keys[i]) continue; // already did this key
        cb(i);
    }

    for(var i in last) {
        var firstW = firstWord(i);
        var key = findWord(firstW, obj);
        if(key) cb(key)
    }
}
 
// attributes is an object of key:value pairs
function show_attributes(id, name, attributes) {
    var str = "", count = 0;
    // identifier is first
    str += '<div class="attribute"><label for="">Identifier</label><span class="value">'+id+'</span></div>';

    // let's not show these attributes - even though they're returned from the API
    var hide = {
        ontology_id: true,
        ontology_name: true,
        is_a: true,
        'Name of Trait': true,
        'language': true,
        'Scale ID for modification, Blank for New':true,
        'Method ID for modification, Blank for New': true,
        'Trait ID for modification, Blank for New': true,
        'Language of submission (only in ISO 2 letter codes)': true
    };

    var first = {
        'Abbreviated name': true,
        'Synonyms': true,
        'Description': true,
        'Trait class': true,
        'How is trait': true
    }
    var last = {
        'Name of submitting scientist': true,
        'Institution': true,
        'Date of submission': true,
        'Bibliographic': true,
        'Updated': true,
    };

    runInOrder(first, last, attributes, function(i) {
        count++;
        var t = translate(currUser, attributes[i]);
        var lang = currUser.language || DEFAULT_LANGUAGE;
        if(t.lang !== lang) return;
        str += '<div class="attribute editable"><label for="'+i+'">'+i+'</label><span class="value">'+markdown(t.translation)+'</span><input type="hidden" value="'+t.lang+'" class="language" /></div>';
    }, hide);

    if(count == 0)
        str += "<div class='error'>No additional information available.</div>";
    str += '<span class="add_attribute">Add a new attribute</span>';

    $(".right ul.filters li a").text(name);
    $("#static-html").attr("href", "/terms/"+id+"/"+name+"/static-html?language=" + (currUser ? (currUser.language || DEFAULT_LANGUAGE): DEFAULT_LANGUAGE));
    $("#term_id").text(id);
    $(".term_id").attr("href", "/terms/"+id+"/"+name);
    $("#pages .general").html(str);
}

function highlight(li) {
    var className = "selected";
    // first deselect everything
    $(".minibutton").removeClass(className);

    var $mini = li.find(".minibutton:first");
    $mini.addClass(className);

    // for each parent li, also select
    li.parents("li").each(function() {
        var $this = $(this); 
        $this.find(".minibutton:first").addClass(className);

    });
}

function showMethodAttr(attributes) {
    var show = [
        "Describe how measured (method)",
        "Type of Measure (Continuous, Discrete or Categorical)"
    ];
    var ret = {};
    for(var i=0;i<show.length;i++) {
        ret[show[i]] = attributes[show[i]];
    }
    return ret;
}
function showScaleAttr(attributes) {
    var type = attributes["Type of Measure (Continuous, Discrete or Categorical)"];
    if(type == "Continuous") {
        var show = [
            "Type of Measure (Continuous, Discrete or Categorical)",
            "For Continuous: units of measurement",
            "For Continuous: minimum",
            "For Continuous: maximum"
        ];

    } else if(type == "Categorical") {
        var show = [
            "Type of Measure (Continuous, Discrete or Categorical)",
            "For Categorical: Class 1 - value = meaning",
            "For Categorical: Class 2 - value = meaning",
              "For Categorical: Class 3 - value = meaning",
             "For Categorical: Class 4 - value = meaning",
              "For Categorical: Class 5 - value = meaning"
        ];
    }

    var ret = {};
    for(var i=0;i<show.length;i++) {
        ret[show[i]] = attributes[show[i]];
    }
    return ret;
}
 
// click event function
// must load data for this specifict
load_term = function(li) {
    // get info for this specific term name located under /datadict/TermName/json
    term_loader(true);

    highlight(li);

 
    var id = li.find(".id:first").val();
    var name = li.find("a.minibutton:first span").text();
 
    var parent = li.parent();
 
 
    var attributes = {};
    
    $.getJSON("/get-attributes/"+encodeURIComponent(id), function(this_attrs) {
        $.each(this_attrs, function(i) {
            attributes[this_attrs[i].key] = this_attrs[i].value;
        });

        // let's show the attributes
        show_attributes(id, name, attributes);
        term_loader(false);
    });
 
    /* get comments */
    $.get("/get-comments", {termId: id}, function(data){
        comments.load(data);
    }, "json");


    // build graph
    var $graph = $("#graph");
    $.getJSON("/get-term-parents/"+id, function(data) {
      $graph.show();
      buildGraph($graph, data);
    });

    /* get relationship */
    /*
    $.get("/httpget", {url:"http://cropontology.org/ontology-lookup/termsgraph.view?&graphId=random&termId="+encodeURIComponent(id)+"&termName="+encodeURIComponent(name)+"&ontologyName="+encodeURIComponent(ontology_name)+"&graphType=root&realPath=/usr/local/tomcat-dev/webapps/ontology-lookup&q=termsgraph&_=", contentType : "text/html"}, function(html){
        // adjust the html - fuck
        var $html = $("<div class='wrap'></div>").append(html),
            img = $html.find("img"),
            area = $html.find("area");

        area.each(function(){
            var $area = $(this),
                termName = "",
                termId = "";
            // the last word of the title is the term_id
            var title = $area.attr("title");
            var words = title.split(" ");
            termId = words[words.length-1];
            termName = title.replace(termId, "");

            $area.attr("href", "/terms/"+termName+"/"+termId);
        });

        img.attr("src", OLS_MAINURL + img.attr("src"));

        $(".relationships").html($html);
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
    var summary = obj.name;
    var has_children = obj.has_children,
        relationship = obj.relationship,
        hitarea,
        has_method = (!obj.has_children && obj.method && obj.method !== "null");

    var li = $("<li></li>");
    if(last)
        li.addClass("last");
 
    // add a hidden input to track the id of this node
    li.append('<input type="hidden" class="id" value="'+id+'" />');
 
    if(has_children || has_method){
        li.addClass("expandable");
        hitarea = $('<div class="hitarea expandable-hitarea"></div>'); 
        li.append(hitarea);
    }
    if(last && (has_children || has_method)) {
        li.addClass("lastExpandable");
        hitarea.addClass("lastExpandable-hitarea");
    }

 
    var nameTrans = translate(currUser, name);
    if(currUser.language && currUser.language !== nameTrans.lang) {
        li.hide();
    }
    var link = $('<a title="'+summary+'" class="minibutton btn-watch"><span>'+nameTrans.translation+'</span></a>');
 
    link.click(function(e) {
        load_term(li);
        e.preventDefault();
        e.stopPropagation();
    });
 
    li.append(link);

    if(relationship) {
        var rel = $("<span class='relationship "+relationship+"' title='"+relationship+"'>"+relationship+"</span>");

        li.append(rel);

    }
 
    if(label)
        li.append('<div class="meta">'+label+'</div>');
 
    // last child
    if(has_children){
        li.append('<ul style="display:none;"></ul>');
 
        // assign click events for expansion/collapse
        //expand_collapse(li);
    }

    // if it's the last leaf node and it has a method
    // just show it as a child
    if(has_method) { 
        li.append(methodScale(obj));
    }
 
    return li;
}

function makeScaleLi(scale, methodId, islast) {
    scale = translate(currUser, scale).translation;
    var scale_li = $("<li class='"+(islast ? "last": "")+"'></li>"),
        scale_link = $('<a title="'+scale+'" class="minibutton btn-watch"><span>'+scale+'</span></a>');

    // add a hidden input to track the id of this node
    scale_li.append('<input type="hidden" class="id" value="' + methodId + '/' + slugify(scale) + '" />');
    scale_link.click(function(e) {
        load_term(scale_li);
        e.preventDefault();
        e.stopPropagation();
    });

    scale_li.append(scale_link);

    scale_li.append("<span class='relationship scale_of' title='scale_of'>scale_of</span>");

    return scale_li;
}

/**
 * creates the methodScale "node" and assigns proper links to it
 */
function methodScale(obj) {

    obj.method = translate(currUser, obj.method).translation;

    // add an ul (parent) to this, so we can put stuff in it as a child
    var method_ul = $('<ul style="display:none;"></ul>'),
        method_li = $("<li class='last'></li>"),
        method_link = $('<a title="'+obj.method+'" class="minibutton btn-watch"><span>'+obj.method+'</span></a>');

    // add a hidden input to track the id of this node
    var slug = obj.method.split(" ");
    var m = [];
    for(var i=0; i<slug.length; i++) {
        if(i > 1) break;
        m.push(slug[i]);
    }
    var methodId = obj.id + '/' + slugify(m.join(" "));
    method_li.append('<input type="hidden" class="id" value="'+  methodId + '" />');

    method_link.click(function(e) {
        load_term(method_li);
        e.preventDefault();
        e.stopPropagation();
    });

    method_li.append(method_link);

    method_li.append("<span class='relationship method_of' title='method_of'>method_of</span>");

    var scaleul = $("<ul></ul>");
    for(var i=0; i<obj.scales.length; i++) {
        var scale = obj.scales[i];
            scaleli = makeScaleLi(scale, methodId, (i == obj.scales.length-1)?true:false);
        if(scale)
            scaleul.append(scaleli);
    }
    if(obj.scales.length) {
        method_li.append(scaleul);
    }

    method_ul.append(method_li);
    return method_ul;
}
 
function loader(parent, show) {
    var jimg = $("<img>").attr("src", "/public/images/metabox_loader.gif");
 
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
 
function do_search() {
    // just replace the text value
    $("#search").val(searchQuery);

    var url = "http://cropontology.org/ontology-lookup/term.view?&termname="+encodeURIComponent(searchQuery)+"&ontologyname=null&obsolete=true&q=termautocomplete&_=",
        parent = $("#root");

    loader(parent, true);

    $.get("/httpget", {url: url}, function(xml) {
        // hide the loading image
        var jxml = $(xml);

        var items = jxml.find("item");

        items.each(function(i) {
            var $this = $(this);
            obj = {
                id: $this.find("value").text(),
                name: $this.find("name").text(),
                has_children: false
            };
            if(i == items.length-1) // last
                li = make_li(obj, true);
            else
                li = make_li(obj);
            
            parent.append(li);
        });
        loader(parent, false);
    });
}
/*
 * loads a single branch given an array of objects
 * @parent - the container of the branch, a jquery DOM element; 
 *           this gets populated with the elements
 * @url - the json array of objects to do an AJAX request to
 */
load_branch = function(parent, url, cb) {
    var obj, li;
 
    // insert before the parent a loading image
    loader(parent, true);
 
    parent.show();
 
    $.getJSON(url, function(children) {
        
        for(var i=0,len=children.length; i<len; i++) {
            var child = children[i];
            var last = false;
            if(i == (children.length-1))
                last = true;

            var li = make_li(child, last);
            parent.append(li);
            
        }
         
        loader(parent, false);
        if(cb) cb(li);
    });
}
 
function mylogin() {
    var jmylogin = $("#mylogin");
    var jmain = $("#main, .footer");

    $(".error_box").hide();
 
    if(jmylogin.is(":visible")) {
        jmylogin.hide();
        jmain.css("opacity", "1");
    } else { // show it
        jmylogin.show();
        jmain.css("opacity", "0.2");
    }
}
function myregister() {
    var jmyregister = $("#myregister");
    var jmain = $("#main");
 
    if(jmyregister.is(":visible")) {
        jmyregister.hide();
        jmain.css("opacity", "1");
    } else { // show it
        jmyregister.show();
        jmain.css("opacity", "0.2");
    }
}


var langs = {
  capitaliseFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  html: function(langs){
    var html = "<select name='language'>";
    for(var i=0; i<langs.length; i++) {
      html += "<option value='"+langs[i]+"'>" + this.capitaliseFirstLetter(langs[i]) + "</option>"; 
    }
    html += "</select>";
    return html;
  }
}

var row_edit_template = '\
    <div class="attribute">\
        <form enctype="multipart/form-data" method="post" action="/add-attribute" id="form_add_attribute" target="upload_iframe" accept-charset="UTF-8">\
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
                <p>\
                    Language: '+langs.html(languages)+'\
                </p>\
                <div class="form-actions">\
                    <button type="submit" class="minibutton"><span>Save</span></button> &nbsp; <a href="#" class="cancel">Cancel</a>\
                </div>\
            </span>\
        </form>\
    </div>\
        ';
 
function createUploadUrl(jcont) {
    var form = jcont.find("form:first");
    $.get("/attribute-upload-url", function(str) {
        form.attr("action", str); 
    });
}

function buildGraph($cont, data) {
  var render = function(r, n) {
    /* the Raphael set is obligatory, containing all you want to display */
    var id = n.id,
        label = n.label,
        biggest;
    if(id.length > label.length) {
      biggest = id;
    } else {
      biggest = label;
    }
    
    var set = r.set().push(
        /* custom objects go here */
        r.rect(n.point[0], n.point[1]-13, biggest.length + 120, 44).attr({"fill": "#feb", r : "12px", "stroke-width" : n.distance == 0 ? "3px" : "1px" })).push(
        r.text(n.point[0] + (biggest.length / 2) + 60, n.point[1] + 10, (n.label || n.id) + "\n(" + (n.id) + ")"));
    return set;
  };

  $cont.html("");
  var width = $cont.width();
  var height = 400;
  var g = new Graph();
  g.edgeFactory.template.style.directed = true;

  $.each(data, function(idx, el) {
    for(var i=0; i<el.length; i++) {
      g.addNode(el[i].id, {render:render, label: translate(currUser, el[i].name).translation});
    }
  });
  $.each(data, function(idx, el) {
    for(var i=0; i<el.length; i++) {
      var next = el[i+1];
      if(next) {
        g.addEdge(next.id, el[i].id, {label: next.relationship});
        //g.addEdge(next.id, el[i].id);
      }
    }
  });

  var layouter = new Graph.Layout.Spring(g);
  layouter.layout();

  var renderer = new Graph.Renderer.Raphael('graph', g, width, height);
  renderer.draw();
}

/*
 * Events assignment
 * clicks, mouseovers etc etc..
 */
var events = function(){
    // right navigation
    $("ul.sorts li").click(function(){
        var $this = $(this);
        if($this.attr("id") == "download") return;
 
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
        var commentTextarea = $(".new-comments .comment-form textarea");
        var comment = commentTextarea.val();
        var term_id = $("#term_id").text();
 
        var ontoId = "";
        if(ontologyid === "") {
            // get it from the term_id
            ontoId = term_id.split(":")[0];
        } else {
            ontoId = ontologyid;
        }
        term_loader(true);
 
        $.ajax({
          type: 'POST',
          url: '/add-comment',
          data: {
            "termId" : term_id,
            "ontologyId" : ontoId,
            "comment" :comment
          },
          success: function(data) {
            term_loader(false);
            // clear the comment box
            commentTextarea.val("");

            // load comments of this term again
            // simulate click on this, rather ugly
            //load_term(term_id);
            // clear textarea
            //$(".new-comments .comment-form textarea").val("");
            fileupload_done();
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
    $("#register-close").click(function(e){
 
        e.preventDefault();
        e.stopPropagation();
    });
    $('.download-button').click(function(e) {
        Modal.show('download_onto')
        e.preventDefault()
        e.stopPropagation()
    })
 

    // adding new attribute
    jcurrAdding = false;
    $(".add_attribute").live("click",function(e) {
        // if we're editing or already added
        if(jcurrEditing || jcurrAdding) return;
        jcurrAdding = true;
        var new_attr = $(row_edit_template);
        createUploadUrl(new_attr);

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
        createUploadUrl(edit_row);
        jcurrEditing = jcurrHovered;

        edit_row.addClass("hovered");

        var key = jcurrEditing.find("label").text();
        var value = jcurrEditing.find("span.value").text();
        var language = jcurrEditing.find(".language").val();

        edit_row.find("input[name=key]").val(key);
        edit_row.find("textarea[name=value]").val(value);
        edit_row.find("option").each(function(){
          var $this = $(this);
          if($this.val() === language) {
            $this.attr("selected", "selected");
          }
        });

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

    // search
    function selectItem(li) {
        var $li = $(li);
        window.location.href = "/terms/"+$li.attr("term_id")+'/';
    }
    function formatItem(term) {
        var name = term.name
        var ontologyName = term.ontology_name

        if(name.english) { 
            name = name.english
        } else if($.isPlainObject(name)) {
            for(var i in name) {
                name = name[i];
                break;
            }
        }
        if(ontologyName.english) { 
            ontologyName = ontologyName.english
        } else if($.isPlainObject(ontologyName)) {
            for(var i in ontologyName) {
                ontologyName = ontologyName[i];
                break;
            }
        }

        return name + " ("+ontologyName+")";
    }
    $("#search").autocomplete(
        "/search",
        {
            delay:10,
            minChars:2,
            matchSubset:1,
            matchContains:1,
            onItemSelect:selectItem,
            formatItem:formatItem
        }
    );


    Modal.init();

    /*
    $(".aboutbtn a").click(function(e) {
        Modal.show("about");
        
        e.preventDefault();
        e.stopPropagation();
    });
    */
    $(".usersbtn a").click(function(e) {
        UserWidget.showAll();

        e.preventDefault();
        e.stopPropagation();
    });

    $("[userid]").live("click", function(e) {
        var $this = $(this);
        var userid = $this.attr("userid");

        if(userid)
            UserWidget.show(userid);

        e.preventDefault();
        e.stopPropagation();
    });

    //$(".reg_lang").html(langs.html(languages));


    $("#edit_profile").click(function(e) {

      Modal.show("edit_profile",function(){
        this.curr.show();
        this.load(true);
        var $form = this.curr.find("form");

        this.curr.find("option").each(function(){
          var $this = $(this);
          if($this.val() === currUser.language) {
            $this.attr('selected', 'selected');
          }
        });
        $form.submit(function(e) {
          var $this = $(this);
          $.post("/edit-profile", $this.serialize(), function(data) {
              Login(function(){});
          });

          e.stopPropagation();
          e.preventDefault();
        });
      });
      e.stopPropagation();
      e.preventDefault();
    });

};

var Modal = (function() {
    var main = "#main, .footer";
    function hide() {
        $(".modal").hide();
        $(main).css("opacity", "1.0");
    }

    function init() {
        $(".modal .popup .close").click(function(e) {

            hide();
            
            e.stopPropagation();
            e.preventDefault();
        });
        
    }
    function setModalHeight() {
        // set the modal height based on the current modal height
        var jmodal = $(".modal");
        var height = jmodal.height();
        // if height is bigger than the screen, just set top to 0
        if(height > $(window).height()) {
            jmodal.css("margin-top", "0px");
        } else {
            jmodal.css("margin-top", "-" + (height/2) + "px");
        }

    }
    function load(s) {
        if(s) {
            
        } else {
            setModalHeight();
        }

    }
    function show(className, func) {
        $(main).css("opacity", "0.2");

        var jmodal = $(".modal");
        jmodal.show();

        var sel = ".modal .popup .content";
        // hide all divs inside content
        $(sel + " > div").hide();

        // show the curr one
        var curr = $(sel+" ."+className);
        if(func) {
            func.call({
                curr: curr,
                load: load
            });

            return;
        }
        curr.show();

        setModalHeight();
    }

    return {
        init: init,
        show: show,
        hide: hide
    };
})();


// Search weeee
var Search = (function() {
    var query = "",
        searchFields = ["id", "name", "def"];

    function RunSearch(result, arr) {
        for(var i=0, len=arr.length; i<len; i++) {
            var curr = arr[i];

            for(var x=0,slen=searchFields.length; x<slen; x++) {
                var field = searchFields[x];
                if(typeof curr[field] !== "undefined") {
                    if(curr[field].match(new RegExp(query, "i")))
                        result.push(curr);
                }
            }

            RunSearch(result, curr.children);
        }
    }

    function init(first) {
        $("#dosearch").click(function(e){
            query = $("#search").val().trim();

            var result = [];
            RunSearch(result, first);

            //console.log(result);

            e.preventDefault();
            e.stopPropagation();
        });
    }

    return {
        init: init
    };
})();

/**
 * out of JSON data we make a UI tree
 * recursion is the basis of all this logic
 *
 * jel is the UI element
 */
function MakeTree(jel, arr) {
    for(var i=0, len=arr.length; i<len; i++) {
        var last = false;
        if(i == (arr.length-1))
            last = true;

        var li = make_li(arr[i], last);
        jel.append(li);


        MakeTree(li.find("ul:first"), arr[i].children);
    }
}

var firstLoaded = false;
function LoadOntology(ontoId) {
    var $root = $("#root");
    loader($root, true);
    $.getJSON("/get-ontology-roots/"+ontoId, function(roots) {
        loader($root, false);
        //Search.init(jsonTree);
        var oboBlobKey = false;
        var excelBlobKey = false;
       
        for(var i=0, len=roots.length; i<len; i++) {
            var last = false;
            if(i == (roots.length-1))
                last = true;

            // roots always have children :)
            roots[i].has_children = true;
            oboBlobKey = roots[i].oboBlobKey;
            excelBlobKey = roots[i].excelBlobKey;

            var li = make_li(roots[i], last);
            $root.append(li);
        }

        /*
        if(excelBlobKey && excelBlobKey != 'null') {
            if(excelBlobKey.charAt(0) != '[') {
                $('.excel-blob-key').attr('href', '/serve/'+excelBlobKey).show() 
            }
        }
        */
        if(oboBlobKey && oboBlobKey != 'null') {
            $('.obo-blob-key').attr('href', '/serve/'+oboBlobKey).show() 
        }

        // try to parse the name property to see if it's a JSON
        if(!firstLoaded) {
            try {
                var j = $.parseJSON(roots[0].name);
                var ls = [];
                for(var i in j) ls.push(i);

                // make the language dropdown
                var $languages_refresh = $(".languages_refresh");
                $languages_refresh.html(langs.html(ls));
                var $print = $('.print-button').eq(1);
                var href = $print.attr('href');
                $languages_refresh.find("select").change(function(i) {
                    if(!currUser) currUser = {};
                    var lang = $(this).val();
                    currUser.language = lang;
                    $("#root").html("");
                    firstLoaded = true;
                    LoadOntology(ontologyid);

                    $print.attr('href', href + '&language=' + lang);

                    reloadIbfieldbook($('ul#ibfieldbook'));
                });
            } catch(e) {
            }
            var $sel = $('select[name=language]')
            // try select default language
            $sel.val(DEFAULT_LANGUAGE)
        }

        var exists = $('select[name=language] option[value='+DEFAULT_LANGUAGE+']').length
        if(!exists) {
            // default language doesnt exist
            // set it to whatever it is
            DEFAULT_LANGUAGE = $('select[name=language]').val()
        }
    });
}

/**
 * Checks if this login user can edit this ontology
 * and shows appropriate stuff to edit it
 */
var Editable = (function(){
    var targetLi = null;

    function makeEditInput(id, parentId, last) {

        var li = $("<li class='editable_input'></li>");
        if(last)
            li.addClass("last");

        li.append('<input type="hidden" name="id" class="id" value="'+ontologyid+':'+id+'" />');
        li.append('<input type="hidden" name="parent" value="'+parentId+'" />');
        li.append('<input type="text" name="name" />');
        li.append('<ul style="display:none;"></ul>');

        return li;
    }
    function addTerm() {
        // make an ajax call to find an available ID for a new term of this ontology
        loader(targetLi, true);
        var currLi = targetLi;
        $.getJSON("/next-id", {ontology_id: ontologyid}, function(data) {
            var hitarea = currLi.find(".hitarea:first");
            if(hitarea.length) { // expand it
                hitarea.click();
            }

            var cont = currLi.find("ul:first");
            if(!cont.length) {// if it doesn't exist an inner UL, create one
                cont = $("<ul></ul>");
                currLi.append(cont);
            }

            var last = true;
            if(hitarea.length)
                last = false;
                
            var parentId = currLi.find("input.id:first").val();

            // the id is whatever the server returns PLUS all the editable_input
            var id = $(".editable_input:visible").length + data.id;
            var li = makeEditInput(id, parentId, last);
            cont.prepend(li);
            cont.show();
            loader(currLi, false);
        });
    }
    function showButtons(target) {
        targetLi = target;
        var el = $(".editable_add");
        var del = $(".editable_delete");

        var p = target.offset();

        var left = p.left + target.width() - 10,
            top = p.top + 3;

        el.css("top", top+"px");
        el.css("left", left+"px");
        del.css("top", top+"px");
        del.css("left", (left - 30) + "px");
        el.show();
        del.show();

    }
    function bindHoverEvents() {
        var currTarget;
        $(".treeview li").live("hover", function(e) {
            var target;
            if(e.target.nodeName != "LI") {
                target = $(e.target).parents("li:first"); 
            } else {
                target = $(e.target);
            }
            if(currTarget == target.get(0))
                return;

            showButtons(target); 

            currTarget = target.get(0);
            e.stopPropagation();
        });
        //$(".editable_root").show();

        // drag
        $(".cont .treeview li").draggable(".cont .treeview li a.minibutton", function(from, to) {
            var fromId = from.find(".id").val();
            var toId = to.siblings(".id").val();
            $.get("/add-parent?termId="+fromId+"&parentId="+toId, function() {
            });
        });
    }

    function unbindHoverEvents() {

        $(".treeview li").die("hover");

        $(".editable_add").hide();
        $(".editable_delete").hide();

        $(".editable_input").hide();

        //$(".treeview li").draggable().undraggable();

    }
    function editToggle(ontology){
        var $this = $(".edit-button");
        if($this.text() == "EDIT") {
            $this.addClass("editing");
            $this.text("EDITING");
            editBox(ontology);
            bindHoverEvents();
        } else {
            $this.removeClass("editing");
            $this.text("EDIT");
            editBox(false);
            unbindHoverEvents();
        }

    }
    function saveEdits() {
        var $editbox = $(".edit_box");

        $.post("/edit-ontology", {
            ontology_id: ontologyid,
            ontology_name: $editbox.find("[name=ontology_name]").val(),
            ontology_summary: $editbox.find("[name=ontology_summary]").val(),
            category: $editbox.find("[name=category]").val()

        }, function(data) {
            // now create the terms
            // for each input editable_input that is visible, it's a term
            //
            //
            $(".editable_input:visible").each(function() {
                var $this = $(this);
                var jsonTerm = {
                    ontology_id: ontologyid,
                    ontology_name: $("[name=ontology_name]").val(),
                    name: $this.find("input[name=name]:first").val(),
                    parent: $this.find("input[name=parent]:first").val(),
                    id: $this.find("input[name=id]:first").val()
                };

                if(jsonTerm.name) {
                    $.post("/create-term", {jsonTerm: JSON.stringify(jsonTerm)}, function(data) {
                        editToggle(false);

                        // transform this .editable_input into a button
                        var last = false;
                        if($this.hasClass("last")) last = true;
                        var o = { name: jsonTerm.name, id: jsonTerm.id};
                        var li = make_li(o, last);
                        $this.replaceWith(li);
                    });
                }
            });

        });

    }

    function deleteOntology(ontology) {
        if(!confirm("The ontology "+ontology.ontology_name+" with ID: "+ontology.ontology_id+" will be deleted along with all its terms. Are you sure you want to proceed?")) return;

        $.post("/delete-ontology", {ontologyId: ontology.ontology_id}, function(data) {
            window.location.pathname = "/";
        });

    }

    function editBox(ontology) {

        var $editbox = $(".edit_box");
        if(!ontology)
            return $editbox.hide();

        $editbox.show();

        $editbox.find("[name=category]").val(ontology.category);

        $editbox.find("[name=ontology_name]").val(ontology.ontology_name);
        $editbox.find("[name=ontology_summary]").val(ontology.ontology_summary);
    }

    function showUi(ontology) {
        var $editbutton = $(".edit-button");
        $editbutton.show();


        $editbutton.click(function(e) {
            editToggle(ontology); 
            e.preventDefault();
            e.stopPropagation();
        });

        $(".edit_box .cancel").click(function(e) {
            editToggle(ontology); 
            e.preventDefault();
            e.stopPropagation();
        });

        $(".edit_box .minibutton").click(function(e) {
            saveEdits();
            e.preventDefault();
            e.stopPropagation();
        });

        $(".editable_add").click(function(e) {
            addTerm();
            e.preventDefault();
            e.stopPropagation();
        });
        $(".editable_delete").click(function(e) {
            var termId = targetLi.find("input.id:first").val();
            e.preventDefault();
            e.stopPropagation();
        });

        $(".delete_ontology").click(function(e) {
            deleteOntology(ontology);
            e.preventDefault();
            e.stopPropagation();
        });

    }
    function init(ontologyId) {
        $.getJSON("/curruser-ontologies", function(data) {

            $.each(data, function(){
                if(this.ontology_id == ontologyId) {
                    // we own this ontology
                    showUi(this);

                }
            });
            
        });
    }

    return {
        init: init
    };
})();

var Term = (function(){

    function init(termId) {
        // get parents up till root
        $.getJSON("/get-term-parents/"+termId, function(data) {
          var $root = $("#root");
          for(var x=0; x<data.length; x++) {
              var fatherId = data[x].length > 1 ? data[x][data[x].length - 2]['id'] : data[x][data[x].length - 1]['id'];
            var parent = $root;
            var li;
            for(var i=0, len=data[x].length; i<(len-1); i++) {
                var el = data[x][i];
                el.has_children = true;
                /*
                if(i == (data[x].length-1))
                    el.has_children = false;
                    */

                li = make_li(el, true);
                parent.append(li);
                // parent becomes the first ul inside this li
                parent = li.find("ul:first");
                parent.show();
            }

            (function(x) {
              // get children of the parent of this term
              // to find out if there's embedded methods and scales
              $.getJSON('/get-children/' + fatherId, function(children) {
                var li;
                for(var i=0; i<children.length; i++) {
                    var el = children[i]; 
                    if(el.id === termId) {
                        li = make_li(el, true);
                        parent.append(li);
                        li.find(".hitarea").click();
                        break;
                    }
                }
                // great now laod the right sidebar with this current termId
                if(x === 0) {
                  load_term(li);
                }
              });
            })(x);
          }

        });
    }

    return {
        init: init
    };
})();

// XXX global
UserWidget = (function() {

    function show(userid) {
        Modal.show("user", function() {
            var that = this;
            this.load(true);

            /*
            if(currUser && currUser.userid === userid)
              this.curr.find(".profile").show();
            else
              this.curr.find(".profile").hide();
            */

            $.getJSON("/users/"+userid, function(user){
                // do replacement
                var curr = that.curr;
                curr.find("img.grav").attr("src", "http://www.gravatar.com/avatar/"+user.gravatar+".jpg?s=58");
                curr.find(".name").text(user.username);
                curr.show();
                    
                var cont = curr.find("ul li:first");

                // now get this users ontologies
                $.getJSON("/user-ontologies", {userid: userid}, function(ontologies) {
                    var res = curr.find(".result"),
                        clone = cont.clone();

                    res.html(""); // clear it out

                    $.each(ontologies, function() {
                        var onto = this;

                        clone.find(".box").attr("href", "/ontology/"+onto.ontology_id).text(onto.ontology_id);
                        clone.find(".name").text(onto.ontology_name);
                        clone.find(".summary").text(onto.ontology_summary);
                        clone.show();

                        res.append(clone.clone());

                    });

                    that.load(false);
                });


            });
        
        });
    }
    function showAll() {
        Modal.show("users", function() {
            var that = this;
            this.load(true);

            $.getJSON("/users", function(users){
                // do replacement
                var curr = that.curr;
                curr.show();

                var result = curr.find(".result");
                result.html("");

                var h2 = curr.find("h2:first");

                for(var i=0; i<users.length; i++) {
                    var c = h2.clone();
                    var user = users[i];
                    c.find("img.grav").attr("src", "http://www.gravatar.com/avatar/"+user.gravatar+".jpg?s=58");
                    c.find(".name").attr("userid", user.userid).text(user.username);
                    c.show();

                    result.append(c);
                }
                that.load(false);
            });
        
        });
    }
    return {
        show: show,
        showAll: showAll
    };
})();
 
$(document).ready(function(){
 
    Login(function(user) {
      if(user && ontologyid !== "")
          Editable.init(ontologyid);

      if(termid !== "") {
          Term.init(termid);
          expand_collapse();
      }

        /*
        $(".languages_refresh").find("option").each(function(){
            var $this = $(this);
            if($this.val() === currUser.language) {
                $this.attr('selected', 'selected');
            }
        });
        */
    });

    if(ontologyid !== "") {
        LoadOntology(ontologyid);
        // events
        expand_collapse();
    }


    /* assign some events for ui */
    events();
 
    /* global ajax setup thing */
    $.ajaxSetup({
        "success": function() {   
            $(".error").hide();
            $(".error_box").hide();
            term_loader(false);
        },
        "error": function(e, type, msg) {   
            term_loader(false);

            $(".error").show().first().text(msg);
            $(".error_box").show();
        },
        "cache": false
    });
 
});
 
})();
 

function fileupload_done(error) {
    if(error) {
        term_loader(false);
        $(".error").show().first().text(error);
        return;
    }
    var term_id = $("#term_id").text();
    term_loader(false);
    // great term was saved, let's reload this term
    // to reload the term re-using load_term(li) we need to find the li object
    var li = $("input.id[value=\""+term_id+"\"]").parent();
    load_term(li);

    bind_attributes_events();
}

