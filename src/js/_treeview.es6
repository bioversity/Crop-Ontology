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
	tree_icon(is_subroot) {
		let icon_class = (is_subroot) ? "expandable-hitarea lastExpandable-hitarea" : "";

		return $('<div>', {"class": "hitarea " + icon_class}).click((e) => {
			if($(e.target).closest("li").find("ul").length == 0) {
				// Display loader
				$("#treeviev_container").prepend(
					LOADER.create({target: "#treeviev_container", type: "progress"})
				);

				$(e.target).closest("li").append(
					$('<ul>')
				).find("a").addClass("selected");

				// Expandable icon
				DATA.get_children(data.id).then((child) => {
					$.each(child, (k, v) => {
						$(e.target).closest("li").find("ul").append(
							$('<li>', {
								"class": ((v.has_children) ? ((k == child.length - 1) ? "last expandable lastExpandable" : "expandable") : "")
							}).append(
								$('<div>', {"class": "hitarea expandable-hitarea " + ((k == child.length - 1) ? "lastExpandable-hitarea" : "")})
							).append(
								$('<a>', {
									"title": DATA.extract_name(v.name), "class": "btn btn-mini",
									"data-id": child.id
								}).append(
									$('<span>').text(DATA.extract_name(v.name))
								)
							)
						)
					});

					// Hide the loader
					LOADER.hide("#treeviev_container .progress");
				});
			}
		});
	}

	add_info(source, remote) {
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

		return $('<a>', {
			"title": STR.ucfirst(option.term),
			"class": "btn btn-mini" + ((option.is_root) ? " selected" : ""),
			"data-id": option.id
		}).append(
			$('<span>').text(option.term)
		).click((e) => {
			$("#page_info dl").html("");
			$("#comments").html("");

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
				// Item selection in treeview
				$(".treeview a.selected").removeClass("selected");
				$(e.currentTarget).addClass("selected");

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

								LOADER.hide("#pages .progress");
								this.enable_info();
							});
						});
						$("#comments").append();
					});
				});

			}
		});
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

			this.get_tree_items({
				target: "#treeviev li.root",
				source: option.source,
				langs: option.langs
			});
		} else {
			let $li = $('<li>', {"class": "last expandable lastExpandable"}).append(
				this.tree_icon(true)
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
				// $('<li>', {"class": "last expandable lastExpandable"}).append(
				// 	this.button(option.source.id, option.term)
				// )
		}
	}
}

export default treeview;
