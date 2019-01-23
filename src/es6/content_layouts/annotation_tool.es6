/* jshint esversion: 6 */
"strict mode";

import data from "../../../src/es6/data.es6";
import page_annotation_tool from "../../../src/es6/pages/annotation_tool.es6";
import loader from "../../../src/es6/loader.es6";

var DATA = new data(),
    PAGE_ANNOTATION_TOOL = new page_annotation_tool(),
    LOADER = new loader();

// class layout_annotation_tool extends PAGE_ANNOTATION_TOOL {
    // layout() {
        // Place the external html page
        $("#contents").addClass("coloured grey lighten-5")
        .find(".container").append(
            $('<p>', {"class": ""}).text("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.")
        ).append(
            $('<div>', {"class": "card"}).append(
                $('<div>', {"class": "card-content"}).append(
                ).append(
                    $('<div>', {"id": "step_loader"})
                ).append(
                    $('<ul>', {"class": "stepper horizontal"}).append(
                        $('<li>', {"id": "step1", "class": "step active"}).append(
                            $('<div>', {
                                "data-step-label": "Step 1",
                                "class": "step-title waves-effect waves-dark"
                            }).text("Paste Excel")
                        ).append(
                            $('<div>', {"id": "annotation_tool", "class": "step-content"}).append(
                                $('<div>', {"class": "row"}).append(
                                    $('<div>', {"class": "col s12 m12 l12"}).append(
                                        $('<a>', {"href": "javascript:;", "id": "generate_btn", "class": "btn white highlight-text chip right z-depth-1 right"}).append(
                                            $('<i>', {"class": "icon material-icons"}).text("wrap_text")
                                        ).append(" Generate an example").click(() => {
                                            if(!$("#clipboard").val()) {
                                                $("#columns").val("A\tB\tC\tD\tE\tF\tG\tH\tI");

                                                DATA.get_annotation_tool_sample((data) => {
                                                    $("#clipboard").val(data);
                                                    $("#generate_btn").addClass("disabled");
                                                    $("#continue_btn").removeClass("disabled");
                                                    $(".step:not(.active) .step-title").removeClass("disabled");
                                                });
                                            }
                                        })
                                    ).append(
                                        $('<div>', {"class": "title_area"}).append(
                                            $('<span>', {"class": "fas fa-fw fa-3x fa-file-excel green-text left"})
                                        ).append(
                                            $('<h6>', {"class": "title"}).text("Upload an excel or copy the table into this section, then click to \"Continue\"")
                                            .append(
                                                $('<small>', {"class": "help-text"}).text("CropOntology templates will be detected automatically")
                                            )
                                        )
                                    )
                                )
                            ).append(
                                $('<div>', {"class": "row"}).append(
                                    $('<div>', {"class": "col s12 m12 l8"}).append(
                                        // Browse...
                                        $('<div>', {"class": "file-field input-field"}).append(
                                            $('<div>', {"class": "btn"}).append(
                                                $('<span>').text("Browse...")
                                            ).append(
                                                $('<input>', {"type": "file", "name": "xlfile"}).on("change", (e) => {
                                                    $("#generate_btn").addClass("disabled");
                                                    $("#continue_btn").removeClass("disabled");
                                                    $(".step:not(.active) .step-title").removeClass("disabled");
                                                    PAGE_ANNOTATION_TOOL.process_file(e.target.files);
                                                })
                                            )
                                        ).append(
                                            $('<div>', {"class": "file-path-wrapper"}).append(
                                                $('<input>', {"class": "file-path validate", "type": "text", "placeholder": "Select a file to upload"})
                                            )
                                        )
                                    )
                                ).append(
                                    $('<div>', {"class": "col s12 m12 l4"}).append(
                                        $('<h6>', {"class": "options help-text"}).text("Options")
                                    ).append(
                                        $('<p>').append(
                                            $('<input>', {"type": "checkbox", "class": "filled-in", "id": "first_line_contains_titles", "checked": "checked"})
                                        ).append(
                                            $('<label>', {"for": "first_line_contains_titles"}).text("The first line contains column titles")
                                        )
                                    ).append(
                                    )
                                )
                            ).append(
                                $('<div>', {"class": "row"}).append(
                                    $('<div>', {"class": "s12"}).append(
                                        $('<input>', {"type": "hidden", "id": "first_line"})
                                    ).append(
                                        $('<input>', {"type": "hidden", "id": "columns"}).val("A\tB\tC\tD\tE\tF\tG\tH\tI")
                                    )
                                ).append(
                                    $('<div>', {"class": "s12"}).append(
                                        $('<textarea>', {
                                            "rows": "20",
                                            "id": "clipboard",
                                            "placeholder": "Copy and paste Excel data here"
                                        }).on("input", () => {
                                            if($.trim($("#clipboard").val()) !== "") {
                                                $("#generate_btn").addClass("disabled");
                                                $("#continue_btn").removeClass("disabled");
                                                $(".step:not(.active) .step-title").removeClass("disabled");
                                            } else {
                                                $("#generate_btn").removeClass("disabled");
                                                $("#continue_btn").addClass("disabled");
                                                $(".step:not(.active) .step-title").addClass("disabled");
                                            }
                                        })
                                    ).append(
                                        $('<div>', {"id": "drop_area", "data-content": "Drag your file here"})
                                    )
                                )
                            ).append(
                                $('<div>', {"class": "row"}).append(
                                    $('<div>', {"class": "step-actions"}).append(
                                        $('<button>', {"id": "continue_btn", "class": "waves-effect waves-dark btn btn-highlight next-step right disabled"}).text("Continue")
                                    )
                                )
                            )
                        )
                    ).append(
                        $('<li>', {"id": "step2", "class": "step"}).append(
                            $('<div>', {
                                "data-step-label": "Step 2",
                                "class": "step-title waves-effect waves-dark disabled"
                            }).text("Manage data and export")
                        ).append(
                            $('<div>', {"class": "step-content"}).append(
                                $('<h5>').text("Choose your crop and select the cell in the table that you would like to annotate")
                            ).append(
                                $('<div>', {"id": "generator"}).append(
                                    $('<div>', {"class": "row"}).append(
                                    // $('<div>', {"class": "row valign-wrapper"}).append(
                                    //     $('<div>', {"class": "col s6"}).append(
                                    //         $('<select>', {"id": "crop", "class": "materialize-select"})
                                    //     )
                                    // ).append(
                                    //     $('<div>', {"class": "col s6"}).append(
                                    //         $('<a>', {"href": "javascript:;", "class": "btn highlight-btn btn-flat"}).click(() => {
                                    //             PAGE_ANNOTATION_TOOL.add_radio();
                                    //         }).text("Add radio buttons")
                                    //     )
                                    ).append(
                    					// Add fullscreen button
                    					// if($.fullscreen && $.fullscreen.isNativelySupported()) {
                							$('<a>', {
                								"href": "javascript:;",
                								"class": "btn btn-flat grey lighten-3 fullscreen tooltipped right",
                								"data-position": "left",
                								"data-tooltip": "Show fullscreen"
                							}).append(
                								$('<i>', {"class": "material-icons"}).text("fullscreen")
                                            ).click((e) => {
                								$("#result").fullscreen({
                									toggleClass: "fullscreen"
                								})
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
                                    )
                                ).append(
                                    $('<div>', {"class": "row"}).append(
                                        $('<div>', {"id": "result"})
                                    )
                                ).append(
                                    $('<div>', {"class": "row"}).append(
                                        $('<div>', {"class": "step-actions"}).append(
                                            $('<button>', {"class": "waves-effect waves-dark btn-flat previous-step"}).text("Back")
                                        ).append(
                                            $('<button>', {"class": "waves-effect waves-dark btn btn-highlight right"}).text("Download as CSV")
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );

        PAGE_ANNOTATION_TOOL.assign_events();
    // }
// }

// export default layout_annotation_tool;
