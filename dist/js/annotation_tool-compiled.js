"use strict";
/* jshint esversion: 6 */
"strict mode";

/**
* simple module that generates CSV from DOM stuff - requires jquery
* copyright - Luca Matteis
*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var csvGenerator = function () {
    // converts a DOM table into csv
    function fromTable(domTable) {
        var table = $(domTable),
            csv = "",
            trs = table.find("tr");
        trs.each(function () {
            var cells = $(this).find("td");
            cells.each(function (i) {
                var text = $(this).text();
                text = text.replace(/\"/g, '\\"');
                text = '"' + text + '"';
                csv += (i == 0 ? "" : ",") + text;
            });
            csv += "\n";
        });
        return csv;
    }
    return {
        fromTable: fromTable
    };
}(),
    TOKENS = {};

var annotation_tool = function () {
    function annotation_tool() {
        _classCallCheck(this, annotation_tool);
    }

    _createClass(annotation_tool, [{
        key: "parseClipboard",
        value: function parseClipboard(content) {
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
        key: "showParsedClipboard",
        value: function showParsedClipboard(result) {
            var $container = $("#result"),
                $table = $('<table>', {
                "cellspacing": "0",
                "cellpadding": "0",
                "id": "newspaper-b"
            }),
                $thead = $("<thead>"),
                $tbody = $('<tbody>');

            $container.html("");
            //$table.append(thead);
            $table.append($tbody);
            for (var i = 0; i < result.length; i++) {
                var row = result[i],
                    $tr = $('<tr>');
                if (i % 2) {
                    $tr.addClass("odd");
                } else {
                    $tr.addClass("even");
                }

                for (var x = 0; x < row.length; x++) {
                    var cell = row[x];
                    $tr.append($('<td>', { "class": "bottom center border" }).html(cell));
                }

                /*
                if(i == 0) {
                    $thead.append($tr);
                } else {
                    $tbody.append($tr);
                }
                */

                $tbody.append($tr);
            }
            $container.html($table);
        }
    }, {
        key: "makeToken",
        value: function makeToken(content) {
            return $('<div>').append($('<b>', { "class": "token" }).html(content)).html();
        }
    }, {
        key: "doReplace",
        value: function doReplace(text, key) {
            text = text.replace(new RegExp("\\b" + key + "\\b", "g"), this.makeToken(key));
            // search also for underscores
            var underscores = key.replace(new RegExp(" ", "g"), "_");
            if (underscores.indexOf("_") >= 0) {
                text = text.replace(new RegExp("\\b" + underscores + "\\b", "g"), this.makeToken(underscores));
            }
            return text;
        }
    }, {
        key: "getOntologyId",
        value: function getOntologyId(matchedTerm) {
            var jMatchedTerm = $(matchedTerm),
                itemId = jMatchedTerm.find("OmixedItemID").text(),
                ontologyId = itemId.split("/")[2];

            ontologyId = ontologyId.split(" ")[0];

            return ontologyId;
        }
    }, {
        key: "terminize",
        value: function terminize(elem, text) {
            var jel = $(elem),
                old = jel.val();

            jel.val("Loading...");

            $.ajax({
                url: "/",
                data: {
                    sourceText: $("#clipboard").val()
                },
                type: "POST",
                dataType: "xml",
                success: function success(xml) {
                    var _this = this;

                    var jxml = $(xml),
                        foundTokens = jxml.find("TokenIndices"),
                        clipTxt = $("#clipboard").val(),
                        res = {};

                    foundTokens.each(function (i) {
                        var el = $(_this),
                            matchedTerm = el.parent().get(0),
                            tokenIndexes = el.text().split(","),
                            text = "";

                        for (var _i = 0; _i < tokenIndexes.length; _i++) {
                            var foundTerm = jxml.find("Token[index=" + tokenIndexes[_i] + "]");
                            // separate by space
                            text += foundTerm.text() + " ";
                        }
                        text = $.trim(text);

                        if (!res[text]) {
                            // doesn't exist, just add it as a single array
                            res[text] = [{
                                ontologyId: _this.getOntologyId(matchedTerm),
                                domMatchedTerm: matchedTerm
                            }];
                        } else {
                            // exists - push it inside only if it comes from a different ontology from the ones already inside
                            var ontologyId = _this.getOntologyId(matchedTerm);
                            // check if it exists
                            var found = false;
                            for (var _i2 = 0; _i2 < res[text].length; _i2++) {
                                if (res[text][_i2].ontologyId == ontologyId) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                res[text].push({
                                    ontologyId: ontologyId,
                                    domMatchedTerm: matchedTerm
                                });
                            }
                        }
                    });

                    // res contains an array of matched terms elements
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var i = _step.value;

                            clipTxt = this.doReplace(clipTxt, i);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    TOKENS = res;

                    var result = this.parseClipboard(clipTxt);
                    this.showParsedClipboard(result);
                    this.doPoshytip();
                    jel.val(old);
                }
            });
        }
    }, {
        key: "generate",
        value: function generate() {
            var result = this.parseClipboard($("#clipboard").val());
            this.showParsedClipboard(result);
        }
    }, {
        key: "assignEvents",
        value: function assignEvents() {
            var _this2 = this;

            $("#generate").click(this.generate());
            $("#clipboard").keyup(this.generate());

            $("#terminize").click(function () {
                _this2.terminize(_this2, $("#clipboard").val());
            });

            $("#sample").click(function (e) {
                $("#clipboard").val($(".sample").html());
                _this2.generate();

                e.preventDefault();
                e.stopPropagation();
            });
            $("#download").click(function () {
                var csv = csvGenerator.fromTable($("#newspaper-b").get(0)),
                    $form = $('<form>', {
                    "style": "display: none;",
                    "method": "post",
                    "action": "http://www.cropontology.org/csv-download"
                }),
                    $input = $('<input>', { "type": "hidden", "name": "csvString" });

                $input.val(csv);

                $form.append($input);
                $(document.body).append($form);
                form.submit();
                form.remove();
            });

            // annotation
            $("table tr td").live("click", function (e) {
                var $this = $(_this2);
                $("table tr td").each(function () {
                    $(_this2).removeClass("selected");
                });

                $this.addClass("selected");

                widget.show($this.get(0));
                widget.run();
            });

            // row column selection
            var val = "row";
            $("#selection").change(function () {
                val = $(this).val();
            });

            // load all crops (ontologies)
            $.getJSON("http://www.cropontology.org/ontologies?category=300-499 Phenotype and Trait Ontology&callback=?", function (data) {
                var $crop = $("#crop");
                $crop.html("").append($('<option>', { "value": "All Crops" }).text("Filter by crop</option>"));

                for (var i = 0; i < data.length; i++) {
                    var term = data[i];

                    $crop.append($('<option>', { "value": term.ontology_name }).text(term.ontology_name));
                }
                $crop.live("click", function (e) {
                    _this2.setOntology($(e.target).val());
                });
            });

            // // hover
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
        key: "doPoshytip",
        value: function doPoshytip() {
            var _this3 = this;

            var currentHoveredDomTerm = false;

            $(".token").each(function () {
                var $this = $(_this3),
                    foundTerms = void 0,
                    title = "",
                    text = $this.text().replace(new RegExp("_", "g"), " ");

                if (foundTerms == TOKENS[text]) {
                    title = foundTerms.length == 1 ? "Choose this term:" : "Choose one of these " + foundTerms.length + " terms:";
                    for (var i = 0; i < foundTerms.length; i++) {
                        var matchedTerm = $(foundTerms[i].domMatchedTerm),
                            term = matchedTerm.find("OmixedItemID").text().split("/"),
                            definition = matchedTerm.find("Definition").text() || "no definition found",
                            id = matchedTerm.find("Accession").text();

                        term = term[term.length - 1];
                        title += [$('<div>').append($('<table>', { "class": "tip_table" }).append($('<tr>').append($('<td>', { "class": "key" }).text("Term")).append($('<td>').text(term))).append($('<tr>').append($('<td>', { "class": "key" }).text("ID")).append($('<td>').text(id))).append($('<tr>').append($('<td>', { "class": "key" }).text("Definition")).append($('<td>').text(definition))).append($('<tr>').append($('<td>', { "class": "key" }).text("Actions")).append($('<td>').append($('<input>', {
                            "term_name": term,
                            "term_id": id,
                            "class": "use",
                            "type": "button",
                            "value": "Use"
                        })).append($('<input>', {
                            "term_name": term,
                            "term_id": id,
                            "class": "use",
                            "type": "button",
                            "value": "Use for all"
                        })))))].join("");
                    }

                    $this.attr("title", title);
                }
            });

            // using live because the "use" button gets created before we
            // assing this event
            $(".use").live("click", function () {
                var $this = $(_this3),
                    termId = $this.attr("term_id"),
                    termName = $this.attr("term_name"),
                    curr = $(currentHoveredDomTerm),
                    original_text = curr.text(),
                    new_text = termName + " (" + termId + ")";

                curr.text(new_text);
                if ($this.val() == "Use for all") {
                    $("#indexlist td b").each(function () {
                        var $this = $(_this3);
                        if ($this.text() == original_text) $this.text(new_text);
                    });
                }
            });
            $(".token").poshytip({
                className: 'tip_form',
                showTimeout: 1,
                alignTo: 'target',
                alignX: 'center',
                offsetY: 5,
                allowTipHover: true,
                fade: false,
                slide: false
            }).hover(function () {
                currentHoveredDomTerm = _this3;
            });
        }
    }, {
        key: "setOntology",
        value: function setOntology(onto) {
            return onto;
        }
    }, {
        key: "getOntology",
        value: function getOntology() {
            return ontology;
        }
    }, {
        key: "annotationColumn",
        value: function annotationColumn(num, onto) {
            var table = $("table#newspaper-b tr"),
                count = 1;

            $("table#newspaper-b tr").each(function (el) {
                var $tr = $(this),
                    td = $tr.children("td"),
                    currentValue = $(td[num]).context.textContent;

                $.getJSON("/search?q=" + currentValue, function (data) {
                    var arrayApp = [];
                    for (var j = 0; j < data.length; j++) {
                        if (onto == "All Crops") {
                            arrayApp.push(data[j]);
                        } else if (data[j].ontology_name == onto) {
                            arrayApp.push(data[j]);
                        }
                    }
                    if (el > 0) {
                        if (arrayApp.length == 1) {
                            $(td[num]).append('<p style="color:green" class="elementID">{' + arrayApp[0].id + '}</p>');
                        }
                        if (arrayApp.length == 0) {
                            $(td[num]).append('<p style="color:red">nope</p>');
                        }
                        if (arrayApp.length > 1) {
                            $(td[num]).append(implode(arrayApp));
                        }
                    }
                }).complete(function () {
                    if (count == $("table#newspaper-b tr").length) {
                        $('#loaderImg').remove();
                    }
                    count++;
                });
            });
        }
    }, {
        key: "annotationRow",
        value: function annotationRow(num, onto) {
            var _this4 = this;

            var table = $("table#newspaper-b tr"),
                tr = $(table[num]),
                tds = tr.children("td"),
                count = 1;

            $(tds).each(function (el) {
                var currentValue = $(_this4).context.textContent;

                $.getJSON("/search?q=" + currentValue, function (data) {
                    var arrayApp = [];
                    for (var j = 0; j < data.length; j++) {
                        if (onto == "All Crops") {
                            arrayApp.push(data[j]);
                        } else if (data[j].ontology_name == onto) {
                            arrayApp.push(data[j]);
                        }
                    }
                    if (el > 0) {
                        if (arrayApp.length == 1) {
                            $(tds[el]).append($('<p>', { "style": "color: green", "class": "elementID" }).text("{" + arrayApp[0].id + "}"));
                        }
                        if (arrayApp.length == 0) {
                            $(tds[el]).append($('<p>', { "style": "color: red" }).text("nope"));
                        }
                        if (arrayApp.length > 1) {
                            $(tds[el]).append(implode(arrayApp));
                        }
                    }
                }).complete(function () {
                    if (count == tds.length) {
                        $("#loaderImg").remove();
                    }
                    count++;
                });
            });
        }
    }, {
        key: "addRadio",
        value: function addRadio() {
            var _this5 = this;

            $(".radioButton").each(function () {
                $(_this5).remove();
                $("#radioButtonTr").remove();
            });
            $("table#newspaper-b td").each(function () {
                $(_this5).children("p").remove();
            });

            var tr = $($.find("tr:first.even"));
            tr.each(function () {
                var trFirst = $('<tr>', { "id": radioButtonTr }).insertBefore($(_this5));

                for (var i = 0; i < $(_this5).children("td").length; i++) {
                    var tdCol = $('<td>'),
                        inputCol = $('<input>', { "type": "radio", "id": i + 1 });

                    tdCol.addClass("radioButton");
                    inputCol.click(function () {
                        $("table#newspaper-b td").each(function () {
                            $(_this5).children("p").remove();
                        });
                        loaderImg.insertAfter($(_this5));
                        var numCol = $(_this5).context.id;
                        annotationColumn(numCol, getOntology());
                    });
                    tdCol.append(inputCol);
                    tdCol.click(function (e) {
                        e.stopPropagation();
                    });
                    trFirst.append(tdCol);
                }
            });

            var j = 0;
            $("table#newspaper-b tr").each(function () {
                var row = $(_this5).children("td:first"),
                    tdRow = $('<td>');
                inputRow = $('<input>', { "type": "radio", "id": j });

                tdRow.addClass("radioButton");
                inputRow.click(function () {
                    $("table#newspaper-b td").each(function () {
                        $(_this5).children("p").remove();
                    });
                    loaderImg.insertAfter($(_this5));
                    var numRow = $(_this5).context.id;
                    _this5.annotationRow(numRow, getOntology());
                });
                tdRow.append(inputRow);
                tdRow.click(function (e) {
                    e.stopPropagation();
                });
                $(tdRow).insertBefore(row);
                j++;
            });

            // remove the radio element for the first cross
            $("table#newspaper-b td:first").children("input").remove();
        }
    }, {
        key: "implode",
        value: function implode(array) {
            var $string = $('<div>');
            for (var i = 0; i < array.length; i++) {
                $string.append($('<p>', {
                    "id": array[i].id.replace(".", ""),
                    "onclick": "selectValue('" + array[i].id.replace(".", "") + "','" + array[i].id + "')",
                    "style": "color: blue"
                }).text(array[i].id + " (" + array[i].name + ")"));
            }
            return $string;
        }
    }, {
        key: "selectValue",
        value: function selectValue(id, value) {
            var parent = $("#" + id).parent("td");

            parent.children("p").remove();
            parent.append($('<p>', { "style": "color: green", "class": "elementID" }).text("{" + value + "}"));
            //$("#" + value).html("{" + value + "}")
        }
    }, {
        key: "getElement",
        value: function getElement() {
            var el = $(".elementID"),
                returnArray = {};

            for (var i = 0; i < el.length; i++) {
                returnArray.push($(el[i]).text().replace('{', '').replace('}', ''));
            }
            $("#log").val(JSON.stringify(returnArray));
        }
    }, {
        key: "loadOntologies",
        value: function loadOntologies(loaded) {
            var _this6 = this;

            if (loaded) return;

            $.getJSON("/get-categories", function (data) {
                var _loop = function _loop(i) {
                    var c = $('<ul>').append($('<h5>').text(data[i]));
                    $(className + " .cats").append(c);

                    // now load the ontologies for this category
                    // hrm seems like "c" isn't carried on
                    $.getJSON("/ontologies", { category: data[i] }, function (json) {
                        $.each(json, function () {
                            c.append($('<li>').append($('<a>', { "href": "javascript:;" }).text(_this6.ontology_name)));
                        });
                    });
                };

                for (var i = 0; i < data.length; i++) {
                    _loop(i);
                }
                loaded = true;
            });
        }
    }, {
        key: "show",
        value: function show(clicked) {
            $clicked = $(clicked);
            var p = $clicked.position();

            $widget.attr({
                "top": p.top + "px",
                "left": p.left + $clicked.width() + 20 + "px"
            });

            $searchResult.html("");
            $widget.find("input[name=q]").val("");
            $widget.show();

            $(document).keyup(function (e) {
                if (e.keyCode == 27) {
                    $widget.hide();
                } // esc
            });
        }
    }, {
        key: "run",
        value: function run() {
            var $search = $(".widget_search"),
                exclude = $clicked.children("p").text();
            $search.find("input[name=q]").val($clicked.text().replace(exclude, ""));
            $search.submit();
        }
    }]);

    return annotation_tool;
}();

$(function () {
    this.assignEvents();

    var ontology = 'All Crops';
    var loaderImg = $('<img id="loaderImg" src="/images/metabox_loader.gif" width="14" height="14" />');

    var LogId = function () {
        var ids = [];
        var unique = function unique(a) {
            var temp = {};
            for (var i = 0; i < a.length; i++) {
                temp[a[i]] = true;
            }var r = [];
            for (var k in temp) {
                r.push(k);
            }return r;
        };

        return {
            add: function add(id) {
                ids.push(id);
                ids = unique(ids);
                return ids;
            }
        };
    }();
    /**
     * Widget that works with JSON API - soon to work with JSONP as well
     */
    var widget = function () {
        var className = ".widget",
            searchResult = ".widget_search_result",
            $widget = void 0,
            $clicked = void 0,
            $searchResult = void 0,
            exclude = $clicked.children('p').text(),
            loaded = false;

        // some initialization for events
        $(function () {
            var _this7 = this;

            $widget = $(className);
            $searchResult = $(searchResult);

            $(".widget_search").submit(function (e) {
                $searchResult.html("Loading...");

                // XXX only sending the first two words of the search
                var words = $(".widget_search input[name=q]").val().split(" "),
                    query = [];

                for (var i = 0; i < words.length; i++) {
                    if (query.length == 2) break;
                    if (words[i].length <= 2) continue;
                    query.push(words[i]);
                }
                query = $.trim(query.join(" ")).replace(exclude, "");

                $.getJSON("/search", { q: query }, function (data) {
                    $searchResult.html("");

                    var _loop2 = function _loop2(_i3) {
                        var term = data[_i3],
                            $a = $('<li>').append($('<a>', {
                            "href": "javascript:;",
                            "term_id": term.id,
                            "class": "poshytip"
                        }).text(term.name + " (" + term.ontology_name + ")"));

                        // let's check whether this specific term actually belongs to the Crop we selected above
                        var cropval = $("#crop").val();
                        if (cropval !== "Loading..." && cropval !== "All Crops") {
                            if (term.ontology_name !== cropval) {
                                return "continue";
                            }
                        }

                        $a.find("a").click(function (e) {
                            // if there's a bracket, remove it
                            var oldtext = $clicked.text().match(/([^{]+)/g)[0],
                                ids = LogId.add(term.id);

                            //$("#log").val(JSON.stringify(ids));
                            $clicked.children("p").remove();
                            $clicked.append($('<p>', { "style": "color: green", "class": "elementID" }).text("{" + term.id + "}"));
                            //$clicked.text(oldtext + '<p style="color:green" class="elementID">'+ term.id +'</p>');

                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $searchResult.append($a);
                    };

                    for (var _i3 = 0; _i3 < data.length; _i3++) {
                        var _ret2 = _loop2(_i3);

                        if (_ret2 === "continue") continue;
                    }
                    if (!$searchResult.children().length) {
                        $searchResult.html("No results found");
                    }
                });

                e.preventDefault();
                e.stopPropagation();
            });

            var table = [$('<table>', { "class": "tip_table" }).append()].join(""),
                $table = $(table);

            $(".poshytip").poshytip({
                className: "tip_form",
                showTimeout: 1,
                alignTo: "target",
                alignX: "center",
                alignY: "bottom",
                offsetY: 5,
                allowTipHover: true,
                fade: false,
                slide: false,
                liveEvents: true,
                content: function content(updateCallback) {
                    var termId = $(_this7).attr("term_id");

                    $table.html("");
                    $.getJSON("/get-attributes/" + termId, function (data) {
                        $table.html("");
                        var $cont = $('<div>');
                        for (var i = 0; i < data.length; i++) {
                            var attribute = data[i];
                            $table.append($('<tr>').append($('<td>', { "class": "key" }).text(attribute.key)).append($('<td>').text(attribute.value)).text(attribute.value));
                        }
                        $cont.append($table);
                        updateCallback($cont.html());
                    });
                    return "Loading...";
                }
            });
        });

        return {
            show: show,
            run: run
        };
    }();
});

exports.default = annotation_tool;
