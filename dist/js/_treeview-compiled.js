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
		value: function tree_icon(is_subroot) {
			var icon_class = is_subroot ? "expandable-hitarea lastExpandable-hitarea" : "";

			return $('<div>', { "class": "hitarea " + icon_class }).click(function (e) {
				if ($(e.target).closest("li").find("ul").length == 0) {
					// Display loader
					$("#treeviev_container").prepend(LOADER.create({ target: "#treeviev_container", type: "progress" }));

					$(e.target).closest("li").append($('<ul>')).find("a").addClass("selected");

					// Expandable icon
					DATA.get_children(_data2.default.id).then(function (child) {
						$.each(child, function (k, v) {
							$(e.target).closest("li").find("ul").append($('<li>', {
								"class": v.has_children ? k == child.length - 1 ? "last expandable lastExpandable" : "expandable" : ""
							}).append($('<div>', { "class": "hitarea expandable-hitarea " + (k == child.length - 1 ? "lastExpandable-hitarea" : "") })).append($('<a>', {
								"title": DATA.extract_name(v.name), "class": "btn btn-mini",
								"data-id": child.id
							}).append($('<span>').text(DATA.extract_name(v.name)))));
						});

						// Hide the loader
						LOADER.hide("#treeviev_container .progress");
					});
				}
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
			var _this = this;

			var defaults = {
				id: "",
				term: "",
				source: {},
				is_root: false,
				langs: []
			},
			    option = $.extend({}, defaults, options);

			return $('<a>', {
				"title": STR.ucfirst(option.term),
				"class": "btn btn-mini" + (option.is_root ? " selected" : ""),
				"data-id": option.id
			}).append($('<span>').text(option.term)).click(function (e) {
				$("#page_info dl").html("");
				$("#comments").html("");

				if (option.is_root) {
					_this.add_info($('<dl>').append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
						return option.langs.length + ": " + option.langs.join(", ");
					})), false);
				} else {
					// Item selection in treeview
					$(".treeview a.selected").removeClass("selected");
					$(e.currentTarget).addClass("selected");

					// Info
					_this.disable_info();
					LOADER.create({ target: "#pages", type: "progress" });
					DATA.get_ontology_attributes(option.source.id).then(function (data) {
						_this.add_info(data, true);

						// Comments
						DATA.get_terms_comments(option.source.id).then(function (comments) {
							$("#new-comments a").text("Comments (" + comments.length + ")");
							// Get user data
							$.each(comments, function (k, c) {
								DATA.get_user(c.author_id).then(function (user) {
									$("#comments").append($('<li>', { "class": "collection-item avatar" }).append($('<img>', { "src": user.gravatar.thumbnailUrl, "alt": user.username, "class": "circle" })).append($('<span>', { "class": "title" }).append($('<span>', { "class": "highlight" }).text(user.name + " " + user.sirname)).append("<br />").append($('<small>', { "class": "grey-text" }).text(c.created))).append($('<p>', { "style": "font-style:italic;" }).text(c.comment)));

									LOADER.hide("#pages .progress");
									_this.enable_info();
								});
							});
							$("#comments").append();
						});
					});
				}
			});
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
				var $li = $('<li>', { "class": "last expandable lastExpandable" }).append(this.tree_icon(true)).append(this.button({
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
