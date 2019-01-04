/* jshint esversion: 6 */
"strict mode";

import data from "../../src/es6/data.es6";
import navigation from "../../src/es6/_navigation.es6";
import loader from "../../src/es6/loader.es6";
import str from "../../src/es6/_str.es6";

var
	DATA = new data(),
	NAV = new navigation(),
	LOADER = new loader(),
	STR = new str(),

	page = NAV.get_page(),
	moment = require("moment"),

	settings = require("../../common/settings/contents.json"),
	languages = require("../../common/settings/languages.json")
;

class treeview {
	tree_icon(is_subroot, id) {
		let icon_class = (is_subroot) ? "expandable-hitarea lastExpandable-hitarea" : "",
			build_tree = ($li, id, callback) => {
				$li.append($('<ul>'));

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
						let $tree_icon = $('<div>', {"class": div_class}).click((e) => {
							console.log("ok");
							action(e, v.id);
						});

						$li.find("ul").append(
							$('<li>', {
								"class": li_class
							}).append($tree_icon).append(
								this.button({
									id: v.id,
									term: STR.ucfirst(DATA.extract_name(v.name)),
									source: v,
									is_root: false
								})
							).append(
								$('<span>', {"class": "relationship " + v.relationship, "title": "Relationship: `" + v.relationship + "`"}).text(v.relationship)
							)
						);
					});

					if(typeof callback == "function") {
						callback(child);
					}
				});
			},

			/**
			 * Toggle icon status
			 * @param  object 					e								The fired button object
			 */
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

			get_obj_ids = (obj) => {
				let ids = [];
				$.each(obj, (kk, vv) => {
					ids.push(vv.id);
				});
				return ids;
			},

			/**
			 * Buttons action
			 * @param  object 					e								The fired button object
			 * @param  string 					id								The ontology or term ID
			 */
			action = (e, id) => {
				let $li = $(e.currentTarget).closest("li"),
					$li_ul = $li.find("ul");

				if($li_ul.length == 0 || !$li_ul.is(":visible")) {
					/**
					 * Expanded tree
					 * ---------------------------------------------------------
					 */


					toggleIcon(e);

					// If is the first page loading
					if($li_ul.length == 0) {
						// Display loader
						$("#treeview_container").prepend(
							LOADER.create({target: "#treeview_container", type: "progress"})
						);

						// If this is a Ontology Term page
						if(page == "terms" && NAV.get_term_id() !== undefined) {
							/**
							* Highlight the label on the right
							*/
							$(".treeview a.selected").removeClass("selected");
							DATA.get_term_parents(NAV.get_full_id()).then((data) => {
								$.each(data[0], (kk, vv) => {
									let selected_ids = get_obj_ids(data[0]),
										first_item = data[0][kk],
										$item_li = $("." + first_item.id.replace(":", "-")).closest("li").last();
									// let $button = $("." + first_item.id.replace(":", "-")),
									// 	$prev_tree_icon = $button.prev();
									if($item_li.length > 0) {
										build_tree($item_li, first_item.id, (child_data) => {
											$.each(child_data, (child_key, child) => {
												// console.warn(child.id, $.inArray(child.id, selected_ids));
												if($.inArray(child.id, selected_ids) > -1) {
													let $child_li = $("." + child.id.replace(":", "-")).closest("li").last();

													if(selected_ids[selected_ids.length - 1] == child.id) {
														let $button = $("." + child.id.replace(":", "-"))

														$button.click();

														// Hide the loader
														LOADER.hide("#treeview_container .progress");
														return false;
													} else {
														console.warn(selected_ids[selected_ids.length - 1], child.id);
														build_tree($child_li, child.id, (sub_child_data) => {
															$.each(sub_child_data, (subchild_key, subchild) => {
																// console.warn(child.id, $.inArray(child.id, selected_ids));
																if($.inArray(subchild.id, selected_ids) > -1) {
																	console.log(subchild);
																	let $subchild_li = $("." + child.id.replace(":", "-")).closest("li").last();

																	console.warn(selected_ids[selected_ids.length - 1], subchild.id);
																	if(selected_ids[selected_ids.length - 1] == subchild.id) {
																		let $button = $("." + subchild.id.replace(":", "-"))

																		$button.click();

																		// Hide the loader
																		LOADER.hide("#treeview_container .progress");
																		return false;
																	// } else {
																	// 	console.log("continue");
																	// 	build_tree($child_li, child.id, (sub_child_data) => {
																	// 		$.each(sub_child_data, (subchild_key, subchild) => {
																	// 			console.warn(sub_child.id);
																	// 		});
																	// 	});
																	}
																} else {
																	return false;
																}
																// $.each(data[0], (kk, vv) => {
																// 	if(vv.id == kv.id) {
																// 		console.log($li);
																// 		console.log($("." + vv.id.replace(":", "-")).closest("li"));
																// 	}
																// });
															});
														});
													}
												}
												// $.each(data[0], (kk, vv) => {
												// 	if(vv.id == kv.id) {
												// 		console.log($li);
												// 		console.log($("." + vv.id.replace(":", "-")).closest("li"));
												// 	}
												// });
											});
										});
										// $button.addClass("selected");
										// $prev_tree_icon.click();

										// if(kk == 0) {
											// return false;
										// }
									}
								});
								// let $button = $("." + data[0][1].id.replace(":", "-")),
								// 	$tree_icon = $button.prev();

								// console.info(data[0][1]);

								// $.each(data[0], (k, v) => {
								// 	if(k > 0) {

								// setTimeout(() => {
								// console.log(e);
								// }, 1000);
								// return false;
								// 	}
								// });
								//
								// $.each($li.find(".btn-mini"), (k, v) => {
								// 	let term_id = $(v).data("id"),
								// 		$tree_icon = $(v).prev();
								// 	console.log();
								// })
							});
							// return false;
							// $li.find("a").first().addClass("selected");
						} else {
							// Load childrens
							build_tree($li, id, () => {
								// Hide the loader
								LOADER.hide("#treeview_container .progress");
							});
						}


						// if(page == "terms") {
						// 	/**
						// 	 * Highlight the label on the right
						// 	 */
						// 	$(".treeview a.selected").removeClass("selected");
						// 	DATA.get_term_parents(NAV.get_full_id()).then((data) => {
						// 		$.each(data[0], (k, v) => {
						// 			console.log(k, v);
						// 		});
						// 		let $button = $("." + data[0][1].id.replace(":", "-")),
						// 			$tree_icon = $button.prev();
                        //
						// 		$tree_icon.click();
						// 		$($button).addClass("selected");
						// 		console.info(data[0][1]);
                        //
						// 		// $.each(data[0], (k, v) => {
						// 		// 	if(k > 0) {
                        //
						// 				// setTimeout(() => {
						// 				// console.log(e);
						// 				// }, 1000);
						// 				// return false;
						// 		// 	}
						// 		// });
                        //         //
						// 		// $.each($li.find(".btn-mini"), (k, v) => {
						// 		// 	let term_id = $(v).data("id"),
						// 		// 		$tree_icon = $(v).prev();
						// 		// 	console.log();
						// 		// })
						// 		return false;
						// 	})
						// 	// $li.find("a").first().addClass("selected");
						// }
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

		return $('<div>', {"class": "hitarea " + icon_class})
		// Simulate the click on the first "hitarea"
		// just a first opening of the tree
			.click((e) => {
				action(e, id);
			}
		);
	}

	page_info_btn__actions() {
		$("#page_info .btn-mini, #page_info .card-action .btn").on("click", (e) => {
			e.preventDefault();

			let $dd, $dd2,
				$dl = $("#page_info dl"),
				term_id = "",
				key = "",
				language = "english",
				old_value = "",
				placeholder = "Attribute name",
				context = "add";

			if(!$(e.target).hasClass("add_term")) {
				$dd = $(e.target).closest("dd"),
				$dd2 = $dd.clone(),
				term_id = $dd2.find("a").data("term_id"),
				key = $dd2.find("a").data("key"),
				language = $dd2.find("a").data("language"),
				old_value = $.trim($dd2.text()),
				placeholder = old_value,
				context = "edit";
			}

			let $form = $('<form>', {"method": "post", "enctype": "multipart/form-data", "action": "", "id": "form"}).append(
					$('<div>', {"class": "row"}).append(
						$('<div>', {"class": "col s12 switch"}).append(
							$('<label>').append("Text").append(
								$('<input>', {"type": "checkbox"})
							).append(
								$('<span>', {"class": "lever"})
							).append("File")
						)
					)
				).append(
					$('<div>', {"class": "row"}).append(
						$('<div>', {"class": "input-field inline col s3"}).append(
							$('<select>', {"class": "visible_input", "name": "language"}).append(
								$.map(languages.all, (v, k) => {
									return $('<option>', {"value": v, "selected": (v == languages.default)}).text(STR.ucfirst(v))
								})
							)
						)
					).append(
						$('<div>', {"class": "input-field inline col s9"}).append(
							$('<input>', {"type": "hidden", "name": "term_id"}).val(term_id)
						).append(
							$('<input>', {"type": "hidden", "name": "key"}).val(key)
						).append(
							$('<input>', {"type": "hidden", "name": "language"}).val(language)
						).append(
							$('<input>', {"type": "text", "class": "text_input visible_input", "name": "value", "placeholder": placeholder}).val(old_value)
						).append(
							$('<div>', {"class": "file-field input-field"}).append(
								$('<div>', {"class": "btn highlight-btn btn-mini"}).append(
									$('<span>').text("Upload file")
								).append(
									$('<input>', {"type": "file", "class": "visible_input disabled", "name": "value", "placeholder": "Upload file from your computer"})
								)
							).append(
								$('<div>', {"class": "file-path-wrapper"}).append(
									$('<input>', {"type": "text", "name": "value", "class": "file-path validate disabled"})
								)
							).hide()
						)
					)
				).append(
					$('<div>', {"class": "row"}).append(
						$('<div>', {"class": "col s12"}).append(
							$('<a>', {"href": "javascript:;", "class": "btn-link grey-text left"}).text("‹ Cancel").on("click", (e) => {
								e.preventDefault();
								if(context == "add") {
									$(".add_term").removeClass("disabled");
									$("#add_term_form").html("").hide();
								} else {
									$dd.html($dd2.html()).removeClass("editing");
								}
								this.page_info_btn__actions(term_id, key, language);
							})
						).append(
							$('<a>', {"href": "javascript:;", "class": "btn btn-flat btn-highlight right"}).text("Save").on("click", (e) => {
								e.preventDefault();
								DATA.get_attribute_upload_url().then((upload_url) => {
									$(e.target).closest("form").attr("action", upload_url).submit();
								});
							})
						)
					)
				);

			if($(e.target).hasClass("add_term")) {
				$(e.target).addClass("disabled");
				$("#add_term_form").html($form).show();

				$form.find(".visible_input").focus().on("keypress", (e) => {
					if(e.which == 0) {
						$(".add_term").removeClass("disabled");
						$("#add_term_form").html("").hide();
					}
				});
			} else {
				let $dd = $(e.target).closest("dd");

				$dd.addClass("editing").html($form);
				$dd.find(".visible_input").focus().on("keypress", (e) => {
					if(e.which == 0) {
						$dd.html($dd2.html()).removeClass("editing");
						this.page_info_btn__actions(term_id, key, language);
					}
				});
			}
			$("select").material_select();
			$(".switch").find("input[type=checkbox]").on("change", (e) => {
				if($(e.target).prop("checked")) {
					$(".text_input").hide().addClass("disabled");
					$(".file-field").show().find("input").removeClass("disabled");
				} else {
					$(".text_input").show().removeClass("disabled");
					$(".file-field").hide().find("input").addClass("disabled");
				}
			});
		});
	}

	add_info(source, remote) {
		/**
		 * Filter and order items in the `Term information` box
		 */
		let item_id = source.id,
			hide = {
		        id: true,
				comment: true,
		        "ontology id": true,
		        "ontology name": true,
		        "is a": true,
		        "Name of Trait": true,
		        language: true,
		        "Scale ID for modification, Blank for New":true,
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
		$.each(hide, (k, v) => {
			if(v && source[k] !== undefined) {
				delete source[k];
			}
		});
		// Add first wanted items
		$.each(first, (k, v) => {
			if(v && source[k] !== undefined) {
				ordered_source[k] = source[k];
				delete source[k];
			}
		});
		// Remove but keep last wanted items
		$.each(last, (k, v) => {
			if(v && source[k] !== undefined) {
				last_data_source[k] = source[k];
				delete source[k];
			}
		});
		// Add remaining items
		$.each(source, (k, v) => {
			ordered_source[k] = source[k];
		});
		// Add last wanted items
		$.each(last_data_source, (k, v) => {
			ordered_source[k] = last_data_source[k];
		});
		/**
		 * ---------------------------------------------------------------------
		 */

		if(remote) {
			let name,
				$dl = $("#page_info dl").append(
					$('<dt>', {"class": "grey-text"}).text("Identifier:")
				).append(
					$('<dd>', {"class": "grey-text"}).append(
						$('<tt>').text(item_id + " ")
					).append(
						$('<a>', {"target": "_blank", "href": "https://www.cropontology.org/rdf/" + item_id}).append(
							$('<span>', {"class": "picol_rdf"})
						)
					)
				);
			$.each(ordered_source, (k, v) => {
				$dl.append(
					$('<dt>', {"class": "valign-wrapper"}).append(STR.ucfirst(k) + ":")
				).append(
					$('<dd>').append(() => {
						if(!DATA.get_user_logged() && editable[k] !== undefined) {
							return $('<span>').append(v + " ").append(
								$('<a>', {
									"href": "javascript:;",
									"class": "btn btn-flat btn-mini white highlight-text",
									"data-term_id": item_id,
									"data-key": k,
									"data-language": "english"
								}).append(
									$('<span>', {"class": "fa fa-edit"})
								)
							)
						} else {
							return v;
						}
					})
				)
			});
			$("#term_info_name").text(source.name);
			$("#page_info").html($dl).append(
				$('<div>', {"class": "card-content", "id": "add_term_form"}).hide()
			).append(
				$('<div>', {"class": "card-action"}).append(
					$('<a>', {
						"href": "javascript:;",
						"class": "btn btn-flat white highlight-text add_term"
					})
					.append("Add a new attribute ")
					.append($('<span>', {"class": "fa fa-plus"}))
					// .click((e) => {
					// 	$(e.target).addClass("disabled");
					// })
				)
			);

			this.page_info_btn__actions();
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
			"class": "btn btn-mini tooltipped " + option.id.replace(":", "-") + ((option.is_root || NAV.get_term_id() == option.id) ? " selected" : ""),
			"data-id": option.id
		}).append(
			$('<span>').html(STR.camel_case_2_text(option.term))
		).click((e) => {
			$("#page_info dl").html("");
			$("#comments").html("");

			// Item selection in treeview
			$(".treeview a.selected").removeClass("selected");
			$(e.currentTarget).addClass("selected");

			// Permalink
			let permalink, ext_permalink;
			if(option.is_root || option.id.split(":")[1] == "0000000") {
				permalink = "./ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name),
				history.pushState("", option.term, "/ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name));
			} else {
				permalink = "./terms/" + option.id + ":" + STR.get_ontology_term(option.source.name),
				history.pushState("", option.term, "/terms/" + option.id + ":" + STR.get_ontology_term(option.source.name));
			}
			ext_permalink = "https://www.cropontology.org/terms/" + option.id + "/" + option.term + "/static-html?language=" + ((option.langs.length == 0) ? settings.general.language : option.langs[0]);

			$("#term_info_name").attr("href", permalink).html(option.term);
			$("#term_permalink").attr("href", ext_permalink);

			if(option.is_root || option.id.split(":")[1] == "0000000") {
				this.add_info(
					$('<dl>').append(
						$('<dt>', {"class": "grey-text"}).text("Identifier:")
					).append(
						$('<dd>', {"class": "grey-text"}).append(
							$('<tt>').text(option.id + " ")
						).append(
							$('<a>', {"target": "_blank", "href": "https://www.cropontology.org/rdf/" + option.id}).append(
								$('<span>', {"class": "picol_rdf"})
							)
						)
					).append(
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
				$("#graph_content").html("");
				$("#graph").addClass("disabled");
			} else {
				// Info
				this.disable_info();
				LOADER.create({target: "#pages", type: "progress"});

				DATA.get_ontology_attributes(option.source.id).then((data) => {
					data.id = option.source.id;
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

				LOADER.create({target: "#graph", type: "progress"});
				/**
				 * Get term data and build graph
				 */
				DATA.get_term_parents(option.id).then((data) => {
					// buildGraph($graph, data);
					var render = (r, n) => {
						/* the Raphael set is obligatory, containing all you want to display */
						let id = n.id,
							label = STR.get_ontology_term(n.label),
							biggest = (id.length > label.length) ? id : label,
								set = r.set().push(
								/* custom objects go here */
								r.rect(n.point[0], n.point[1]-13, biggest.length + 120, 44).attr({
									"fill": "#feb",
									r: "12px",
									"stroke-width": n.distance == 0 ? "3px" : "1px"
								})
							).push(
								r.text(n.point[0] + (biggest.length / 2) + 60, n.point[1] + 10, (label || n.id) + "\n(" + (n.id) + ")")
							);
						return set;
					};

					$("#graph_content").html("");
					let width = $("#graph_content").width(),
						height = $("#graph_content").height(),
						g = new Graph();

					g.edgeFactory.template.style.directed = true;

					$.each(data, (idx, el) => {
						for(let i = 0; i < el.length; i++) {
							g.addNode(el[i].id, {
								render: render,
								label: STR.get_ontology_term(el[i].name)
							});
						}
					});
					$.each(data, (idx, el) => {
						for(let i = 0; i < el.length; i++) {
							let next = el[i+1];
							if(next) {
								g.addEdge(next.id, el[i].id, {label: next.relationship});
								//g.addEdge(next.id, el[i].id);
							}
						}
					});

					let layouter = new Graph.Layout.Spring(g);
					layouter.layout();
					let renderer = new Graph.Renderer.Raphael("graph_content", g, parseInt(width), parseInt(height));
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

		if(NAV.get_page() && NAV.get_term_id() == option.id) {
			setTimeout(() => {
				$a.click();
				$a.prev().click();
				this.tree_icon(true, option.id)
			}, 100);
		}

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
		$(this).removeClass("disabled");
	}

	enable_info() {
		$(this).addClass("disabled");
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
						$('<dt>', {"class": "grey-text"}).text("Identifier:")
					).append(
						$('<dd>', {"class": "grey-text"}).append(
							$('<tt>').text(option.source.id + " ")
						).append(
							$('<a>', {"target": "_blank", "href": "https://www.cropontology.org/rdf/" + option.source.id}).append(
								$('<span>', {"class": "picol_rdf"})
							)
						)
					).append(
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
