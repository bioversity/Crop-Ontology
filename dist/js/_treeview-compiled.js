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
    page = NAV.get_page(),
    moment = require("moment"),
    settings = require("../../common/settings/contents.json"),
    languages = require("../../common/settings/languages.json");

var treeview = function () {
	function treeview() {
		_classCallCheck(this, treeview);
	}

	_createClass(treeview, [{
		key: "id2class",

		/**
   * Transform an Ontology ID or an Ontology Term ID to a DOM capable class
   * @param  string 						id									The ID to convert
   * @return string															The converted ID
   */
		value: function id2class(id) {
			return id.replace(":", "-");
		}

		/**
   * Transform an Ontology class ID or an Ontology Term class ID to a real ID
   * @param  string 						id									The ID to convert
   * @return string															The converted ID
   */

	}, {
		key: "class2id",
		value: function class2id(id) {
			return id.replace("-", ":");
		}

		/**
   * Get all childrens of a given Ontology ID and build the tree graphically
   * @param  object   					$li									The target DOM object to append the tree (it starts from the `<ul>` tag)
   * @param  string   					id									The given Ontology or Ontology Term ID
   * @param  function 					callback							The function to execute onche the children is applied to the DOM
   */

	}, {
		key: "build_tree",
		value: function build_tree($li, id, callback) {
			var _this = this;

			$li.append($('<ul>'));

			DATA.get_children(id).then(function (child) {
				$.each(child, function (k, v) {
					var li_class = "",
					    div_class = "hitarea_" + _this.id2class(v.id);

					if (v.has_children) {
						if (k == child.length - 1) {
							li_class = "last expandable lastExpandable";
							div_class += " hitarea lastExpandable-hitarea";
						} else {
							li_class = "";
							div_class += " hitarea expandable-hitarea";
						}
					} else {
						if (k == child.length - 1) {
							li_class = "last";
						} else {
							li_class = "";
						}
					}
					var $tree_icon = $('<div>', { "class": div_class }).click(function (e) {
						_this.action(e, v.id);
					});

					$li.find("ul").append($('<li>', {
						"class": li_class
					}).append($tree_icon).append(_this.button({
						id: v.id,
						term: STR.ucfirst(DATA.extract_name(v.name)),
						source: v,
						is_root: false
					})).append($('<span>', { "class": "relationship " + v.relationship, "title": "Relationship: `" + v.relationship + "`" }).text(v.relationship)));
				});

				if (typeof callback == "function") {
					callback(child);
				}
			});
		}

		/**
  * Toggle icon status
  * @param  object 						e									The fired button object
  */

	}, {
		key: "toggleIcon",
		value: function toggleIcon(e) {
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
		}

		/**
   * Collect selected IDs
   * @param  object 						obj									The term parents object
   * @return array															An array with sequential tree IDs to open
   */

	}, {
		key: "get_obj_ids",
		value: function get_obj_ids(obj) {
			var ids = [];
			$.each(obj, function (kk, vv) {
				ids.push(vv.id);
			});
			return ids;
		}

		/**
  * Buttons action
  * @param  object 						e									The fired button object
  * @param  string 						id									The ontology or term ID
  */

	}, {
		key: "action",
		value: function action(e, id) {
			var _this2 = this;

			var $clicked_item_li = e.jquery == undefined ? $(e.currentTarget).closest("li") : e,
			    $clicked_item_li__ul = $clicked_item_li.find("ul");

			if ($clicked_item_li__ul.length == 0 || !$clicked_item_li__ul.is(":visible")) {
				/**
     * Expand interested tree
     * ---------------------------------------------------------
     */
				this.toggleIcon(e);

				// If is the first page loading
				if ($clicked_item_li__ul.length == 0) {
					// Display loader
					$("#treeview_container").prepend(LOADER.create({ target: "#treeview_container", type: "progress" }));
					$("#treeview_container").addClass("disabled");

					/**
      * Ontology Term page
      * -------------------------------------------------------------
      */
					if (page == "terms" && NAV.get_term_id() !== undefined) {
						// Highlight the label on the right
						$(".treeview a.selected").removeClass("selected");

						DATA.get_term_parents(NAV.get_full_id()).then(function (data) {
							var selected_ids = void 0,
							    first_item = void 0,
							    last_item = void 0,
							    $first_item_li = void 0;

							// Walk the tree
							$.each(data[0], function (kk, vv) {
								// Collect the ids to trace the way
								selected_ids = _this2.get_obj_ids(data[0]);

								first_item = data[0][0];
								$first_item_li = $(".hitarea_" + _this2.id2class(first_item.id)).parent("li").last();
								last_item = data[0][data[0].length - 1];
							});
							/**
        * Build and open the requested tree
        */
							_this2.build_tree($clicked_item_li, id, function () {
								$.each(selected_ids, function (k, v) {
									if (v == selected_ids[selected_ids.length - 1]) {
										/**
          * THE END
          */
										// Select the button
										$("." + _this2.id2class(v)).click();
									} else {
										/**
          * NOT YET THE END
          */
										// Only closed and expandable tree item
										var $item_tree_control = $(".hitarea_" + _this2.id2class(v));
										if ($item_tree_control.hasClass("expandable-hitarea") || $item_tree_control.hasClass("lastExpandable-hitarea")) {
											$item_tree_control.click();
										}
									}
								});
								return dfd.promise();
							});
						});
					} else {
						/**
       * Ontology page
       * ---------------------------------------------------------
       */

						// Load childrens
						this.build_tree($clicked_item_li, id, function () {
							var $button = $("." + _this2.id2class(id));
							$button.click();

							// Hide the loader
							LOADER.hide("#treeview_container .progress");
						});
					}
				} else {
					$clicked_item_li__ul.show();
					// Hide the loader
					LOADER.hide("#treeview_container .progress");
				}
			} else {
				/**
    * Unexpanded tree
    * ---------------------------------------------------------
    */

				this.toggleIcon(e);
				// $(".treeview a.selected").removeClass("selected");
				$clicked_item_li__ul.hide();
				$(e.target).closest("ul").closest("li.expandable").find("a").first().addClass("selected");
			}
		}

		/**
   * Generate the square icon on the left
   * @param  bool 						is_subroot							Is a sub-root element
   * @param  string   					id									The given Ontology or Ontology Term ID
   * @return object															The DOM object of the generated "hitarea" icon
   */

	}, {
		key: "tree_icon",
		value: function tree_icon(is_subroot, id) {
			var _this3 = this;

			var icon_class = "hitarea_" + this.id2class(id) + " " + (is_subroot ? "expandable-hitarea lastExpandable-hitarea" : "");

			// Simulate the click on the first "hitarea"
			// just as first opening of the tree
			return $('<div>', { "class": "hitarea " + icon_class }).click(function (e) {
				_this3.action(e, id);
			});
		}
	}, {
		key: "page_info_btn__actions",
		value: function page_info_btn__actions() {
			var _this4 = this;

			$("#page_info .btn-mini, #page_info .card-action .btn").on("click", function (e) {
				e.preventDefault();

				var $dd = void 0,
				    $dd2 = void 0,
				    $dl = $("#page_info dl"),
				    term_id = "",
				    key = "",
				    language = "english",
				    old_value = "",
				    placeholder = "Attribute name",
				    context = "add";

				if (!$(e.target).hasClass("add_term")) {
					$dd = $(e.target).closest("dd"), $dd2 = $dd.clone(), term_id = $dd2.find("a").data("term_id"), key = $dd2.find("a").data("key"), language = $dd2.find("a").data("language"), old_value = $.trim($dd2.text()), placeholder = old_value, context = "edit";
				}

				var $form = $('<form>', { "method": "post", "enctype": "multipart/form-data", "action": "", "id": "form" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 switch" }).append($('<label>').append("Text").append($('<input>', { "type": "checkbox" })).append($('<span>', { "class": "lever" })).append("File")))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field inline col s3" }).append($('<select>', { "class": "visible_input", "name": "language" }).append($.map(languages.all, function (v, k) {
					return $('<option>', { "value": v, "selected": v == languages.default }).text(STR.ucfirst(v));
				})))).append($('<div>', { "class": "input-field inline col s9" }).append($('<input>', { "type": "hidden", "name": "term_id" }).val(term_id)).append($('<input>', { "type": "hidden", "name": "key" }).val(key)).append($('<input>', { "type": "hidden", "name": "language" }).val(language)).append($('<input>', { "type": "text", "class": "text_input visible_input", "name": "value", "placeholder": placeholder }).val(old_value)).append($('<div>', { "class": "file-field input-field" }).append($('<div>', { "class": "btn highlight-btn btn-mini" }).append($('<span>').text("Upload file")).append($('<input>', { "type": "file", "class": "visible_input disabled", "name": "value", "placeholder": "Upload file from your computer" }))).append($('<div>', { "class": "file-path-wrapper" }).append($('<input>', { "type": "text", "name": "value", "class": "file-path validate disabled" }))).hide()))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12" }).append($('<a>', { "href": "javascript:;", "class": "btn-link grey-text left" }).text("‹ Cancel").on("click", function (e) {
					e.preventDefault();
					if (context == "add") {
						$(".add_term").removeClass("disabled");
						$("#add_term_form").html("").hide();
					} else {
						$dd.html($dd2.html()).removeClass("editing");
					}
					_this4.page_info_btn__actions(term_id, key, language);
				})).append($('<a>', { "href": "javascript:;", "class": "btn btn-flat btn-highlight right" }).text("Save").on("click", function (e) {
					e.preventDefault();
					DATA.get_attribute_upload_url().then(function (upload_url) {
						$(e.target).closest("form").attr("action", upload_url).submit();
					});
				}))));

				if ($(e.target).hasClass("add_term")) {
					$(e.target).addClass("disabled");
					$("#add_term_form").html($form).show();

					$form.find(".visible_input").focus().on("keypress", function (e) {
						if (e.which == 0) {
							$(".add_term").removeClass("disabled");
							$("#add_term_form").html("").hide();
						}
					});
				} else {
					var _$dd = $(e.target).closest("dd");

					_$dd.addClass("editing").html($form);
					_$dd.find(".visible_input").focus().on("keypress", function (e) {
						if (e.which == 0) {
							_$dd.html($dd2.html()).removeClass("editing");
							_this4.page_info_btn__actions(term_id, key, language);
						}
					});
				}
				$("select").material_select();
				$(".switch").find("input[type=checkbox]").on("change", function (e) {
					if ($(e.target).prop("checked")) {
						$(".text_input").hide().addClass("disabled");
						$(".file-field").show().find("input").removeClass("disabled");
					} else {
						$(".text_input").show().removeClass("disabled");
						$(".file-field").hide().find("input").addClass("disabled");
					}
				});
			});
		}
	}, {
		key: "add_info",
		value: function add_info(source, remote) {
			/**
    * Filter and order items in the `Term information` box
    */
			var item_id = source.id,
			    hide = {
				id: true,
				comment: true,
				"ontology id": true,
				"ontology name": true,
				"is a": true,
				"Name of Trait": true,
				language: true,
				"Scale ID for modification, Blank for New": true,
				"Method ID for modification, Blank for New": true,
				"Trait ID for modification, Blank for New": true,
				"Language of submission (only in ISO 2 letter codes)": true
			},
			    first = {
				"Abbreviated name": true,
				Synonyms: true,
				Synonym: true,
				Description: true,
				"Trait class": true,
				"How is trait": true
			},
			    last = {
				"Name of submitting scientist": true,
				"Institution": true,
				"Date of submission": true,
				"Bibliographic": true,
				"Updated": true,
				xref: true
			},
			    editable = {
				name: true,
				Synonym: true,
				"created at": true
			},
			    ordered_source = {},
			    last_data_source = {};

			// Remove unwanted items
			$.each(hide, function (k, v) {
				if (v && source[k] !== undefined) {
					delete source[k];
				}
			});
			// Add first wanted items
			$.each(first, function (k, v) {
				if (v && source[k] !== undefined) {
					ordered_source[k] = source[k];
					delete source[k];
				}
			});
			// Remove but keep last wanted items
			$.each(last, function (k, v) {
				if (v && source[k] !== undefined) {
					last_data_source[k] = source[k];
					delete source[k];
				}
			});
			// Add remaining items
			$.each(source, function (k, v) {
				ordered_source[k] = source[k];
			});
			// Add last wanted items
			$.each(last_data_source, function (k, v) {
				ordered_source[k] = last_data_source[k];
			});
			/**
    * ---------------------------------------------------------------------
    */

			if (remote) {
				var name = void 0,
				    $dl = $("#page_info dl").append($('<dt>', { "class": "grey-text" }).text("Identifier:")).append($('<dd>', { "class": "grey-text" }).append($('<tt>').text(item_id + " ")).append($('<a>', { "target": "_blank", "href": "https://www.cropontology.org/rdf/" + item_id }).append($('<span>', { "class": "picol_rdf" }))));
				$.each(ordered_source, function (k, v) {
					$dl.append($('<dt>', { "class": "valign-wrapper" }).append(STR.ucfirst(k) + ":")).append($('<dd>').append(function () {
						if (DATA.get_user_logged() && editable[k] !== undefined) {
							return $('<span>').append(v + " ").append($('<a>', {
								"href": "javascript:;",
								"class": "btn btn-flat btn-mini white highlight-text",
								"data-term_id": item_id,
								"data-key": k,
								"data-language": "english"
							}).append($('<span>', { "class": "fa fa-edit" })));
						} else {
							return v;
						}
					}));
				});
				// $("#term_info_name").text(source.name);
				$("#page_info").html($dl).append($('<div>', { "class": "card-content", "id": "add_term_form" }).hide()).append(function () {
					if (DATA.get_user_logged() && editable[k] !== undefined) {
						return $('<div>', { "class": "card-action" }).append($('<a>', {
							"href": "javascript:;",
							"class": "btn btn-flat white highlight-text add_term"
						}).append("Add a new attribute ").append($('<span>', { "class": "fa fa-plus" }))
						// .click((e) => {
						// 	$(e.target).addClass("disabled");
						// })
						);
					}
				});

				this.page_info_btn__actions();
			} else {
				$("#page_info").html(source);
			}
		}
	}, {
		key: "button",
		value: function button(options) {
			var _this5 = this;

			var defaults = {
				id: "",
				term: "",
				source: {},
				is_root: false,
				langs: []
			},
			    option = $.extend({}, defaults, options);

			var $variables = $("#variables").html(),
			    $comments = $("#new-comments").html();
			var $a = $('<a>', {
				"data-tooltip": "<b>" + STR.ucfirst(option.term) + "</b><br /><small>Relationship: <tt>" + option.source.relationship + "</tt></small>",
				"class": "btn btn-mini tooltipped " + this.id2class(option.id) /* + ((option.is_root || NAV.get_term_id() == option.id) ? " selected" : "")*/
				, "data-id": option.id
			}).append($('<span>').html(STR.camel_case_2_text(option.term))).click(function (e) {
				$("#page_info dl").html("");
				$("#comments").html("").hide();

				// Item selection in treeview
				$(".treeview a.selected").removeClass("selected");
				$(e.currentTarget).addClass("selected");

				// Permalink
				var permalink = void 0,
				    ext_permalink = void 0;
				if (option.is_root || option.id.split(":")[1] == "0000000" || option.id.split(":")[1] == "ROOT") {
					permalink = "./ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name), history.pushState("", option.term, "/ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name));

					// Set page title and subtitle
					$("#page_title").html(STR.camel_case_2_text(STR.get_ontology_term(option.source.name)));
					$("#page_subtitle").html(NAV.get_ontology_id());
					// Se the breadcrumb
					$("span.breadcrumb").find("tt").html(NAV.get_ontology_id());
				} else {
					permalink = "./terms/" + option.id + ":" + STR.get_ontology_term(option.source.name), history.pushState("", option.term, "/terms/" + option.id + ":" + STR.get_ontology_term(option.source.name));

					// Set page title and subtitle
					$("#page_title").html(STR.camel_case_2_text(STR.get_ontology_term(option.source.name)));
					$("#page_subtitle").html('<a href="./ontology/' + NAV.get_ontology_id() + '">' + NAV.get_ontology_id() + "</a><small>:" + NAV.get_term_id() + "</small>");
					// Se the breadcrumb
					$("span.breadcrumb").html('<tt>' + NAV.get_ontology_id() + "<small>:" + NAV.get_term_id() + '</small></tt>' + STR.camel_case_2_text(STR.get_ontology_term(option.source.name)));
				}
				ext_permalink = "https://www.cropontology.org/terms/" + option.id + "/" + option.term + "/static-html?language=" + (option.langs.length == 0 ? settings.general.language : option.langs[0]);

				$("#term_info_name").attr("href", permalink).html(STR.readable_data(option.term));
				$("#term_permalink").attr("href", ext_permalink);

				// Manage "Term information" nav
				var $variables_btn_content_bkp = $("#variables").addClass("disabled").find("a").clone();
				$("#variables").addClass("disabled").find("a").html($('<span>', { "class": "fa fa-spin fa-sync" }));
				$("#general a").click();

				// Variables
				DATA.get_terms_variables(option.source.id).then(function (variables) {
					// $("#new-comments a").text("Comments (" + comments.length + ")");
					if (variables.length > 0) {
						// Manage "Term information" nav
						$variables = $variables.replace(">Variables<", ">Variables (" + variables.length + ")<");
						$variables = $variables.replace('data-tooltip="Variables"', 'data-tooltip="Variables (' + variables.length + ')"');

						$("#variables").removeClass("disabled").html($variables);
						$("#variables a").tooltip();

						$("#ontology_info ul.tabs a").removeClass("active");
						$("#general a").click();
						// Prepare variables container
						$("#item_variables").html($('<ul>', { "class": "collection" }));

						$.each(variables, function (k, v) {
							$("#item_variables .collection").append($('<li>', { "class": "collection-item" }).append($('<a>', { "href": "./terms/" + v.id }).append($('<div>').append(STR.get_ontology_term(v.name)).append($('<span>', { "class": "fa fa-chevron-right secondary-content grey-text" })))));
						});
					} else {
						$("#variables a").addClass("disabled").html($variables_btn_content_bkp.html());
					}

					LOADER.hide("#pages .progress");
					_this5.enable_info();
				});

				if (option.is_root || option.id.split(":")[1] == "0000000" || option.id.split(":")[1] == "ROOT") {
					_this5.add_info($('<dl>').append($('<dt>', { "class": "grey-text" }).text("Identifier:")).append($('<dd>', { "class": "grey-text" }).append($('<tt>').text(option.id + " ")).append($('<a>', { "target": "_blank", "href": "https://www.cropontology.org/rdf/" + option.id }).append($('<span>', { "class": "picol_rdf" })))).append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
						return option.langs.length + ": " + option.langs.join(", ");
					})), false);
					$("#graph_content").html($('<h1>').append($('<span>', { "class": "fab fa-hubspot fa-3x" })));
					$("#graph").addClass("disabled");

					// Comments
					DATA.get_ontology_comments(NAV.get_ontology_id()).then(function (comments) {
						var comments_count = $.map(comments, function (n, i) {
							return i;
						}).length;
						if (comments_count > 0) {
							$comments = $comments.replace(">Comments<", ">Comments (" + comments_count + ")<");
							$comments = $comments.replace('data-tooltip="Comments"', 'data-tooltip="Comments (' + comments_count + ')"');
							$("#new-comments").html($comments);
							$("#new-comments a").tooltip();
							$("#comments").html("");

							$.each(comments, function (k, c) {
								DATA.get_user(c[0].username).then(function (user) {
									$("#comments").append($('<li>', { "class": "collection-item avatar" }).append($('<img>', { "src": user.gravatar.thumbnailUrl, "alt": user.username, "class": "circle" })).append($('<span>', { "class": "title" }).append($('<span>', { "class": "highlight" }).text(user.name + " " + user.sirname)).append("<br />").append($('<small>', { "class": "grey-text" }).text(c[0].date))).append($('<p>', { "style": "font-style:italic;" }).text(c[0].comment))).show();
								});
							});
						}
					});
				} else {
					// Info
					_this5.disable_info();
					LOADER.create({ target: "#pages", type: "progress" });

					DATA.get_ontology_attributes(option.source.id).then(function (data) {
						data.id = option.source.id;
						_this5.add_info(data, true);
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

					// Comments
					DATA.get_terms_comments(option.source.id).then(function (comments) {
						$comments = $comments.replace(">Comments<", ">Comments (" + comments.length + ")<");
						$comments = $comments.replace('data-tooltip="Comments"', 'data-tooltip="Comments (' + comments.length + ')"');
						$("#new-comments").html($comments);
						$("#new-comments a").tooltip();
						// Get user data
						$.each(comments, function (k, c) {
							DATA.get_user(c.author_id).then(function (user) {
								$("#comments").append($('<li>', { "class": "collection-item avatar" }).append($('<img>', { "src": user.gravatar.thumbnailUrl, "alt": user.username, "class": "circle" })).append($('<span>', { "class": "title" }).append($('<span>', { "class": "highlight" }).text(user.name + " " + user.sirname)).append("<br />").append($('<small>', { "class": "grey-text" }).text(c.created))).append($('<p>', { "style": "font-style:italic;" }).text(c.comment))).show();
							});
						});

						LOADER.hide("#pages .progress");
						_this5.enable_info();
					});
				}

				// Hide the loader
				LOADER.hide("#treeview_container .progress");
				$("#treeview_container").removeClass("disabled");
			});

			if (NAV.get_page() && NAV.get_term_id() == option.id) {
				setTimeout(function () {
					$a.click();
					$a.prev().click();
					_this5.tree_icon(true, option.id);
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
				$("#page_info").html($('<dl>').append($('<dt>', { "class": "grey-text" }).text("Identifier:")).append($('<dd>', { "class": "grey-text" }).append($('<tt>').text(option.source.id + " ")).append($('<a>', { "target": "_blank", "href": "https://www.cropontology.org/rdf/" + option.source.id }).append($('<span>', { "class": "picol_rdf" })))).append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
					return option.langs.length + ": " + option.langs.join(", ");
				})));
				// $("#term_info_name").html(option.term);

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
