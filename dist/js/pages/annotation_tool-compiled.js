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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import side_nav from "../../../src/es6/side-navs.es6";

var DATA = new _data2.default(),
    STR = new _str2.default(),
    LOADER = new _loader2.default();
// SIDE_NAV = new side_nav();

var annotation_tool = function () {
    function annotation_tool() {
        _classCallCheck(this, annotation_tool);
    }

    _createClass(annotation_tool, [{
        key: "assign_events",
        value: function assign_events() {
            var _this = this;

            // $("#clipboard").keyup(this.generate());

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

                $("#continue_btn, #step2 > .step-title").on("click", function () {
                    // if($("#newspaper-b").length == 0) {
                    _this.generate($("#clipboard").val(), $("#first_line").val(), $("#columns").val());
                    // }
                });
            });
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
    }, {
        key: "display_parsed_clipboard",
        value: function display_parsed_clipboard(result, first_line, columns) {
            var $container = $("#result"),
                $table = $('<table>', {
                "class": "bordered highlight",
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

                    $row_tr.append($('<td>', {
                        "class": "cell_data button-collapse " + (!cell || STR.is_term_id(cell) || STR.is_date(cell) || STR.check_regex(cell, /^[\d]{1,3}$/) ? "disabled" : ""),
                        "data-activates": "annotation_tool_data",
                        "data-item": STR.is_term_id(cell)
                    }).append(function () {
                        if (STR.is_term_id(cell)) {
                            return $('<div>').append($('<a>', { "href": "./terms/" + cell, "target": "_blank" }).text(cell)).append("&nbsp;&nbsp;").html();
                        } else if (STR.check_regex(cell, /^[\d]{1,3}$/)) {
                            return $('<center>').text(cell);
                        } else {
                            return cell;
                        }
                    }).click(function (e) {
                        if (cell && !STR.is_term_id(cell) && !STR.is_date(cell) && !STR.check_regex(cell, /^[\d]{1,3}$/)) {
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
                                    $.fullscreen.exit();
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
            $container.prepend($table);

            // SIDE_NAV.build_side_nav({
            //     id: "annotation_tool_data",
            //     button_id: "annotation_tool_sidenav_btn",
            //     content: "",
            //     target: "#result",
            //     position: "right"
            // });
        }
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

            // var download = (type, wb) => {
            //     // XLSX.write(wb, {bookType: 'xlsx' , bookSST: false, type: 'binary'});
            //     saveAs(new Blob([wb], {type: "application/octet-stream"}), file[0].name);
            // };

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
                $("#download_btn").click(function () {
                    // console.log(file[0].name, file[0].name.replace(/\..*?$/, "__exported.csv"), file[0].name.split("."));
                    saveAs(new Blob([$("#first_line").val(), $("#clipboard").val()], { type: "application/octet-stream" }), file[0].name.replace(/\..*?$/, "__exported.csv"));
                    return false;
                });
            };
            if (rABS) {
                reader.readAsBinaryString(f);
            } else {
                reader.readAsArrayBuffer(f);
            }
        }
    }, {
        key: "generate",
        value: function generate(input, first_line, columns) {
            $("#newspaper-b").html("");
            if (input && typeof input == "string") {
                var result = this.parse_clipboard(input);
                this.display_parsed_clipboard(result, first_line, columns);
            } else if (input && (typeof input === "undefined" ? "undefined" : _typeof(input)) == "object") {}
        }
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
    }]);

    return annotation_tool;
}();

exports.default = annotation_tool;
