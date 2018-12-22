"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/js/data.es6");

var _data2 = _interopRequireDefault(_data);

var _loader = require("../../src/js/loader.es6");

var _loader2 = _interopRequireDefault(_loader);

var _str = require("../../src/js/_str.es6");

var _str2 = _interopRequireDefault(_str);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA = new _data2.default(),
    LOADER = new _loader2.default(),
    STR = new _str2.default(),
    moment = require("moment");

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

					$(".treeview a.selected").removeClass("selected");

					toggleIcon(e);
					$li.find("a").first().addClass("selected");

					if ($li_ul.length == 0) {
						// Display loader
						$("#treeviev_container").prepend(LOADER.create({ target: "#treeviev_container", type: "progress" }));

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
									term: DATA.extract_name(v.name),
									source: v,
									is_root: false
								})).append($('<span>', { "class": "relationship " + v.relationship, "title": "Relationship: `" + v.relationship + "`" }).text(v.relationship)));
							});

							// Hide the loader
							LOADER.hide("#treeviev_container .progress");
						});
					} else {
						$li_ul.show();
						// Hide the loader
						LOADER.hide("#treeviev_container .progress");
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
				"class": "btn btn-mini tooltipped" + (option.is_root ? " selected" : ""),
				"data-id": option.id
			}).append($('<span>').html(option.term)).click(function (e) {
				$("#page_info dl").html("");
				$("#comments").html("");

				// Item selection in treeview
				$(".treeview a.selected").removeClass("selected");
				$(e.currentTarget).addClass("selected");

				if (option.is_root) {
					_this2.add_info($('<dl>').append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
						return option.langs.length + ": " + option.langs.join(", ");
					})), false);
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
				}
			});

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
			$("#ontology_info .card").addClass("disabled");
		}
	}, {
		key: "enable_info",
		value: function enable_info() {
			$("#ontology_info .card").removeClass("disabled");
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

				LOADER.create({ target: "#pages", type: "progress" });
				// Default action (only for root items)
				$("#page_info").html($('<dl>').append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
					return option.langs.length + ": " + option.langs.join(", ");
				})));
				LOADER.hide("#pages .progress");

				this.get_tree_items({
					target: "#treeviev li.root",
					source: option.source,
					langs: option.langs
				});
			} else {
				var $li = $('<li>', { "class": "last expandable lastExpandable" }).append(this.tree_icon(true, option.source.id)).append(this.button({
					id: option.source.id,
					term: option.term,
					source: option.source,
					is_root: option.is_root,
					langs: option.langs
				}));
				$(option.item).append($li);
				// $('<li>', {"class": "last expandable lastExpandable"}).append(
				// 	this.button(option.source.id, option.term)
				// )
			}
		}
	}]);

	return treeview;
}();

exports.default = treeview;
