"use strict";
/* jshint esversion: 6 */
"strict mode";

var _data = require("../../../src/es6/data.es6");

var _data2 = _interopRequireDefault(_data);

var _loader = require("../../../src/es6/loader.es6");

var _loader2 = _interopRequireDefault(_loader);

var _modals = require("../../../src/es6/modals.es6");

var _modals2 = _interopRequireDefault(_modals);

var _annotation_tool = require("../../../src/es6/pages/annotation_tool.es6");

var _annotation_tool2 = _interopRequireDefault(_annotation_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATA = new _data2.default(),
    PAGE_ANNOTATION_TOOL = new _annotation_tool2.default(),
    MODALS = new _modals2.default(),
    LOADER = new _loader2.default();

// class layout_annotation_tool extends PAGE_ANNOTATION_TOOL {
// layout() {
// Place the external html page
$("#contents").addClass("coloured grey lighten-5").find(".container").append($('<p>', { "class": "" }).text("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.")).append($('<div>', { "class": "card" }).append($('<div>', { "class": "card-content" }).append().append($('<div>', { "id": "step_loader" })).append($('<ul>', { "class": "stepper horizontal" }).append($('<li>', { "id": "step1", "class": "step active" }).append($('<div>', {
    "data-step-label": "Step 1",
    "class": "step-title waves-effect waves-dark"
}).text("Paste Excel")).append($('<div>', { "id": "annotation_tool", "class": "step-content" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m12 l12" }).append($('<div>', { "class": "title_area" }).append($('<span>', { "class": "fas fa-fw fa-3x fa-file-excel green-text left" })).append($('<h6>', { "class": "title" }).text("Paste data separated by tab or upload a spreadsheet file").append($('<small>', { "class": "help-text" }).html('It uses SheetJS Library that supports <tt>.xlsx</tt>, <tt>.ods</tt>, <tt>.csv</tt> and <a href="http://sheetjs.com/status/" target="_blank" rel="external">much more...</a><br />CropOntology templates will be detected automatically.<br />Download the <a href="http://www.cropontology.org/TD_template_v5.xls">Trait Dictionary template (v5)</a>')))))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m12 l8" }).append(
// Browse...
$('<div>', { "id": "upload_btn", "class": "file-field input-field" }).append($('<div>', { "class": "btn" }).append($('<span>').text("Browse...")).append($('<input>', { "type": "file", "name": "xlfile" }).on("change", function (e) {
    $("#generate_btn").addClass("disabled");
    $("#continue_btn").removeClass("disabled");
    $(".step:not(.active) .step-title").removeClass("disabled");
    PAGE_ANNOTATION_TOOL.process_file(e.target.files);
}))).append($('<div>', { "class": "file-path-wrapper" }).append($('<input>', { "class": "file-path validate", "type": "text", "placeholder": "Select a file to upload" }))))).append($('<div>', { "class": "col s12 m12 l4" }).append($('<h6>', { "class": "options help-text" }).text("Options")).append($('<p>').append($('<input>', { "type": "checkbox", "class": "filled-in", "id": "first_line_contains_titles", "checked": "checked" })).append($('<label>', { "for": "first_line_contains_titles" }).text("The first line contains column titles"))).append())).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12" }).append($('<input>', { "type": "hidden", "id": "first_line" })).append($('<input>', { "type": "hidden", "id": "columns" }).val("A\tB\tC\tD\tE\tF\tG\tH\tI"))).append($('<div>', { "class": "col s12" }).append($('<textarea>', {
    "rows": "20",
    "id": "clipboard",
    "placeholder": "Paste Excel data here"
}).on("input", function () {
    if ($.trim($("#clipboard").val()) !== "") {
        $("#generate_btn").addClass("disabled");
        $("#continue_btn").removeClass("disabled");
        $(".step:not(.active) .step-title").removeClass("disabled");
    } else {
        $("#first_line").val("");
        $("#columns").val("");
        $("#generate_btn").removeClass("disabled");
        $("#continue_btn").addClass("disabled");
        $(".step:not(.active) .step-title").addClass("disabled");
    }
})).append($('<div>', { "id": "drop_area", "data-content": "Drag your file here" })))).append($('<div>', { "class": "" }).append($('<div>', { "class": "step-actions" }).append($('<a>', { "href": "javascript:;", "id": "generate_btn", "class": "btn white highlight-text z-depth-1 left" }).append($('<i>', { "class": "material-icons left" }).text("wrap_text")).append(" Generate an example").click(function () {
    if (!$("#clipboard").val()) {
        $("#columns").val("A\tB\tC\tD\tE\tF\tG\tH\tI");

        DATA.get_annotation_tool_sample(function (data) {
            $("#clipboard").val(data);
            $("#generate_btn").addClass("disabled");
            $("#continue_btn").removeClass("disabled");
            $(".step:not(.active) .step-title").removeClass("disabled");
        });
    }
})).append($('<button>', { "id": "continue_btn", "class": "waves-effect waves-dark btn btn-highlight next-step right disabled" }).text("Continue")))))).append($('<li>', { "id": "step2", "class": "step" }).append($('<div>', {
    "data-step-label": "Step 2",
    "class": "step-title waves-effect waves-dark disabled"
}).text("Manage data and export")).append($('<div>', { "class": "step-content" }).append($('<div>', { "class": "title_area" }).append($('<h5>').text("Choose your crop and select the cell in the table that you would like to annotate"))).append($('<div>', { "id": "generator" }).append($('<div>', { "class": "row" }).append().append(
// Add fullscreen button
// if($.fullscreen && $.fullscreen.isNativelySupported()) {
$('<a>', {
    "href": "javascript:;",
    "class": "btn btn-flat grey lighten-3 fullscreen tooltipped right",
    "data-position": "left",
    "data-tooltip": "Show fullscreen"
}).append($('<i>', { "class": "material-icons" }).text("fullscreen")).click(function (e) {
    $("#result").fullscreen({
        toggleClass: "fullscreen"
    });
    $(".btn.fullscreen").blur();
    // $("#graph_content svg").attr("width", parseInt($(document).width()));
    // $("#graph_content svg").attr("height", parseInt($(document).height()));
    // renderer.width = parseInt($(document).width());
    // renderer.height = parseInt($(document).height());
    // renderer.r.width = parseInt($(document).width());
    // renderer.r.height = parseInt($(document).height());
    // console.log(renderer);
    // 	var renderer = new Graph.Renderer.Raphael(
    // 		"graph_content",
    // 		g,
    // 		parseInt($(document).width() - 100),
    // 		parseInt($(document).height() - 100)
    // 	);
    // renderer.draw();
    // }, 10);
}).tooltip()
// }
)).append($('<div>', { "class": "" }).append($('<div>', { "id": "result" }).append(
// Sidenav fire button
$('<a>', {
    "href": "javascript:;", "id": "annotation_tool_sidenav_btn",
    "data-activates": "annotation_tool_data",
    "class": "button-collapse"
})).append(
// Sidenav
$('<ul>', { "id": "annotation_tool_data", "class": "side-nav" }).append($('<li>', { "class": "row-control" }).append($('<a>', { "href": "javascript:;" }).append($('<i>', { "class": "material-icons" }).text("close")).append("Close").click(function () {
    $(".button-collapse").sideNav("hide");
})))))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "step-actions" }).append($('<button>', { "class": "waves-effect waves-dark btn-flat previous-step" }).append($('<span>', { "class": "show-on-medium-and-up hide-on-small-only" }).text("Back")).append($('<span>', { "class": "show-on-small hide-on-med-and-up fa fa-chevron-left" }))).append($('<button>', { "class": "waves-effect waves-dark btn btn-highlight right" }).append($('<span>', { "class": "show-on-medium-and-up hide-on-small-only" }).text("Download as CSV")).append($('<span>', { "class": "show-on-small hide-on-med-and-up" }).text("Download")))))))))));

PAGE_ANNOTATION_TOOL.assign_events();
// }
// }

// export default layout_annotation_tool;
