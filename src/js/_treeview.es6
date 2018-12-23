/* jshint esversion: 6 */
"strict mode";

import data from "../../src/js/data.es6";
import loader from "../../src/js/loader.es6";
import str from "../../src/js/_str.es6";

var
	DATA = new data(),
	LOADER = new loader(),
	STR = new str(),

	moment = require("moment")
;

class treeview {
	tree_icon(is_subroot, id) {
		let icon_class = (is_subroot) ? "expandable-hitarea lastExpandable-hitarea" : "",
			toggleIcon = (e) => {
				let $li = $(e.currentTarget).closest("li"),
					$li_ul = $li.find("ul");
				if($li_ul.length == 0 || !$li_ul.is(":visible")) {
	                // "expandable" to "collapsible"
	                // -------------------------------------------------------------
					// LI
					if($li.hasClass("expandable")) {
						$li.removeClass("expandable").addClass("collapsable");
					}
					if($li.hasClass("lastExpandable")) {
						$li.removeClass("lastExpandable").addClass("lastCollapsable");
					}
					// DIV
					if($(e.currentTarget).hasClass("expandable-hitarea")) {
						$(e.currentTarget).removeClass("expandable-hitarea").addClass("collapsable-hitarea");
					}
					if($(e.currentTarget).hasClass("lastExpandable-hitarea")) {
						$(e.currentTarget).removeClass("lastExpandable-hitarea").addClass("lastCollapsable-hitarea");
					}
				} else {
	                // "collapsible" to "expandable"
	                // -------------------------------------------------------------
	                // LI
					if($li.hasClass("collapsable")) {
						$li.removeClass("collapsable").addClass("expandable");
					}
					if($li.hasClass("lastCollapsable")) {
						$li.removeClass("lastCollapsable").addClass("lastExpandable");
					}
					// DIV
					if($(e.currentTarget).hasClass("collapsable-hitarea")) {
						$(e.currentTarget).removeClass("collapsable-hitarea").addClass("expandable-hitarea");
					}
					if($(e.currentTarget).hasClass("lastCollapsable-hitarea")) {
						$(e.currentTarget).removeClass("lastCollapsable-hitarea").addClass("lastExpandable-hitarea");
					}
				}
			},
			action = (e, id) => {
				let $li = $(e.currentTarget).closest("li"),
					$li_ul = $li.find("ul");
				if($li_ul.length == 0 || !$li_ul.is(":visible")) {
					/**
					 * Expanded tree
					 * ---------------------------------------------------------
					 */

					$(".treeview a.selected").removeClass("selected");

					toggleIcon(e);
					$li.find("a").first().addClass("selected");

					if($li_ul.length == 0) {
						// Display loader
						$("#treeview_container").prepend(
							LOADER.create({target: "#treeview_container", type: "progress"})
						);

						$li.append($('<ul>'));

						// Load childrens
						DATA.get_children(id).then((child) => {
							$.each(child, (k, v) => {
								let li_class = "",
									div_class = "";

								if(v.has_children) {
									if(k == (child.length - 1)) {
										li_class = "last expandable lastExpandable";
										div_class = "hitarea lastExpandable-hitarea";
									} else {
										li_class = "";
										div_class = "hitarea expandable-hitarea";
									}
								} else {
									if(k == (child.length - 1)) {
										li_class = "last";
										div_class = "";
									} else {
										li_class = "";
										div_class = "";
									}
								}

								$li.find("ul").append(
									$('<li>', {
										"class": li_class
									}).append(
										$('<div>', {"class": div_class}).click((e) => {
											action(e, v.id);
										})
									).append(
										this.button({
											id: v.id,
											term: STR.ucfirst(DATA.extract_name(v.name)),
											source: v,
											is_root: false
										})
									).append(
										$('<span>', {"class": "relationship " + v.relationship, "title": "Relationship: `" + v.relationship + "`"}).text(v.relationship)
									)
								)
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

		return $('<div>', {"class": "hitarea " + icon_class}).click((e) => {
			action(e, id);
		});
	}

	add_info(source, remote) {
		$("#term_info_name").text(source.name);
		if(remote) {
			let name,
				$dl = $("#page_info dl");
			$.each(source, (k, v) => {
				if(k !== "comment") {
					$dl.append(
						$('<dt>').append(STR.ucfirst(k))
					).append(
						$('<dd>').append(v)
					)
				}
			});
			$("#page_info").html($dl);
		} else {
			$("#page_info").html(source);
		}
	}

	button(options) {
		let defaults = {
			id: "",
			term: "",
			source: {},
			is_root: false,
			langs: []
		},
		option = $.extend({}, defaults, options);


		let $a = $('<a>', {
			"data-tooltip": "<b>" + STR.ucfirst(option.term) + "</b><br /><small>Relationship: <tt>" + option.source.relationship + "</tt></small>",
			"class": "btn btn-mini tooltipped" + ((option.is_root) ? " selected" : ""),
			"data-id": option.id
		}).append(
			$('<span>').html(STR.camel_case_2_text(option.term))
		).click((e) => {
			$("#page_info dl").html("");
			$("#comments").html("");

			// Item selection in treeview
			$(".treeview a.selected").removeClass("selected");
			$(e.currentTarget).addClass("selected");

			if(option.is_root) {
				this.add_info(
					$('<dl>').append(
						$('<dt>').text("Ontology type:")
					).append(
						$('<dd>').text(option.source.ontologyType)
					).append(
						$('<dt>').append("Available languages:")
					).append(
						$('<dd>').append(() => {
							return option.langs.length + ": " + option.langs.join(", ")
						})
					),
					false
				);
			} else {
				// Info
				this.disable_info();
				LOADER.create({target: "#pages", type: "progress"});

				DATA.get_ontology_attributes(option.source.id).then((data) => {
					this.add_info(data, true);

					// Comments
					DATA.get_terms_comments(option.source.id).then((comments) => {
						$("#new-comments a").text("Comments (" + comments.length + ")");
						// Get user data
						$.each(comments, (k, c) => {
							DATA.get_user(c.author_id).then((user) => {
								$("#comments").append(
									$('<li>', {"class": "collection-item avatar"}).append(
										$('<img>', {"src": user.gravatar.thumbnailUrl, "alt": user.username, "class": "circle"})
									).append(
										$('<span>', {"class": "title"}).append(
											$('<span>', {"class": "highlight"}).text(user.name + " " + user.sirname)
										).append("<br />").append(
											$('<small>', {"class": "grey-text"}).text(c.created)
										)
									).append(
										$('<p>', {"style": "font-style:italic;"}).text(c.comment)
									)
								);
							});
						});

						$("#comments").append();
						LOADER.hide("#pages .progress");
						this.enable_info();
					});
				});

			}
		});

		if(option.source.relationship !== undefined) {
			$a.tooltip({
				position: "right",
				html: true,
				delay: 1000
			});
		}
		return $a;
	}

	disable_info() {
		$("#ontology_info .card").addClass("disabled");
	}

	enable_info() {
		$("#ontology_info .card").removeClass("disabled");
	}

	get_tree_items(options) {
		let defaults = {
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

	add_items(options) {
		let defaults = {
			item: "#treeview",
			source: {},
			term: "",
			is_root: false,
			langs: []
		},
		option = $.extend({}, defaults, options);

		if(option.is_root) {
			let $root_li = $('<li>', {"class": "root"}).append(
				this.button({
					id: option.source.id,
					term: option.term,
					source: option.source,
					is_root: option.is_root,
					langs: option.langs
				})
			);

			$(option.item).append($root_li);

			/**
			 * Term Information
			 */
			LOADER.create({target: "#pages", type: "progress"});
				// Default action (only for root items)
				$("#page_info").html(
					$('<dl>').append(
						$('<dt>').text("Ontology type:")
					).append(
						$('<dd>').text(option.source.ontologyType)
					).append(
						$('<dt>').append("Available languages:")
					).append(
						$('<dd>').append(() => {
							return option.langs.length + ": " + option.langs.join(", ")
						})
					)
				);
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
			let $li = $('<li>', {"class": "last expandable lastExpandable"}).append(
				this.tree_icon(true, option.source.id)
			).append(
				this.button({
					id: option.source.id,
					term: option.term,
					source: option.source,
					is_root: option.is_root,
					langs: option.langs
				})
			);
			$(option.item).append($li);
		}
	}
}

export default treeview;
