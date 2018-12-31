"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/es6/data.es6");

var _data2 = _interopRequireDefault(_data);

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

var _loader = require("../../src/es6/loader.es6");

var _loader2 = _interopRequireDefault(_loader);

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA = new _data2.default(),
    NAV = new _navigation2.default(),
    LOADER = new _loader2.default(),
    STR = new _str2.default(),
    moment = require("moment"),
    settings = require("../../common/settings/contents.json");

var treeview = function () {
	function treeview() {
		_classCallCheck(this, treeview);
	}

	_createClass(treeview, [{
		key: "tree_icon",
		value: function tree_icon(is_subroot, id) {
			var _this = this;

			var icon_class = is_subroot ? "expandable-hitarea lastExpandable-hitarea" : "",
			    toggleIcon = function toggleIcon(e) {
				var $li = $(e.currentTarget).closest("li"),
				    $li_ul = $li.find("ul");
				if ($li_ul.length == 0 || !$li_ul.is(":visible")) {
					// "expandable" to "collapsible"
					// -------------------------------------------------------------
					// LI
					if ($li.hasClass("expandable")) {
						$li.removeClass("expandable").addClass("collapsable");
					}
					if ($li.hasClass("lastExpandable")) {
						$li.removeClass("lastExpandable").addClass("lastCollapsable");
					}
					// DIV
					if ($(e.currentTarget).hasClass("expandable-hitarea")) {
						$(e.currentTarget).removeClass("expandable-hitarea").addClass("collapsable-hitarea");
					}
					if ($(e.currentTarget).hasClass("lastExpandable-hitarea")) {
						$(e.currentTarget).removeClass("lastExpandable-hitarea").addClass("lastCollapsable-hitarea");
					}
				} else {
					// "collapsible" to "expandable"
					// -------------------------------------------------------------
					// LI
					if ($li.hasClass("collapsable")) {
						$li.removeClass("collapsable").addClass("expandable");
					}
					if ($li.hasClass("lastCollapsable")) {
						$li.removeClass("lastCollapsable").addClass("lastExpandable");
					}
					// DIV
					if ($(e.currentTarget).hasClass("collapsable-hitarea")) {
						$(e.currentTarget).removeClass("collapsable-hitarea").addClass("expandable-hitarea");
					}
					if ($(e.currentTarget).hasClass("lastCollapsable-hitarea")) {
						$(e.currentTarget).removeClass("lastCollapsable-hitarea").addClass("lastExpandable-hitarea");
					}
				}
			},
			    action = function action(e, id) {
				var $li = $(e.currentTarget).closest("li"),
				    $li_ul = $li.find("ul");
				if ($li_ul.length == 0 || !$li_ul.is(":visible")) {
					/**
      * Expanded tree
      * ---------------------------------------------------------
      */

					toggleIcon(e);
					/**
      * Highlight the label on the right
      */
					// $(".treeview a.selected").removeClass("selected");
					// $li.find("a").first().addClass("selected");

					if ($li_ul.length == 0) {
						// Display loader
						$("#treeview_container").prepend(LOADER.create({ target: "#treeview_container", type: "progress" }));

						$li.append($('<ul>'));

						// Load childrens
						DATA.get_children(id).then(function (child) {
							$.each(child, function (k, v) {
								var li_class = "",
								    div_class = "";

								if (v.has_children) {
									if (k == child.length - 1) {
										li_class = "last expandable lastExpandable";
										div_class = "hitarea lastExpandable-hitarea";
									} else {
										li_class = "";
										div_class = "hitarea expandable-hitarea";
									}
								} else {
									if (k == child.length - 1) {
										li_class = "last";
										div_class = "";
									} else {
										li_class = "";
										div_class = "";
									}
								}

								$li.find("ul").append($('<li>', {
									"class": li_class
								}).append($('<div>', { "class": div_class }).click(function (e) {
									action(e, v.id);
								})).append(_this.button({
									id: v.id,
									term: STR.ucfirst(DATA.extract_name(v.name)),
									source: v,
									is_root: false
								})).append($('<span>', { "class": "relationship " + v.relationship, "title": "Relationship: `" + v.relationship + "`" }).text(v.relationship)));
							});

							// Hide the loader
							LOADER.hide("#treeview_container .progress");
						});
					} else {
						$li_ul.show();
						// Hide the loader
						LOADER.hide("#treeview_container .progress");
					}
				} else {
					/**
      * Unexpanded tree
      * ---------------------------------------------------------
      */
					toggleIcon(e);
					$(".treeview a.selected").removeClass("selected");
					$li_ul.hide();
					$(e.target).closest("ul").closest("li.expandable").find("a").first().addClass("selected");
				}
			};

			return $('<div>', { "class": "hitarea " + icon_class }).click(function (e) {
				action(e, id);
			});
		}
	}, {
		key: "add_info",
		value: function add_info(source, remote) {
			if (remote) {
				var name = void 0,
				    $dl = $("#page_info dl");
				$.each(source, function (k, v) {
					if (k !== "comment") {
						$dl.append($('<dt>').append(STR.ucfirst(k))).append($('<dd>').append(v));
					}
				});
				$("#term_info_name").text(source.name);
				$("#page_info").html($dl);
			} else {
				$("#page_info").html(source);
			}
		}
	}, {
		key: "button",
		value: function button(options) {
			var _this2 = this;

			var defaults = {
				id: "",
				term: "",
				source: {},
				is_root: false,
				langs: []
			},
			    option = $.extend({}, defaults, options);

			var $a = $('<a>', {
				"data-tooltip": "<b>" + STR.ucfirst(option.term) + "</b><br /><small>Relationship: <tt>" + option.source.relationship + "</tt></small>",
				"class": "btn btn-mini tooltipped" + (option.is_root || NAV.get_term_id() == option.id ? " selected" : ""),
				"data-id": option.id
			}).append($('<span>').html(STR.camel_case_2_text(option.term))).click(function (e) {
				$("#page_info dl").html("");
				$("#comments").html("");

				// Item selection in treeview
				$(".treeview a.selected").removeClass("selected");
				$(e.currentTarget).addClass("selected");

				// Permalink
				var permalink = void 0,
				    ext_permalink = void 0;
				if (option.is_root || option.id.split(":")[1] == "0000000") {
					permalink = "./ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name), history.pushState("", option.term, "/ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name));
				} else {
					permalink = "./terms/" + option.id + ":" + STR.get_ontology_term(option.source.name), history.pushState("", option.term, "/terms/" + option.id + ":" + STR.get_ontology_term(option.source.name));
				}
				ext_permalink = "https://www.cropontology.org/terms/" + option.id + "/" + option.term + "/static-html?language=" + (option.langs.length == 0 ? settings.general.language : option.langs[0]);

				$("#term_info_name").attr("href", permalink).html(option.term);
				$("#term_permalink").attr("href", ext_permalink);

				if (option.is_root || option.id.split(":")[1] == "0000000") {
					_this2.add_info($('<dl>').append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
						return option.langs.length + ": " + option.langs.join(", ");
					})), false);
					$("#graph_content").html("");
					$("#graph").addClass("disabled");
				} else {
					// Info
					_this2.disable_info();
					LOADER.create({ target: "#pages", type: "progress" });

					DATA.get_ontology_attributes(option.source.id).then(function (data) {
						_this2.add_info(data, true);

						// Comments
						DATA.get_terms_comments(option.source.id).then(function (comments) {
							$("#new-comments a").text("Comments (" + comments.length + ")");
							// Get user data
							$.each(comments, function (k, c) {
								DATA.get_user(c.author_id).then(function (user) {
									$("#comments").append($('<li>', { "class": "collection-item avatar" }).append($('<img>', { "src": user.gravatar.thumbnailUrl, "alt": user.username, "class": "circle" })).append($('<span>', { "class": "title" }).append($('<span>', { "class": "highlight" }).text(user.name + " " + user.sirname)).append("<br />").append($('<small>', { "class": "grey-text" }).text(c.created))).append($('<p>', { "style": "font-style:italic;" }).text(c.comment)));
								});
							});

							$("#comments").append();
							LOADER.hide("#pages .progress");
							_this2.enable_info();
						});
					});

					LOADER.create({ target: "#graph", type: "progress" });
					/**
      * Get term data and build graph
      */
					DATA.get_term_parents(option.id).then(function (data) {
						// buildGraph($graph, data);
						var render = function render(r, n) {
							/* the Raphael set is obligatory, containing all you want to display */
							var id = n.id,
							    label = STR.get_ontology_term(n.label),
							    biggest = id.length > label.length ? id : label,
							    set = r.set().push(
							/* custom objects go here */
							r.rect(n.point[0], n.point[1] - 13, biggest.length + 120, 44).attr({
								"fill": "#feb",
								r: "12px",
								"stroke-width": n.distance == 0 ? "3px" : "1px"
							})).push(r.text(n.point[0] + biggest.length / 2 + 60, n.point[1] + 10, (label || n.id) + "\n(" + n.id + ")"));
							return set;
						};

						$("#graph_content").html("");
						var width = $("#graph_content").width(),
						    height = $("#graph_content").height(),
						    g = new Graph();

						g.edgeFactory.template.style.directed = true;

						$.each(data, function (idx, el) {
							for (var i = 0; i < el.length; i++) {
								g.addNode(el[i].id, {
									render: render,
									label: STR.get_ontology_term(el[i].name)
								});
							}
						});
						$.each(data, function (idx, el) {
							for (var i = 0; i < el.length; i++) {
								var next = el[i + 1];
								if (next) {
									g.addEdge(next.id, el[i].id, { label: next.relationship });
									//g.addEdge(next.id, el[i].id);
								}
							}
						});

						var layouter = new Graph.Layout.Spring(g);
						layouter.layout();
						var renderer = new Graph.Renderer.Raphael("graph_content", g, parseInt(width), parseInt(height));
						renderer.draw();

						$("#graph").removeClass("disabled");

						LOADER.hide("#graph .progress");
						// Add fullscreen button
						// if($.fullscreen.isNativelySupported()) {
						// 	$("#graph_content").prepend(
						// 		$('<a>', {
						// 			"href": "javascript:;",
						// 			"class": "btn btn-flat fullscreen tooltipped",
						// 			"data-position": "left",
						// 			"data-tooltip": "Show fullscreen"
						// 		}).append(
						// 			$('<span>', {"class": "fas fa-expand"})
						// 		).click((e) => {
						// 			// Get current svg and renderer measurments
						// 			let r = renderer,
						// 				svg = $("#graph_content svg");
						//
						// 			$("#graph").fullscreen({
						// 				toggleClass: "fullscreen"
						// 			})
						// 			$(".btn.fullscreen").blur();
						// 					// $("#graph_content svg").attr("width", parseInt($(document).width()));
						// 					// $("#graph_content svg").attr("height", parseInt($(document).height()));
						// 					// renderer.width = parseInt($(document).width());
						// 					// renderer.height = parseInt($(document).height());
						// 					// renderer.r.width = parseInt($(document).width());
						// 					// renderer.r.height = parseInt($(document).height());
						// 					// console.log(renderer);
						// 				// 	var renderer = new Graph.Renderer.Raphael(
						// 				// 		"graph_content",
						// 				// 		g,
						// 				// 		parseInt($(document).width() - 100),
						// 				// 		parseInt($(document).height() - 100)
						// 				// 	);
						// 					// renderer.draw();
						// 				// }, 10);
						// 		}).tooltip({delay: 50})
						// 	)
						// }
					});
				}
			});

			if (NAV.get_page() && NAV.get_term_id() == option.id) {
				setTimeout(function () {
					$a.click();
					$a.prev().click();
					_this2.tree_icon(true, option.id);
				}, 100);
			}

			if (option.source.relationship !== undefined) {
				$a.tooltip({
					position: "right",
					html: true,
					delay: 1000
				});
			}
			return $a;
		}
	}, {
		key: "disable_info",
		value: function disable_info() {
			$(this).removeClass("disabled");
		}
	}, {
		key: "enable_info",
		value: function enable_info() {
			$(this).addClass("disabled");
		}
	}, {
		key: "get_tree_items",
		value: function get_tree_items(options) {
			var defaults = {
				target: "#treeview",
				source: {}
			},
			    option = $.extend({}, defaults, options);

			this.add_items({
				item: option.target,
				source: option.source,
				term: STR.get_ontology_term(option.source.name),
				is_root: false,
				langs: option.langs
			});
		}
	}, {
		key: "add_items",
		value: function add_items(options) {
			var defaults = {
				item: "#treeview",
				source: {},
				term: "",
				is_root: false,
				langs: []
			},
			    option = $.extend({}, defaults, options);

			if (option.is_root) {
				var $root_li = $('<li>', { "class": "root" }).append(this.button({
					id: option.source.id,
					term: option.term,
					source: option.source,
					is_root: option.is_root,
					langs: option.langs
				}));

				$(option.item).append($root_li);

				/**
     * Term Information
     */
				LOADER.create({ target: "#pages", type: "progress" });
				// Default action (only for root items)
				$("#page_info").html($('<dl>').append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
					return option.langs.length + ": " + option.langs.join(", ");
				})));
				$("#term_info_name").html(option.term);

				LOADER.hide("#pages .progress");

				// Load the root tree
				this.get_tree_items({
					target: "#treeview li.root",
					source: option.source,
					langs: option.langs
				});

				// Open the first tree branch
				$(".treeview .expandable-hitarea").first().click();
			} else {
				var $li = $('<li>', { "class": "last expandable lastExpandable" }).append(this.tree_icon(true, option.source.id)).append(this.button({
					id: option.source.id,
					term: option.term,
					source: option.source,
					is_root: option.is_root,
					langs: option.langs
				}));
				$(option.item).append($li);
			}
		}
	}]);

	return treeview;
}();

exports.default = treeview;
