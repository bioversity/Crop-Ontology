/* jshint esversion: 6 */
"strict mode";

import data from "../../src/js/data.es6";
import pagination from "../../src/js/pagination.es6";
import filters from "../../src/js/filters.es6";
import modals from "../../src/js/modals.es6";
import str from "../../src/js/_str.es6";

var
	DATA = new data(),
	PAGINATION = new pagination(),
	FILTERS = new filters(),
	MODALS = new modals(),
	STR = new str(),

	moment = require("moment")
;

class layout {
	activate() {
		$("select").material_select();

		// Modals
		$(".modal").modal({
			dismissible: true,
			opacity: 0.8,
			ready: function(modal, trigger) {
			},
			complete: function() {
				// this.add_search_filters($(".modal-content").find("form").serializeObject());
				// $("#tags").tagit("createTag", "brand-new-tag");

				// 	$(".modal-content").find("form").serializeObject();//.reduce(function(obj, item) {obj[item.name] = item.value; return obj; }, {}))
				// }
			}
		});

		$(".collapsible").collapsible();

		$(".tooltipped").tooltip({html: true});
	}

	/**
	 * Build a menu
	 * @param  string 						position							The menu position
	 * @return object
	 */
	build_menu(position) {
		let menus = require("../../common/menu.json");

		$.each(menus, (k, v) => {
			$("#" + position).append(
				$.map(v[position].items, (item) => {
					switch(position) {
						case "bottom_links":
							$.each(item.items, (ik, iv) => {
								if(iv.display) {
									$("#" + position).append(
										$('<a>', {"href": iv.link, "target": iv.target, "title": iv.label}).append(
											$('<img>', {"src": "common/img/" + iv.image})
										)
									)
								}
							});
							break;
						case "footer_menu":
							$("#" + item.position).prepend(
								$('<h2>').text(item.title)
							)
							$("#" + item.position).append(
								$('<ul>')
							)
							$.each(item.items, (ik, iv) => {
								$("#" + item.position).find("ul").append(() => {
									if(iv.display) {
										return $('<li>').append(
											$('<a>', {"href": iv.link, "target": iv.target}).text(iv.label)
										);
									}
									if(iv.separator !== undefined) {
										return $('<li>', {"class": "separator"})
									}
								});
							});
							break;
						default:
							if(item.label === undefined && item.separator) {
								switch($.type(item.separator)) {
									case "boolean":
										return $('<li>').append(
											$('<span>', {"class": "separator"})
										);
										break;
									case "string":
										return $('<li>', {"class": "disabled black-text"}).append(
											$('<span>').text(item.separator)
										);
										break;
								}
							} else {
								if(item.display) {
									return $('<li>').append(
										$('<a>', {"href": item.link}).text(item.label)
									);
								}
							}
							break;
					}
				})
			);
		});
	}

	/**
	 * Build the page <header>
	 * @return {[type]} [description]
	 */
	build_header() {
		$("body").prepend(
			$("<header>").append(
				$('<nav>', {"class": "transparent z-depth-0"}).append(
					$('<div>', {"class": "nav-wrapper"}).append(
						$('<a>', {"href": "javascript:;", "class": "brand-logo"}).append(
	                        $('<img>', {"src": "common/img/crop_ontology.png"})
						)
					).append(
						// Top menu container
						$('<ul>', {"id": "top_menu", "class": "right hide-on-med-and-down"})
					)
				)
			)
		);

		/**
		 * Build the top menu
		 * @uses build_menu()
		 */
		this.build_menu("top_menu");
	}

	/**
	 * Build the carousel messages slider
	 */
	build_carousel() {
		let top_carousel = require("../../common/top_carousel.json");

		$("body").append(
			$('<section>', {"id": "top_carousel", "class": "container"}).append(
				$('<div>', {"class": "carousel carousel-slider center"}).append(
					$.map(top_carousel.messages, (message) => {
						message = message.replace(/\n/gm, "<br />");
						message = message.replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>');
						return $('<div>', {"class": "carousel-item valign-wrapper", "href": "#one"}).append(
							$('<h1>').html(message)
						)
					})
				)
			)
		);

		// Instantiate Materialize carousel
		$(".carousel").carousel({
			duration: 50,
			fullWidth: true,
			indicators: false
		}).animate({"opacity": 1}, 300);

		/**
		* Animate the carousel
		* @param integer						time							The delay after carousel change (default is 10'000)
		*/
		setInterval(() => {
			$(".carousel .carousel-item").fadeOut(300, () => {
				$(".carousel").carousel("next");
				$(".carousel .carousel-item").delay(300).fadeIn();
			})
		}, 10000);
	}

	/**
	 * Build the searchbar
	 */
	build_searchbar() {
		// Build the filters modal
		MODALS.filters_modal();

		$("body").append(
			$('<section>', {"id": "searchbar", "class": "container"}).append(
				$('<form>', {"method": "get", "onsubmit": "return false;"}).append(
					$('<div>', {"class": ""}).append(
						$('<div>', {"class": "row bar"}).append(
							$('<div>', {"id": "search_input", "class": "input-field col s8 m8 l8 xl8"}).append(
								$('<input>', {
									"type": "search",
									"id": "search",
									"placeholder": "Search...",
									"name": "q"
								})
							)
						).append(
							$('<div>', {"id": "tags_list", "class": "input-field col s4 m4 l4 xl4"}).append(
								$('<ul>', {"class": "tags"}).append(
									FILTERS.draw_filter("type", "TRAIT")
								).append(
									FILTERS.draw_filter("user", "MALAPORTE")
								)
							)
						)
					).append(
						$('<a>', {"href": "#searchbar_filters", "class": "btn-text blue-text right modal-trigger"}).append(
							$('<span>', {"class": "fa fa-filter"})
						).append(" Add a filter")
					)
				)
			)
		);
	}

	/**
	 * Build the halfway menu
	 */
	build_halfway_menu() {
		$("body").append(
			$('<section>', {"id": "halfway", "class": ""}).append(
				$('<ul>', {"id": "halfway_menu", "class": "center horizontal"})
			)
		);

		/**
		 * Build the top menu
		 * @uses build_menu()
		 */
		this.build_menu("halfway_menu");
	}

	/**
	 * Build the contents section
	 */
	build_contents_section() {
		$("body").append(
			$('<section>', {"id": "contents", "class": ""}).append(
				$('<div>', {"class": "row"}).append(
					$('<div>', {"class": "col s12 m4 l4 xl4"}).append(
						$('<div>', {"class": "row"}).append(
							$('<div>', {"id": "info_container", "class": "col s12 m12 l12 xl12"}).append(
								$('<div>', {"class": "card grey lighten-5"}).append(
									$('<div>', {"class": "card-content"}).append(
										$('<span>', {"class": "card-title highlight"}).text("Instructions")
									).append(
										$('<p>').html("<b>To develop a Trait Dictionary Version 5:</b><ul><li>Download the Trait Dictionary template v5</li><li>Read the Guidelines - may 2018</li><li>Contact helpdesk@cropontologycurationtool.org to get the Crop code for your Trait dictionary and to upload it</li></ul><br /><br /><b>To download a Trait Dictionary from this site:</b><br /><p>Text from the grey banner on the current site</p>")
									)
								)
							)
						).append(
							$('<div>', {"id": "feed_container", "class": "col s12 m12 l12 xl12"})
						)
					)
				).append(
					$('<div>', {"id": "ontologies_container", "class": "col s12 m8 l8 xl8"})
				)
			)
		);

		let news_per_page = 3;

		/**
		 * Feeds
		 * ---------------------------------------------------------------------
		 */
		DATA.get_community_website_feed().then((data) => {
			let $feeds = [],
				feeds = [],
				total_pages = Math.ceil(parseInt(data.length)/news_per_page),
				current_page = 0;

			$.each(data, (k, v) => {
				feeds.push({
					title: data[k].title,
					preview: data[k].preview,
					author: $('<a>', {"href": "mailto:" + data[k].author.email}).text(data[k].author.name).prop("outerHTML"),
					published: moment(data[k].published).local().format("MMM DD, YYYY, h:mm A"),
					link: data[k].link,
					abstract: STR.extract_text(data[k].content) + "<br />"
				});
				if(k % 3 == 0) {
					current_page++;
				}

				let visible = (current_page == 1) ? "visible" : "hide";
				$feeds.push(
					$('<div>', {"class": "card-content feed page_" + current_page + " " + visible})
					.append(
						$('<div>', {"class": "preview"}).append(
							$('<a>', {"href": feeds[k].link}).append(
								$(feeds[k].preview)
							)
						)
					).append(
						$('<span>', {"class": "card-title highlight"}).append(
							$('<a>', {"href": feeds[k].link}).text(feeds[k].title)
						)
					).append(
						$('<div>', {"class": "release"}).append(
							$('<span>', {"class": "far fa-fw fa-clock"})
						).append(
							$('<span>').html(" posted on " + feeds[k].published + " by " + feeds[k].author)
						)
					// ).append(
					// 	$('<div>', {"class": "content"}).append(
					// 		feeds[k].abstract
					// 	).append(
					// 		$('<a>', {"href": feeds[k].link, "class": "readmore"}).text("Read more...")
					// 	)
					)
				);
			});
			$("#feed_container").append(
				$('<div>', {"class": "card z-depth-1"}).append(
					$('<div>', {"class": "card-content"}).append(
						$('<div>', {"class": "card-title highlight"}).append("Latest news")
					)
				).append(
					$feeds
					// PAGINATION.build_pagination({
					// 	id: "feed_pagination",
					// 	content: "#feed_container",
					// 	items: ".feed",
					// 	current_page: 1,
					// 	total_pages: Math.ceil(parseInt(data.length)/news_per_page),
					// })
				).append(
					$('<div>', {"class": "card-action right-align"}).append(
						$('<a>', {"class": "btn btn-flat highlight-btn", "href": "https://sites.google.com/a/cgxchange.org/cropontologycommunity/"}).text("Read more...")
					)
				)
			).slideDown(300);
		}).catch((e) => {
			// handle the error
		});

		/**
		 * Ontologies
		 * ---------------------------------------------------------------------
		 */
		DATA.get_ontologies().then((data) => {
			$("#ontologies_container").append(
				$('<ul>', {"class": "collapsible z-depth-0", "data-collapsible": "accordion"})
			).append(
				$('<h5>', {"class": "all-ontologies"}).append(
					$('<a>', {"href": ""}).text("All ontologies ›")
				)
			)

			var current_page = 1,
				page_limit = 4,
				items = [],

				$pagination = $('<div>', {"class": "ontology_pagination pagination-content"});

			$.each(data, (k, categories) => {
				// console.warn(k);
				var onto_count = 0;

				let pages = (categories.ontologies.length > page_limit) ? Math.ceil(categories.ontologies.length/page_limit) : 1;
				// 	$('<span>', {"class": "left help-text"}).append("Displaying page " + current_page + " of " + pages)
				// ).append(
				// 	$('<ul>', {"class": "pagination center"}).append(
				// 		$('<li>', {"class": "disabled"}).append(
				// 			$('<a>', {"href": "javascript:;"}).append(
				// 				$('<span>', {"class": "fa fa-chevron-left"})
				// 			)
				// 		)
				// 	)
				// 	// ).append(
				// 	// 	$('<li>', {"class": "waves-effect"}).append(
				// 	// 		$('<a>', {"href": "javascript:;"}).text("2")
				// 	// 	)
				// 	// ).append(
				// 	// 	$('<li>', {"class": "waves-effect"}).append(
				// 	// 		$('<a>', {"href": "javascript:;"}).text("3")
				// 	// 	)
				// 	// ).append(
				// 	// 	$('<li>', {"class": "disabled"}).append(
				// 	// 		$('<a>', {"href": "javascript:;"}).append(
				// 	// 			$('<span>', {"class": "fa fa-chevron-right"})
				// 	// 		)
				// 	// 	)
				// );
				// $pagination.find("ul").append(
				// 	$('<li>', {"class": "active"}).append(
				// 			$('<a>', {"href": "javascript:;"}).text("1")
				// 		)
				// 	})
				// )
				// // Add pagination numbers
				// $.each(categories.ontologies, (ko, ontology) => {
				// 	onto_count++;
				// 	console.log(onto_count, onto_count % page_limit == 1);
				// });

				$("#ontologies_container .collapsible").append(
					$('<li>', {
						"class": ((k == 3) ? "active" : ""),
						"id": categories.category.id
					}).append(
						$('<div>', {"class": "collapsible-header " + ((k == 3) ? "active" : "")}).append(
							$('<div>', {"class": "collapsible-secondary help-text"})
								.append(categories.ontologies.length + " " + STR.pluralize(categories.ontologies.length, "item"))
								.append(() => {
									if(pages > 1) {
										let $indications = $('<span>', {
											"class": "tooltipped",
											"data-tooltip": "Displaying page " + current_page + " of " + pages
										}).append(" | ")
										  .append($('<span>', {"class": "far fa-file-alt"}))
										  .append($('<span>', {"class": "page_no grey-text"}).text(current_page))
										  .append("/" + pages)
										  .prop("outerHTML");

										setTimeout(() => {
											$("#ontologies_container .tooltipped").tooltip({position: "left"});
										}, 1000);
										return $indications;
									}
								})
						).append(
							$('<div>', {"class": "left"}).append(
								$('<span>', {"class": categories.category.icon})
							).append(categories.category.name)
						)
					).append(
						$('<div>', {"class": "collapsible-body " + ((pages > 1) ? "paginated" : "")}).append(() => {
							if(pages > 1) { return $pagination; }
						}).append(
							$('<div>', {"id": "ontology_container"}).append(
								$.map(categories.ontologies, (v, k) => {
									if(k < page_limit) {
										return $('<div>', {"class": "content"}).append(
											$('<h2>')
												.append(
													$('<a>', {"href": "javascript:;", "class": "right"}).append("Download").append(
														$('<span>', {"class": "picol_arrow_full_down"})
													)
												).append(v.ontology_name)
										).append(
											$('<span>', {"class": "items_count"}).text(v.tot + " " + STR.pluralize(v.tot, "item"))
										).append(
											$('<p>').text(v.ontology_summary)
										)
									}
								})
							)
						).append(() => {
							if(pages > 1) { return $pagination.clone(); }
						})
					)
				).collapsible()
				$("#" + categories.category.id).find(".pagination-content").append(
					PAGINATION.build_pagination({
						id: "ontology_pagination",
						context_class: categories.category.id + "_pagination",
						content: "#ontology_container",
						items: ".ontology",
						total_pages: Math.ceil(categories.ontologies.length/4),
					})
				);
			})

		}).catch((e) => {
			// handle the error
		})
	}

	/**
	 * Build the footer section
	 */
	build_footer() {
		$("body").append(
			$("<footer>").append(
				$("<div>", {"class": "row"}).append(
					$("<div>", {"class": "col s12 m3 l3 xl3"}).append(
						$('<a>', {"href": "./", "class": "brand-logo"}).append(
							$('<img>', {"src": "common/img/crop_ontology_white.png"})
						)
					).append(
						$('<p>', {"class": "description"}).html("Some identities data<br />such as address, informations, etc...")
					)
				).append(
					$("<div>", {"id": "left_menu", "class": "col s12 m2 l2 xl2"})
				).append(
					$("<div>", {"id": "center_menu", "class": "col s12 m2 l2 xl2"})
				).append(
					$("<div>", {"id": "right_menu", "class": "col s12 m2 l2 xl2"})
				)
			)
		).append(
			$('<section>', {"id": "partners"}).append(
				$('<div>', {"class": "row container center"}).append(
					$('<div>', {"id": "bottom_links", "class": "col s12 m6 l6 xl6"})
				).append(
					$('<div>', {"class": "col s12 m6 l6 xl6 right right-align"}).append(
						$('<a>', {"href": "javascript:;", "target": "_blank"}).append(
							$('<img>', {"src": "common/img/big-data_platform_logo.png"})
						)
					)
				)
			)
		).append(
			$('<center>').append(
				$('<p>').append("Crop Ontology by Integrated Breeding Platform is licensed under a Creative Commons Attribution 4.0 International License")
			)
		);

		/**
		 * Build the footer menu
		 * @uses build_menu()
		 */
		this.build_menu("footer_menu");

		/**
		* Build the bottom links menu
		* @uses build_menu()
		*/
		this.build_menu("bottom_links");
	}
}

export default layout;
