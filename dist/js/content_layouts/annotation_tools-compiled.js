"use strict";
/* jshint esversion: 6 */
"strict mode";

// Place the external html page

$("#contents").addClass("coloured grey lighten-5").find(".container").append($('<p>', { "class": "" }).text("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.")).append($('<div>', { "class": "card" }).append($('<div>', { "class": "card-content" }).append($('<ul>', { "class": "stepper horizontal" }).append($('<li>', { "id": "step1", "class": "step active" }).append($('<div>', {
    "data-step-label": "Step 1",
    "class": "step-title waves-effect waves-dark"
}).text("Paste Excel")).append($('<div>', { "id": "annotation_tool", "class": "step-content" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m12 l12" }).append($('<a>', { "href": "javascript:;", "id": "generate_btn", "class": "btn white highlight-text chip right z-depth-1 right" }).append($('<i>', { "class": "icon material-icons" }).text("wrap_text")).append(" Generate an example").click(function () {
    if (!$("#clipboard").val()) {
        DATA.get_annotation_tool_sample(function (data) {
            $("#clipboard").val(data);
            $("#generate_btn").addClass("disabled");
            $("#continue_btn").removeClass("disabled");
            $(".step:not(.active) .step-title").removeClass("disabled");
        });
    }
})).append($('<div>', { "class": "title_area" }).append($('<span>', { "class": "fas fa-fw fa-3x fa-file-excel green-text left" })).append($('<h6>', { "class": "title" }).text("Upload an excel or copy the table into this section, then click to \"Continue\"").append($('<small>', { "class": "help-text" }).text("CropOntology templates will be detected automatically")))))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m12 l8" }).append(
// Browse...
$('<div>', { "class": "file-field input-field" }).append($('<div>', { "class": "btn" }).append($('<span>').text("Browse...")).append($('<input>', { "type": "file", "name": "xlfile" }).on("change", function (e) {
    $("#generate_btn").addClass("disabled");
    $("#continue_btn").removeClass("disabled");
    $(".step:not(.active) .step-title").removeClass("disabled");
    undefined.process_file(e.target.files);
}))).append($('<div>', { "class": "file-path-wrapper" }).append($('<input>', { "class": "file-path validate", "type": "text", "placeholder": "Select a file to upload" }))))).append($('<div>', { "class": "col s12 m12 l4" }).append($('<h6>', { "class": "options help-text" }).text("Options")).append($('<p>').append($('<input>', { "type": "checkbox", "class": "filled-in", "id": "first_line_contains_titles" })).append($('<label>', { "for": "first_line_contains_titles" }).text("The first line contains column titles"))).append())).append($('<div>', { "class": "row" }).append($('<div>', { "class": "s12" }).append($('<textarea>', {
    "rows": "20",
    "id": "clipboard",
    "placeholder": "Copy and paste Excel data here"
}).on("input", function () {
    if ($.trim($("#clipboard").val()) !== "") {
        $("#generate_btn").addClass("disabled");
        $("#continue_btn").removeClass("disabled");
        $(".step:not(.active) .step-title").removeClass("disabled");
    } else {
        $("#generate_btn").removeClass("disabled");
        $("#continue_btn").addClass("disabled");
        $(".step:not(.active) .step-title").addClass("disabled");
    }
})).append($('<div>', { "id": "drop_area", "data-content": "Drag your file here" })))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "step-actions" }).append($('<button>', { "id": "continue_btn", "class": "waves-effect waves-dark btn btn-highlight next-step right" }).text("Continue")))))).append($('<li>', { "id": "step2", "class": "step" }).append($('<div>', {
    "data-step-label": "Step 2",
    "class": "step-title waves-effect waves-dark disabled"
}).text("Manage data and export")).append($('<div>', { "class": "step-content" }).append($('<h5>').text("Choose your crop and select the cell in the table that you would like to annotate")).append($('<div>', { "id": "generator" }).append($('<div>', { "class": "row valign-wrapper" }).append($('<div>', { "class": "col s6" }).append($('<select>', { "id": "crop", "class": "materialize-select" }))).append($('<div>', { "class": "col s6" }).append($('<a>', { "href": "javascript:;", "class": "btn highlight-btn btn-flat" }).click(function () {
    PAGE_ANNOTATION_TOOL.add_radio();
}).text("Add radio buttons")))).append($('<div>', { "class": "row" }).append($('<div>', { "id": "result" }))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "step-actions" }).append($('<button>', { "class": "waves-effect waves-dark btn-flat previous-step" }).text("Back")).append($('<button>', { "class": "waves-effect waves-dark btn btn-highlight right" }).text("Download as CSV"))))))))));

PAGE_ANNOTATION_TOOL.assign_events();
