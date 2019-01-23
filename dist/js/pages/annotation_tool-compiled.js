"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../data.es6");

var _data2 = _interopRequireDefault(_data);

var _str = require("../../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

var _loader = require("../../../src/es6/loader.es6");

var _loader2 = _interopRequireDefault(_loader);

var _sideNavs = require("../../../src/es6/side-navs.es6");

var _sideNavs2 = _interopRequireDefault(_sideNavs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA = new _data2.default(),
    STR = new _str2.default(),
    LOADER = new _loader2.default(),
    SIDE_NAV = new _sideNavs2.default();

/**
* simple module that generates CSV from DOM stuff - requires jquery
* copyright - Luca Matteis
*/
// var csvGenerator = (() => {
// converts a DOM table into csv
//     function fromTable(domTable) {
//         var table = $(domTable),
//         csv = "",
//         trs = table.find("tr");
//         trs.each(function(){
//             var cells = $(this).find("td");
//             cells.each(function(i){
//                 var text = $(this).text();
//                 text = text.replace(/\"/g, '\\"');
//                 text = '"' + text + '"';
//                 csv += (i==0 ? "" :",") + text;
//             });
//             csv += "\n";
//         });
//         return csv;
//     }
//     return {
//         fromTable: fromTable
//     };
// })(),
var TOKENS = {};

var annotation_tool = function () {
    function annotation_tool() {
        _classCallCheck(this, annotation_tool);
    }

    _createClass(annotation_tool, [{
        key: "assign_events",
        value: function assign_events() {
            var _this = this;

            // $("#clipboard").keyup(this.generate());

            // $("#terminize").click(() => {
            //     this.terminize(this, $("#clipboard").val());
            // });

            // $("#sample").click((e) => {
            //     $("#clipboard").val($(".sample").html());
            //     this.generate();
            //
            //     e.preventDefault();
            //     e.stopPropagation();
            // });
            // $("#download").click(function() {
            //     let csv = csvGenerator.fromTable($("#newspaper-b").get(0)),
            //     $form = $('<form>', {
            //         "style": "display: none;",
            //         "method": "post",
            //         "action": "http://www.cropontology.org/csv-download"
            //     }),
            //     $input = $('<input>', {"type": "hidden", "name": "csvString"});
            //
            //     $input.val(csv);
            //
            //     $form.append($input);
            //     $(document.body).append($form);
            //     form.submit();
            //     form.remove();
            // });

            // annotation
            // $("table tr td").live("click", (e) => {
            //     let $this = $(this);
            //     $("table tr td").each(() => {
            //         $(this).removeClass("selected");
            //     });
            //
            //     $this.addClass("selected");
            //
            //     widget.show($this.get(0));
            //     widget.run();
            // });

            // row column selection
            // let val = "row";
            // $("#selection").change(function() {
            //     val = $(this).val();
            // });

            /**
             * Load all crops (ontologies)
             * The interested Ontology is the first one (300-499 Phenotype and Trait Ontology)
             * @see https://github.com/bioversity/Crop-Ontology/blob/appengine_plus_dev/skins/annotation-tool.html#L292-L304
             */
            DATA.get_ontologies().then(function (data) {
                $("#crop").append($('<option>', { "value": "All Crops" }).text("Filter by crop"));
                $.each(data[0].ontologies, function (k, term) {
                    $("#crop").append($('<option>', { "value": term.ontology_id }).text(term.ontology_name));
                });
                $("#crop").on("change", function (e) {
                    _this.set_ontology($(e.target).val());
                }).material_select();

                $("#continue_btn, #step2").on("click", function () {
                    _this.generate($("#clipboard").val(), $("#first_line").val(), $("#columns").val());
                });
            });
            // hover
            // let selclass = "selected";
            // $("#newspaper-b").live("mouseout", function() {
            //     $("." + selclass).removeClass(selclass);
            // });
            // $("#newspaper-b tbody tr td").live("hover", () => {
            //     let $this = $(this);
            //
            //     $("." + selclass).removeClass(selclass);
            //     $this.addClass(selclass);
            //
            //     if(val == "row") {
            //         $this.siblings().addClass(selclass);
            //     } else if (val == "column") {
            //         // to find columns it's a bit more complex <-- USEFUL COMMENT! COMPLEXITY GIVES ME MOTIVATION
            //         let idx = $this.index() + 1;
            //         $("#newspaper-b tbody tr td:nth-child(" + idx + ")").addClass(selclass);
            //     }
            // });
            //
            // let keepclass = "keep";
            // $("#newspaper-b tbody tr td").live("click", () => {
            //     let $this = $(this);
            //     $("." + keepclass).removeClass(keepclass);
            //     $("." + selclass).each(() => {
            //         $(this).addClass(keepclass);
            //     });
            // });
        }
    }, {
        key: "parse_clipboard",
        value: function parse_clipboard(content) {
            var rows = content.split("\n"),
                result = []; // array of arrays

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row) {
                    var cells = row.split("\t"); // tab delimited columns
                    result.push(cells);
                }
            }
            return result;
        }

        /**
         * The 'result' parameter is an array of arrays
         * rapresenting the excel copied cells
         */

    }, {
        key: "display_parsed_clipboard",
        value: function display_parsed_clipboard(result, first_line, columns) {
            var $container = $("#result"),
                $table = $('<table>', {
                "class": "bordered highlight responsive-table",
                "id": "newspaper-b"
            }),
                $thead = $("<thead>"),
                $tbody = $('<tbody>'),
                $tfoot = $("<tfoot>"),
                $columns_tr = $('<tr>'),
                $first_tr = $('<tr>');

            // Columns
            if (columns) {
                $columns_tr.prepend($('<th>', { "class": "empty" }));
                $.each(columns.split("\t"), function (k, v) {
                    $columns_tr.append($('<th>').text(v));
                });

                // Excel columns (eg. "A", "B", "C", ...)
                $thead.append($columns_tr);
                $tfoot.append($columns_tr.clone());
            }
            // First line
            if (first_line) {
                $first_tr.prepend($('<th>', { "class": "empty" }));
                $.each(first_line.split("\t"), function (k, v) {
                    $first_tr.append($('<th>').text(v));
                });
                $tbody.prepend($first_tr);
            }

            // Data table
            $.each(result, function (k, row) {
                var $row_tr = $('<tr>');
                if (k % 2) {
                    $row_tr.addClass("odd");
                } else {
                    $row_tr.addClass("even");
                }

                // Row number
                $row_tr.prepend($('<th>', { "class": "empty" }).text(k + 1));

                // Tabled data
                $.each(row, function (kk, cell) {
                    var titles = first_line.split("\t");

                    // console.warn(titles);
                    // console.info(kk, cell);
                    // console.log(titles[kk], cell);
                    var regex = /^([\w\d\_]+){6}\:([\d]+){6}$/;

                    $row_tr.append($('<td>', {
                        "class": "cell_data button-collapse " + (!cell || STR.is_term_id(cell) ? "disabled" : ""),
                        "data-activates": "annotation_tool_data",
                        "data-item": STR.is_term_id(cell)
                    }).html(cell).click(function (e) {
                        if (cell && !STR.is_term_id(cell)) {
                            LOADER.create({ type: "circular", size: "small", target: "#step_loader" });
                            $("#step_loader").css("visibility", "visible").animate({ "opacity": "1" }, 300);

                            DATA.search(cell.replace(/[^\w\d\s]+/g, "")).then(function (search_results) {
                                if (search_results.length > 0) {
                                    $("#annotation_tool_data").html($('<li>').append($('<div>', { "class": "user-view" }).append($('<div>', { "class": "subheader" }).text("Search results for \"" + cell + "\"")))).append($('<li>').append($('<div>', { "class": "divider" })));
                                    $.each(search_results, function (k, v) {
                                        $("#annotation_tool_data").append($('<li>').append($('<a>', {
                                            "class": "waves-effect local truncate",
                                            "href": "javascript:;",
                                            "data-tooltip": "See details"
                                        }).text(v.ontology_name + " - " + STR.get_ontology_term(v.name)).click(function (e) {
                                            e.preventDefault();

                                            if ($(e.target).closest("li").last().find("dl").length == 0) {
                                                DATA.get_ontology_attributes(v.id).then(function (data) {
                                                    $(e.target).closest("li").last().append($('<dl>').append($.map(data, function (v, k) {
                                                        return $('<div>').append($('<dt>').text(STR.ucfirst(k) + ":")).append($('<dd>').text(v)).html();
                                                    })));
                                                    $(e.target).closest("li").last().find("dl").slideDown();
                                                });
                                            }
                                            $(e.target).closest("li").last().find("dl").slideToggle();
                                            return false;
                                        }).tooltip({ delay: 0, position: "top" })).append($('<a>', {
                                            "class": "waves-effect tooltipped link",
                                            "href": "./terms/" + v.id + ":" + STR.get_ontology_term(v.name),
                                            "data-tooltip": "Go to term page"
                                        }).append($('<span>', { "class": "fa fa-chevron-right" })).tooltip({ delay: 0, position: "left" })));
                                    });
                                    $("#annotation_tool_sidenav_btn").sideNav("show");
                                }
                                $("#step_loader").animate({ "opacity": "0" }, 300, function () {
                                    $("#step_loader").css("visibility", "hidden");
                                });
                            });
                        }
                    }));
                });
                $tbody.append($row_tr);
            });

            $table.append($thead);
            $table.append($tbody);
            $table.append($tfoot);
            $container.html($table);

            SIDE_NAV.build_side_nav({
                id: "annotation_tool_data",
                button_id: "annotation_tool_sidenav_btn",
                content: "",
                target: "#result",
                position: "right"
            });
        }

        // makeToken(content) {
        //     return $('<div>').append($('<b>', {"class": "token"}).html(content)).html();
        // }
        //
        // doReplace(text, key) {
        //     text = text.replace(new RegExp("\\b" + key + "\\b", "g"), this.makeToken(key));
        //     // search also for underscores
        //     var underscores = key.replace(new RegExp(" ", "g"), "_");
        //     if(underscores.indexOf("_") >= 0) {
        //         text = text.replace(new RegExp("\\b"+underscores+"\\b", "g"), this.makeToken(underscores));
        //     }
        //     return text;
        // }
        //
        // getOntologyId(matchedTerm) {
        //     let jMatchedTerm = $(matchedTerm),
        //         itemId = jMatchedTerm.find("OmixedItemID").text(),
        //         ontologyId = itemId.split("/")[2];
        //
        //     ontologyId = ontologyId.split(" ")[0];
        //
        //     return ontologyId;
        // }

    }, {
        key: "xw",
        value: function xw(data, cb) {
            var worker = new Worker(XW.worker);
            worker.onmessage = function (e) {
                switch (e.data.t) {
                    case 'ready':
                        break;
                    case 'e':
                        console.error(e.data.d);break;
                    case XW.msg:
                        cb(JSON.parse(e.data.d));break;
                }
            };
            worker.postMessage({ d: data, b: rABS ? 'binary' : 'array' });
        }
    }, {
        key: "process_file",
        value: function process_file(file) {
            var X = XLSX;
            var XW = {
                /* worker message */
                msg: 'xlsx',
                /* worker scripts */
                worker: './xlsxworker.js'
            };

            // var OUT = $("#clipboard");
            // var HTMLOUT = $("#clipboard");

            /**
             * Get the file extension based on the Mime type
             */
            var get_extension = function get_extension() {
                return Mimoza.getExtension(file[0].type);
            };

            // JSON
            var to_json = function to_json(workbook) {
                var result = {},
                    res = {},
                    data = {};
                $.each(workbook.SheetNames, function (sheetNumber, sheetName) {
                    // console.warn(Object.keys(workbook.Sheets[sheetName]));
                    var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, range: 0, defval: "" });

                    if (roa.length) result[sheetName] = {
                        columns: Object.keys(workbook.Sheets[sheetName]),
                        rows: roa
                    };
                });
                return JSON.stringify(result, 2, 2);
            };
            // CSV
            var to_csv = function to_csv(text) {
                return Papa.parse(text);

                // var result = [];
                // workbook.SheetNames.forEach((sheetName) => {
                // 	// if(sheetName == "Template for submission") {
                // 		var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                // 		if(csv.length){
                // 			result.push("SHEET: " + sheetName);
                // 			result.push("");
                // 			result.push(csv);
                // 		}
                // 	// }
                // });
                // return result.join("\n");
            };
            // Functions
            // var to_fmla = function to_fmla(workbook) {
            // 	var result = [];
            // 	workbook.SheetNames.forEach(function(sheetName) {
            // 		// if(sheetName == "Template for submission") {
            // 			var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
            // 			if(formulae.length){
            // 				result.push("SHEET: " + sheetName);
            // 				result.push("");
            // 				result.push(formulae.join("\n"));
            // 			}
            // 		// }
            // 	});
            // 	return result.join("\n");
            // };
            // HTML
            // var to_html = function to_html(workbook) {
            // 	// if(sheetName == "Template for submission") {
            // 		HTMLOUT.innerHTML = "";
            // 		workbook.SheetNames.forEach(function(sheetName) {
            // 			var htmlstr = X.write(workbook, {sheet:sheetName, type:'string', bookType:'html'});
            // 			HTMLOUT.innerHTML += htmlstr;
            // 		});
            // 		return "";
            // 	// }
            // };
            // XML
            var to_table = function to_table(workbook) {
                var data = JSON.parse(to_json(workbook)),
                    cols = [],
                    columns = "",
                    first_line = "",
                    clipboard = "";
                $.each(data, function (sheetName, sheetTable) {
                    // Check whether the file is a Crop Ontology template
                    if (data.hasOwnProperty("Template for submission")) {
                        if (sheetName == "Template for submission") {
                            // Parse and clean Excel columns
                            // (eg. "A", "B", "C", ...)
                            $.each(sheetTable.columns, function (k, v) {
                                if (v.match(/[a-zA-Z]+([1])$/) !== null) {
                                    cols.push(v.replace(/\d/, ""));
                                }
                            });
                            columns = cols.filter(function (el, i, a) {
                                return i === a.indexOf(el);
                            }).join("\t");

                            $.each(sheetTable.rows, function (row_number, row_data) {
                                var items = [],
                                    column_title = [];

                                // console.log(row_number, row_data);
                                $.each(row_data, function (index, item) {
                                    item = !item ? "" : $.trim(item);
                                    column_title.push(index);
                                    items.push(item);
                                });

                                if ($("#first_line_contains_titles").is(":checked")) {
                                    if (row_number == 0) {
                                        first_line = items.join("\t") + "\n";
                                    } else {
                                        clipboard += items.join("\t") + "\n";
                                    }
                                } else {
                                    first_line = column_title.join("\t") + "\n";
                                    clipboard += items.join("\t") + "\n";
                                }
                            });
                            return false;
                        }
                    } else {
                        $.each(sheetTable.rows, function (row_number, row_data) {
                            var items = row_data.map(function (item, index) {
                                return $.trim(item) == "" ? "" : $.trim(item);
                            });

                            clipboard += items.join("\t") + "\n";
                        });
                    }
                });
                // if(sheetName == "Template for submission") {
                // workbook.SheetNames.forEach(function(sheetName) {
                // 	var htmlstr = X.write(workbook, {sheet:sheetName, type:'string', bookType:'html'});
                // 	HTMLOUT.innerHTML += htmlstr;
                // });
                // return "";
                // }
                return {
                    first_line: first_line,
                    columns: columns,
                    clipboard: clipboard
                };
            };

            var process_wb = function process_wb(wb) {
                var output = void 0;

                if (typeof wb == "string" && get_extension() == ".txt") {
                    $("#columns").val("");
                    $("#clipboard").val(wb);
                } else {
                    if (get_extension() == ".csv") {
                        var json_data = to_csv(wb),
                            first_line_contains_titles = $("#first_line_contains_titles").is(":checked");

                        output = json_data.data.map(function (v, k) {
                            if (first_line_contains_titles) {
                                if (k == 0) {
                                    $("#first_line").val(v.join("\t"));
                                } else {
                                    return v.join("\t");
                                }
                            } else {
                                return v.join("\t");
                            }
                        });
                        if (first_line_contains_titles) {
                            output.shift();
                        }
                        output = output.join("\n");

                        $("#clipboard").val(output);
                    } else {
                        output = to_table(wb);

                        $("#columns").val(output.columns);
                        $("#first_line").val(output.first_line);
                        $("#clipboard").val(output.clipboard);
                    }
                }
                $("#step2 .step-title, #continue_btn").removeClass("disabled");
                $("#continue_btn").click();
                $("#drop_area").fadeOut();
            };

            console.info("Parsing file...", file[0].name);
            $("#drop_area").attr("data-content", "Parsing\n" + file[0].name + "...");

            var rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString;
            var use_worker = typeof Worker !== 'undefined';

            var xw = function xw(data, cb) {
                var worker = new Worker(XW.worker);
                worker.onmessage = function (e) {
                    switch (e.data.t) {
                        case "ready":
                            break;
                        case "e":
                            console.error(e.data.d);break;
                        case XW.msg:
                            cb(JSON.parse(e.data.d));break;
                    }
                };
                worker.postMessage({ d: data, b: rABS ? 'binary' : 'array' });
            };

            rABS = true;
            use_worker = false;
            var f = file[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                // if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
                var data = e.target.result;
                if (!rABS) data = new Uint8Array(data);

                if (Mimoza.isText(file[0].type)) {
                    // if(get_extension() == ".txt") {
                    process_wb(data);
                    // } else if(get_extension() == ".csv") {
                    //     console.log(data);
                    //     var wb = X.read(data, {type:"binary"});
                    //     // var js = X.utils.sheet_to_json(wb.Sheets.Sheet1, {header:1, raw:true});
                    // }
                } else {
                    if (use_worker) {
                        xw(data, process_wb);
                    } else {
                        process_wb(X.read(data, { type: rABS ? 'binary' : 'array' }));
                    }
                }
            };
            if (rABS) {
                reader.readAsBinaryString(f);
            } else {
                reader.readAsArrayBuffer(f);
            }
        }
        // terminize(elem, text) {
        //     let jel = $(elem),
        //         old = jel.val();
        //
        //     jel.val("Loading...");
        //
        //     $.ajax({
        //         url: "/",
        //         data: {
        //             sourceText: $("#clipboard").val()
        //         },
        //         type: "POST",
        //         dataType: "xml",
        //         success: function(xml){
        //             let jxml = $(xml),
        //                 foundTokens = jxml.find("TokenIndices"),
        //                 clipTxt = $("#clipboard").val(),
        //                 res = {};
        //
        //             foundTokens.each((i) => {
        //                 let el = $(this),
        //                     matchedTerm = el.parent().get(0),
        //                     tokenIndexes = el.text().split(","),
        //                     text = "";
        //
        //                 for(let i = 0; i < tokenIndexes.length; i++) {
        //                     let foundTerm = jxml.find("Token[index="+tokenIndexes[i]+"]");
        //                     // separate by space
        //                     text += foundTerm.text() + " ";
        //                 }
        //                 text = $.trim(text);
        //
        //                 if(!res[text]) { // doesn't exist, just add it as a single array
        //                     res[text] = [{
        //                         ontologyId: this.getOntologyId(matchedTerm),
        //                         domMatchedTerm: matchedTerm
        //                     }];
        //                 } else { // exists - push it inside only if it comes from a different ontology from the ones already inside
        //                     let ontologyId = this.getOntologyId(matchedTerm);
        //                     // check if it exists
        //                     let found = false;
        //                     for(let i = 0; i < res[text].length; i++) {
        //                         if(res[text][i].ontologyId == ontologyId) {
        //                             found = true;
        //                             break;
        //                         }
        //                     }
        //                     if(!found) {
        //                         res[text].push({
        //                             ontologyId: ontologyId,
        //                             domMatchedTerm: matchedTerm
        //                         });
        //                     }
        //                 }
        //             });
        //
        //             // res contains an array of matched terms elements
        //             for(let i of res) {
        //                 clipTxt = this.doReplace(clipTxt, i);
        //             }
        //
        //             TOKENS = res;
        //
        //             let result = this.parse_clipboard(clipTxt);
        //             this.showParsedClipboard(result);
        //             this.doPoshytip();
        //             jel.val(old);
        //         }
        //     });
        // }

    }, {
        key: "generate",
        value: function generate(input, first_line, columns) {
            if (input && typeof input == "string") {
                var result = this.parse_clipboard(input);
                this.display_parsed_clipboard(result, first_line, columns);
            } else if (input && (typeof input === "undefined" ? "undefined" : _typeof(input)) == "object") {}
        }

        // doPoshytip() {
        //     let currentHoveredDomTerm = false;
        //
        //     $(".token").each(() => {
        //         let $this = $(this),
        //             foundTerms,
        //             title = "",
        //             text = $this.text().replace(new RegExp("_", "g"), " ");
        //
        //         if(foundTerms == TOKENS[text])  {
        //             title = foundTerms.length == 1 ? "Choose this term:" : "Choose one of these " + foundTerms.length + " terms:";
        //             for(var i = 0; i < foundTerms.length; i++) {
        //                 let matchedTerm = $(foundTerms[i].domMatchedTerm),
        //                     term = matchedTerm.find("OmixedItemID").text().split("/"),
        //                     definition = matchedTerm.find("Definition").text() || "no definition found",
        //                     id = matchedTerm.find("Accession").text();
        //
        //                 term = term[term.length - 1];
        //                 title += [
        //                     $('<div>').append(
        //                         $('<table>', {"class": "tip_table"}).append(
        //                             $('<tr>').append(
        //                                 $('<td>', {"class": "key"}).text("Term")
        //                             ).append(
        //                                 $('<td>').text(term)
        //                             )
        //                         ).append(
        //                             $('<tr>').append(
        //                                 $('<td>', {"class": "key"}).text("ID")
        //                             ).append(
        //                                 $('<td>').text(id)
        //                             )
        //                         ).append(
        //                             $('<tr>').append(
        //                                 $('<td>', {"class": "key"}).text("Definition")
        //                             ).append(
        //                                 $('<td>').text(definition)
        //                             )
        //                         ).append(
        //                             $('<tr>').append(
        //                                 $('<td>', {"class": "key"}).text("Actions")
        //                             ).append(
        //                                 $('<td>').append(
        //                                     $('<input>', {
        //                                         "term_name": term,
        //                                         "term_id": id,
        //                                         "class": "use",
        //                                         "type": "button",
        //                                         "value": "Use"
        //                                     })
        //                                 ).append(
        //                                     $('<input>', {
        //                                         "term_name": term,
        //                                         "term_id": id,
        //                                         "class": "use",
        //                                         "type": "button",
        //                                         "value": "Use for all"
        //                                     })
        //                                 )
        //                             )
        //                         )
        //                     )
        //                 ].join("");
        //             }
        //
        //             $this.attr("title", title);
        //         }
        //     });
        //
        //     // using live because the "use" button gets created before we
        //     // assing this event
        //     $(".use").live("click", () => {
        //         let $this = $(this),
        //             termId = $this.attr("term_id"),
        //             termName = $this.attr("term_name"),
        //             curr = $(currentHoveredDomTerm),
        //             original_text = curr.text(),
        //             new_text = termName + " (" + termId + ")";
        //
        //         curr.text(new_text);
        //         if($this.val() == "Use for all") {
        //             $("#indexlist td b").each(() => {
        //                 let $this = $(this);
        //                 if($this.text() == original_text)
        //                     $this.text(new_text);
        //             });
        //         }
        //     });
        //     $(".token").poshytip({
        //         className: 'tip_form',
        //         showTimeout: 1,
        //         alignTo: 'target',
        //         alignX: 'center',
        //         offsetY: 5,
        //         allowTipHover: true,
        //         fade: false,
        //         slide: false
        //     }).hover(() => {
        //         currentHoveredDomTerm = this;
        //     });
        // }

        // set_ontology(onto) {
        //     return onto;
        // }

        // getOntology() {
        //     return ontology;
        // }

        // annotation_column(num, onto) {
        //     let table =$("table#newspaper-b tr"),
        //         count = 1;
        //
        //     $("table#newspaper-b tr").each(function(el){
        //         let $tr = $(this),
        //             td = $tr.children("td"),
        //             currentValue = $(td[num]).context.textContent;
        //
        //         $.getJSON("/search?q=" + currentValue, (data) => {
        //             let arrayApp = [];
        //             for(let j = 0; j < data.length; j++){
        //                 if(onto=="All Crops") {
        //                     arrayApp.push(data[j]);
        //                 } else if(data[j].ontology_name == onto) {
        //                     arrayApp.push(data[j]);
        //                 }
        //             }
        //             if(el > 0) {
        //                 if(arrayApp.length==1) {
        //                     $(td[num]).append('<p style="color:green" class="elementID">{'+arrayApp[0].id+'}</p>');
        //                 }
        //                 if(arrayApp.length==0) {
        //                     $(td[num]).append('<p style="color:red">nope</p>');
        //                 }
        //                 if(arrayApp.length>1) {
        //                     $(td[num]).append(implode(arrayApp));
        //                 }
        //             }
        //         }).complete(() => {
        //             if(count == $("table#newspaper-b tr").length) {
        //                 $('#loaderImg').remove();
        //             }
        //             count++;
        //         });
        //     });
        // }

        // annotationRow(num, onto) {
        //     let table =$("table#newspaper-b tr"),
        //         tr = $(table[num]),
        //         tds = tr.children("td"),
        //         count = 1;
        //
        //     $(tds).each((el) => {
        //         let currentValue = $(this).context.textContent;
        //
        //         $.getJSON("/search?q=" + currentValue, (data) => {
        //             let arrayApp = [];
        //             for(var j = 0; j < data.length; j++){
        //                 if(onto == "All Crops") {
        //                     arrayApp.push(data[j]);
        //                 } else if(data[j].ontology_name == onto) {
        //                     arrayApp.push(data[j]);
        //                 }
        //             }
        //             if(el > 0){
        //                 if(arrayApp.length==1) {
        //                     $(tds[el]).append(
        //                         $('<p>', {"style": "color: green", "class": "elementID"}).text("{" + arrayApp[0].id + "}")
        //                     );
        //                 }
        //                 if(arrayApp.length==0) {
        //                     $(tds[el]).append(
        //                         $('<p>', {"style": "color: red"}).text("nope")
        //                     );
        //                 }
        //                 if(arrayApp.length>1) {
        //                     $(tds[el]).append(implode(arrayApp));
        //                 }
        //             }
        //         }).complete(() => {
        //             if(count == tds.length) {
        //                 $("#loaderImg").remove();
        //             }
        //             count++;
        //         });
        //     });
        // }

        /**
         * Add radio button to the generated contents
         */
        // add_radio() {
        //     $(".radioButton").each(() => {
        //         $(this).remove();
        //         $("#radioButtonTr").remove();
        //     });
        //     $("table#newspaper-b td").each(() => {
        //         $(this).children("p").remove();
        //     });
        //
        //     let tr = $($.find("tr:first.even"));
        //     tr.each(() => {
        //         let trFirst = $('<tr>', {"id": "radioButtonTr"}).insertBefore($(this));
        //
        //         for(let i = 0; i < $(this).children("td").length; i++) {
        //             let tdCol = $('<td>'),
        //                 inputCol = $('<input>', {"type": "radio", "id": (i + 1)});
        //
        //             tdCol.addClass("radioButton");
        //             inputCol.click(() => {
        //                 $("table#newspaper-b td").each(() => {
        //                     $(this).children("p").remove();
        //                 });
        //                 loaderImg.insertAfter($(this));
        //                 var numCol = $(this).context.id;
        //                 this.annotation_column(numCol, getOntology());
        //             });
        //             tdCol.append(inputCol);
        //             tdCol.click(function(e){
        //                 e.stopPropagation();
        //             });
        //             trFirst.append(tdCol);
        //         }
        //     });
        //
        //     let j = 0;
        //     $("table#newspaper-b tr").each(() => {
        //         let row = $(this).children("td:first"),
        //             tdRow = $('<td>');
        //             inputRow = $('<input>', {"type": "radio", "id": j});
        //
        //         tdRow.addClass("radioButton");
        //         inputRow.click(() => {
        //             $("table#newspaper-b td").each(() => {
        //                 $(this).children("p").remove();
        //             });
        //             loaderImg.insertAfter($(this));
        //             let numRow = $(this).context.id;
        //             this.annotationRow(numRow, getOntology());
        //         });
        //         tdRow.append(inputRow);
        //         tdRow.click((e) => {
        //             e.stopPropagation();
        //         });
        //         $(tdRow).insertBefore(row);
        //         j++;
        //     });
        //
        //     // remove the radio element for the first cross
        //     $("table#newspaper-b td:first").children("input").remove();
        // }

        // implode(array) {
        //     let $string = $('<div>');
        //     for(let i = 0; i < array.length; i++){
        //         $string.append(
        //             $('<p>', {
        //                 "id": array[i].id.replace(".", ""),
        //                 "onclick": "selectValue('" + array[i].id.replace(".", "") + "','" + array[i].id + "')",
        //                 "style": "color: blue"
        //             }).text(array[i].id + " (" + array[i].name + ")")
        //         );
        //     }
        //     return $string;
        // }

        // selectValue(id, value) {
        //     let parent = $("#" + id).parent("td");
        //
        //     parent.children("p").remove();
        //     parent.append(
        //         $('<p>', {"style": "color: green", "class": "elementID"}).text("{" + value + "}")
        //     );
        //     //$("#" + value).html("{" + value + "}")
        // }

        // getElement() {
        //     let el = $(".elementID"),
        //         returnArray = {};
        //
        //     for(let i = 0; i < el.length; i++){
        //         returnArray.push(
        //             $(el[i]).text().replace('{','').replace('}','')
        //         );
        //     }
        //     $("#log").val(JSON.stringify(returnArray));
        // }

    }, {
        key: "loadOntologies",
        value: function loadOntologies(loaded) {
            var _this2 = this;

            if (loaded) return;

            $.getJSON("/get-categories", function (data) {
                var _loop = function _loop(i) {
                    var c = $('<ul>').append($('<h5>').text(data[i]));
                    $(className + " .cats").append(c);

                    // now load the ontologies for this category
                    // hrm seems like "c" isn't carried on
                    $.getJSON("/ontologies", { category: data[i] }, function (json) {
                        $.each(json, function () {
                            c.append($('<li>').append($('<a>', { "href": "javascript:;" }).text(_this2.ontology_name)));
                        });
                    });
                };

                for (var i = 0; i < data.length; i++) {
                    _loop(i);
                }
                loaded = true;
            });
        }

        // show(clicked) {
        //     $clicked = $(clicked);
        //     let p = $clicked.position();
        //
        //     $widget.attr({
        //         "top": p.top + "px",
        //         "left": p.left + $clicked.width() + 20 + "px"
        //     });
        //
        //     $searchResult.html("");
        //     $widget.find("input[name=q]").val("");
        //     $widget.show();
        //
        //     $(document).keyup((e) => {
        //         if(e.keyCode == 27) { $widget.hide(); }   // esc
        //     });
        // }

        // run() {
        //     let $search = $(".widget_search"),
        //         exclude = $clicked.children("p").text();
        //     $search.find("input[name=q]").val($clicked.text().replace(exclude, ""));
        //     $search.submit();
        // }

    }]);

    return annotation_tool;
}();
// $(function() {
//     this.assignEvents();
//
//     var ontology = 'All Crops';
//     var loaderImg = $('<img id="loaderImg" src="/images/metabox_loader.gif" width="14" height="14" />');
//
//     var LogId = (function() {
//         var ids = [];
//         var unique = function(a) {
//             var temp = {};
//             for (var i = 0; i < a.length; i++)
//                 temp[a[i]] = true;
//             var r = [];
//             for (var k in temp)
//                 r.push(k);
//             return r;
//         };
//
//         return {
//             add: function(id) {
//                 ids.push(id);
//                 ids = unique(ids);
//                 return ids;
//             }
//         };
//     })();
//     /**
//      * Widget that works with JSON API - soon to work with JSONP as well
//      */
//     var widget = (() => {
//         let className = ".widget",
//             searchResult = ".widget_search_result",
//             $widget, $clicked, $searchResult,
//             exclude =  $clicked.children('p').text(),
//             loaded = false;
//
//         // some initialization for events
//         $(function(){
//             $widget = $(className);
//             $searchResult = $(searchResult);
//
//             $(".widget_search").submit((e) => {
//                 $searchResult.html("Loading...");
//
//                 // XXX only sending the first two words of the search
//                 let words = $(".widget_search input[name=q]").val().split(" "),
//                     query = [];
//
//                 for(let i = 0; i < words.length; i++) {
//                     if(query.length == 2) break;
//                     if(words[i].length <= 2) continue;
//                     query.push(words[i]);
//                 }
//                 query = $.trim(query.join(" ")).replace(exclude, "");
//
//                 $.getJSON("/search", {q: query}, (data) => {
//                     $searchResult.html("");
//                     for(let i = 0; i < data.length; i++) {
//                         let term = data[i],
//                             $a = $('<li>').append(
//                                 $('<a>', {
//                                     "href": "javascript:;",
//                                     "term_id": term.id,
//                                     "class": "poshytip"
//                                 }).text(term.name + " (" + term.ontology_name + ")")
//                             );
//
//                         // let's check whether this specific term actually belongs to the Crop we selected above
//                         let cropval = $("#crop").val();
//                         if(cropval !== "Loading..." && cropval !== "All Crops") {
//                             if(term.ontology_name !== cropval) {
//                                 continue;
//                             }
//                         }
//
//                         $a.find("a").click((e) => {
//                             // if there's a bracket, remove it
//                             let oldtext = $clicked.text().match(/([^{]+)/g)[0],
//                                 ids = LogId.add(term.id);
//
//                             //$("#log").val(JSON.stringify(ids));
//                             $clicked.children("p").remove();
//                             $clicked.append(
//                                 $('<p>', {"style": "color: green", "class": "elementID"}).text("{" + term.id + "}")
//                             );
//                             //$clicked.text(oldtext + '<p style="color:green" class="elementID">'+ term.id +'</p>');
//
//                             e.preventDefault();
//                             e.stopPropagation();
//                         });
//                         $searchResult.append($a);
//                     }
//                     if(!$searchResult.children().length) {
//                         $searchResult.html("No results found");
//                     }
//                 });
//
//                 e.preventDefault();
//                 e.stopPropagation();
//             });
//
//             let table = [
//                     $('<table>', {"class": "tip_table"}).append(
//                         // $('<tr>').append(
//                         //     $('<td>', {"class": "key"}).text("Term")
//                         // ).append(
//                         //     $('<td>', {"class": "key"}).text(term)
//                         // )
//                     )
//                 ].join(""),
//                 $table = $(table);
//
//             $(".poshytip").poshytip({
//                 className: "tip_form",
//                 showTimeout: 1,
//                 alignTo: "target",
//                 alignX: "center",
//                 alignY: "bottom",
//                 offsetY: 5,
//                 allowTipHover: true,
//                 fade: false,
//                 slide: false,
//                 liveEvents: true,
//                 content: (updateCallback) => {
//                     let termId = $(this).attr("term_id");
//
//                     $table.html("");
//                     $.getJSON("/get-attributes/" + termId, (data) => {
//                         $table.html("");
//                         var $cont = $('<div>');
//                         for(let i = 0; i < data.length; i++) {
//                             let attribute = data[i];
//                             $table.append(
//                                 $('<tr>').append(
//                                     $('<td>', {"class": "key"}).text(attribute.key)
//                                 ).append(
//                                     $('<td>').text(attribute.value)
//                                 ).text(attribute.value)
//                             );
//                         }
//                         $cont.append($table);
//                         updateCallback($cont.html());
//                     });
//                     return "Loading...";
//                 }
//             });
//         });
//
//         return {
//             show: show,
//             run: run
//         };
//
//     })();
// });

exports.default = annotation_tool;
