/* jshint esversion: 6 */
"strict mode";

import data from "../../src/js/data.es6";
import navigation from "../../src/js/_navigation.es6";
import pagination from "../../src/js/pagination.es6";
import treeview from "../../src/js/_treeview.es6";
import filters from "../../src/js/filters.es6";
import modals from "../../src/js/modals.es6";
import str from "../../src/js/_str.es6";
import loader from "../../src/js/loader.es6";
/**
* Static pages
*/
import page_about from "../../common/statics/about.html";
import page_privacy_policy from "../../common/statics/privacy_policy.html";
import page_api from "../../common/statics/api.html";
import page_help from "../../common/statics/help.html";
import page_login from "../../common/statics/login.html";
import page_register from "../../common/statics/register.html";
import page_forgot_password from "../../common/statics/forgot-password.html";
import page_feedback from "../../common/statics/feedback.html";
import page_add_ontology from "../../common/statics/add-ontology.html";

var
	DATA = new data(),
	NAV = new navigation(),
	PAGINATION = new pagination(),
	TREEVIEW = new treeview(),
	FILTERS = new filters(),
	MODALS = new modals(),
	STR = new str(),
	LOADER = new loader(),

	URL = "http://www.cropontology.org",

	PAGE_ABOUT = page_about,
	PAGE_PRIVACY_POLICY = page_privacy_policy,
	PAGE_API = page_api.replace(/\{\{URL\}}/igm, window.location).replace(/((<style>)|(<style type=.+))((\s+)|(\S+)|(\r+)|(\n+))(.+)((\s+)|(\S+)|(\r+)|(\n+))(<\/style>)/g, ""),
	PAGE_HELP = page_help,
	PAGE_LOGIN = page_login,
	PAGE_REGISTER = page_register,
	PAGE_FORGOT_PASSWORD = page_forgot_password,
	PAGE_FEEDBACK = page_feedback,
	PAGE_ADD_ONTOLOGY = page_add_ontology,

	page = NAV.get_page(),
	settings = require("../../common/settings/contents.json"),
	top_carousel = require("../../common/settings/top_carousel.json"),

	moment = require("moment"),

	user = {
		logged: false
	}
;

if(settings[page] == undefined) {
	page = "404";
}

class layout {
	activate() {
		/* Add rel="external" to links that are external (this.hostname !== location.hostname) BUT don't add to anchors containing images */
		$("#static_contents a, .license a").each((k, v) => {
		    // Compare the anchor tag's host name with location's host name
		    if($(v).prop("hostname") && $(v).prop("hostname") !== location.hostname) {
				$(v).not("a:has(img)").attr("rel","external")
			}
		});


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

		$(".materialboxed").materialbox();

		$(".parallax").parallax();

		$(".tabs").tabs();

		$("textarea.autoresize").trigger("autoresize");

		/**
		 * Behaviours after page build
		 * ---------------------------------------------------------------------
		 */
		switch(page) {
			case "home":
				// Add the loader for news and info contents
				LOADER.create({target: ".help", type: "progress"});
				break;
			case "ontology":
				// Add the loader for news and info contents
				LOADER.create({target: "#contents", type: "progress"});
				break;
		}
	}

	/**
	 * Build a menu
	 * @param  string 						position							The menu position
	 * @return object
	 */
	build_menu(position) {
		let menus = require("../../common/settings/menu.json");

		$.each(menus, (k, v) => {
			$("#" + position).append(
				$.map(v[position].items, (item) => {
					switch(position) {
						case "bottom_links":
							$.each(item.items, (ik, iv) => {
								if(iv.display) {
									$("#" + position + " ." + item.position).append(
										$('<a>', {"class": "tooltipped", "href": iv.link, "target": iv.target, "data-tooltip": iv.label}).append(
											$('<img>', {"src": "common/img/" + iv.image})
										)
									)
								}
							});
							break;
						case "footer_menu":
							$("#" + item.position).prepend(
								$('<h2>').html(item.title)
							)
							$("#" + item.position).append(
								$('<ul>', {"class": item.class})
							)
							$.each(item.items, (ik, iv) => {
								$("#" + item.position).find("ul").append(() => {
									if(iv.display) {
										return $('<li>').append(
											$('<a>', {"href": iv.link, "target": iv.target, "data-tooltip": iv.label, "class": "tooltipped"}).append((iv.icon !== undefined) ? $('<span>', {"class": iv.icon}) : iv.label)
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
										$('<a>', {"href": item.link, "class": item.class}).text(item.label)
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
						$('<a>', {"href": "./", "class": "brand-logo"}).append(
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
		let path = STR.ucfirst(NAV.get_url_path()[NAV.get_url_path().length - 1]);

		$("body").append(
			$('<section>', {"id": "top_carousel", "class": ""}).append(
				$('<div>', {"class": "carousel carousel-slider center"}).append(
					$('<div>', {"class": "carousel-fixed-item container"}).append(() => {
						if(page == "ontology") {
							return $('<div>', {"class": "left"}).append(
								$('<h1>', {"id": "page_subtitle"}).text(NAV.get_ontology_id())
							).append(
								$('<h2>', {"id": "page_title"}).text(NAV.get_ontology_label())
							);
						} else {
							return $('<div>', {"class": "left"}).append(
								$('<h1>', {"id": "page_title"}).text(settings[page].title)
							);
						}
					})
				).append(
					$.map(top_carousel.messages, (v) => {
						v.message = v.message.replace(/\n/gm, "<br />");
						v.message = v.message.replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>');
						return $('<div>', {"class": "carousel-item valign-wrapper", "href": "#one"}).append(() => {
							if(v.image !== "") {
								return $('<img>', {"src": v.image, "class": "responsive-img"});
							}
						}).append(
							$('<h1>').html(v.message)
						)
					})
				)
			)
		);

		// Instantiate Materialize carousel
		$(".carousel").carousel({
			duration: 50,
			// dist: 0,
			// noWrap: true,
			fullWidth: true,
			indicators: false
		}).animate({"opacity": 1}, 300).css("pointer-events", "none");

		/**
		* Animate the carousel
		* @param integer						time							The delay after carousel change (default is 10'000)
		*/
		// setInterval(() => {
		// 	// $(".carousel .carousel-item").fadeOut(300, () => {
		// 		$(".carousel").carousel("next");
		// 		// $(".carousel .carousel-item").delay(300).fadeIn();
		// 	// })
		// }, 10000);
	}

	/**
	 * Build the searchbar
	 */
	build_searchbar() {
		// Build the filters modal
		// MODALS.filters_modal();

		if(settings.general.search.visible) {
			let $searchbar = $('<div>', {"class": "bar"}).append(
					$('<div>', {"id": "search_input", "class": "input-field col s8 m8 l8 xl8"}).append(
						$('<input>', {
							"type": "search",
							"id": "search",
							"placeholder": "Search...",
							"name": "q"
						})
					)
				),
				$breadcrumbs = $('<nav>', {"class": "transparent z-depth-0"}).append(
    				$('<div>', {"class": "nav-wrapper"}).append(
      					$('<div>', {"class": "col s12"}).append(
        					$('<a>', {"href": "./", "class": "breadcrumb"}).append(
								$('<span>', {"class": "fas fa-home grey-text"})
							)
						).append(() => {
							if(NAV.get_url_path().length > 1) {
								let path = [];
								return $.map(NAV.get_url_path(), (v, k) => {
									path.push(v);
									if(k < (NAV.get_url_path().length - 1)) {
										return $('<a>', {"href": "./" + path.join("/"), "class": "breadcrumb"}).text(STR.ucfirst(v))
									} else {
										return $('<span>', {"class": "breadcrumb"}).html(STR.ucfirst(v).replace(NAV.get_ontology_url_regex(":"), "<tt>$1</tt> $2"))
									}
								})
							} else {
								return $('<span>', {"class": "breadcrumb"}).text(STR.ucfirst(NAV.get_page()))
							}
						})
					)
				)
            ;

			if(page == "home") {
				$("body").append(
					$('<section>', {"id": "searchbar", "class": "container"}).append(
						$('<form>', {"method": "get", "onsubmit": "return false;"}).append(
							$('<div>', {"class": ""}).append(
								$('<div>', {"class": "row"}).append(
									$searchbar
								).append(() => {
									if(settings.general.search.tags.visible) {
										return $('<div>', {"id": "tags_list", "class": "input-field col s4 m4 l4 xl4"}).append(
											$('<ul>', {"class": "tags"}).append(
												FILTERS.draw_filter("type", "TRAIT")
											).append(
												FILTERS.draw_filter("user", "MALAPORTE")
											)
										)
									}
								})
							).append(() => {
								if(settings.general.search.filters.visible) {
									return $('<a>', {"href": "#searchbar_filters", "class": "btn-text blue-text right modal-trigger"}).append(
										$('<span>', {"class": "fa fa-filter"})
									).append(" Add a filter")
								}
							})
						)
					)
				);
			} else {
				$("body").append(
					$('<section>', {"id": "navbar", "class": "container"}).append(
						$('<div>', {"class": "row"}).append(
							$('<div>', {"id": "breadcrumb", "class": "col s12 m6 l6"}).append(
								$breadcrumbs
							)
						).append(
							$('<div>', {"id": "searchbar", "class": "col s12 m6 l6"}).append(
								$searchbar
							)
						)
					)
				);
			}
		}
	}

	/**
	 * Build the halfway menu
	 */
	build_halfway_menu() {
		if(settings.general.halfway_menu.visible) {
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
	}

	/**
	 * Build the contents section
	 * @uses build_page_contents()
	 */
	build_contents_section() {
		/**
		 * Content container
		 */
		$("body").append(
			$('<section>', {"id": "contents", "class": ""}).append(() => {
				/**
				 * Home layout
				 * -------------------------------------------------------------
				 */
				if(page == "home") {
					return $('<div>', {"class": "row"}).append(
						$('<div>', {"class": "col s12 m4 l4 xl4"}).append(
							$('<div>', {"class": "row"}).append(
								$('<div>', {"id": "info_container", "class": "col s12 m12 l12 xl12"}).append(
									$('<div>', {"class": "card lighten-5"}).append(
										$('<div>', {"class": "card-content"}).append(
											$('<span>', {"class": "card-title highlight"})
										).append(
											// Loader
											// ---------------------------------
											$('<div>', {"class": "help"}).append(
												$('<div>', {"class": "center-align"}).text(settings.general.loader.text)
											)
											// ---------------------------------
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
					/**
					 * ---------------------------------------------------------
					 */
				} else {
					return $('<div>', {"class": "container"});
				}
			})
		);

		/**
		 * Get and place contents in the page
		 */
		this.build_page_contents();
	}

	/**
	 * Build pages contents
	 */
	build_page_contents() {
		// Build the user account modal
		MODALS.user_modal("Login");

		switch(page) {
			/**
			 * 							404 contents
			 * -----------------------------------------------------------------
			 */
			case "404":
				$("#contents .container").append(
					$('<center>', {"class": "flow-text"}).text("The page you are looking for does not exists")
				);
				break;
			/**
			 * 							HOME contents
			 * -----------------------------------------------------------------
			 */
			case "home":
				/**
				 * Info
				 * -------------------------------------------------------------
				 */
				DATA.get_help_content().then((data) => {
					if(settings.home.sections.help.visible) {
						// LOADER.hide("#help");
						$("#info_container .card-title").append(
							$('<small>', {"class": "far fa-question-circle grey-text"})
						).append(" " + settings.home.sections.help.title);
						$("#info_container .card-content .help").html(data[0].content.replace("<ul>", '<ul class="browser-default">'));
						// return data[0].content;
					}
				});

				/**
				 * Feeds
				 * -------------------------------------------------------------
				 */
				DATA.get_community_website_feed().then((data) => {
					if(settings.home.sections.news.visible) {
						var $feeds = [],
							feeds = [],
							total_pages = Math.ceil(parseInt(data.length)/settings.home.sections.news.items_per_page),
							visible_data = 0,
							current_page = 0,
							visible;

						$.each(data, (k, v) => {
							if(v.category[0].label == "announcement") {
								visible_data++;
								if(visible_data % parseInt(settings.home.sections.news.items_per_page + 1) == 0) {
									current_page++;
								}

								feeds.push({
									page: current_page,
									visible: (current_page == 0) ? "visible" : "hide",
									title: v.title,
									preview: v.preview,
									author: $('<a>', {"href": "mailto:" + v.author.email}).text(v.author.name).prop("outerHTML"),
									published: moment(v.published).local().format("MMM DD, YYYY"),
									link: v.link,
									abstract: STR.extract_text(v.content) + "<br />"
								});

							}
						});
						$.each(feeds, (k, v) => {
							$feeds.push(
								$('<div>', {"class": "feed page_" + v.page + " " + v.visible})
								.append(
									$('<div>', {"class": "preview"}).append(
										$('<a>', {"href": v.link}).append(
											$(v.preview)
										)
									)
								).append(
									$('<span>', {"class": "card-title highlight"}).append(
										$('<a>', {"href": v.link}).text(v.title)
									)
								).append(
									$('<div>', {"class": "release"}).append(
										$('<span>', {"class": "far fa-fw fa-clock"})
									).append(
										$('<span>').html(" " + v.published + " by " + v.author)
									)
			                        // Uncomment below if you want the "abstract" content and the "Read more..." button on each news
			                        //
									// ).append(
									// 	$('<div>', {"class": "content"}).append(
									// 		v.abstract
									// 	).append(
									// 		$('<a>', {"href": v.link, "class": "readmore"}).text("Read more...")
									// 	)
								)
							);
						});

						$("#feed_container").append(
							$('<div>', {"class": "card z-depth-1"}).append(
								$('<div>', {"class": "card-content"}).append(
									$('<div>', {"class": "card-title highlight"}).append(settings.home.sections.news.title)
								)
							).append(
								$('<div>', {"class": "card-content"}).append(
									$feeds

									// Uncomment below if you want news pagination
									//
									// PAGINATION.build_pagination({
									// 	id: "feed_pagination",
									// 	content: "#feed_container",
									// 	items: ".feed",
									// 	current_page: 1,
									// 	total_pages: Math.ceil(parseInt(data.length)/settings.home.sections.news.items_per_page),
									// })
								)
							).append(
								$('<div>', {"class": "card-action right-align"}).append(
									$('<a>', {"class": "btn btn-flat highlight-btn", "href": "https://sites.google.com/a/cgxchange.org/cropontologycommunity/"}).text("Read more...")
								)
							)
						).slideDown(300);
					}
				}).catch((e) => {
					// handle the error
				});

				/**
				 * Ontologies
				 * -------------------------------------------------------------
				 */
				DATA.get_ontologies().then((data) => {
					if(settings.home.sections.ontologies.visible) {
						$("#ontologies_container").append(
							$('<h5>').text("Ontologies")
						).append(
							$('<ul>', {"class": "collapsible z-depth-0", "data-collapsible": "accordion"})
						).append(
							$('<h5>', {"class": "all-ontologies"}).append(
								$('<a>', {"href": ""}).text("All ontologies ›")
							)
						)

						var current_page = 1,
							page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
							page_content = [];

						if(page_limit <= 0) {
							page_limit = 1;
						}

						/**
						 * Cycle categories (5 items)
						 */
						$.each(data, (k, categories) => {
							let page = 0,
								pages = (categories.ontologies.length > page_limit) ? Math.ceil(categories.ontologies.length/page_limit) : 1,
								page_count = 0,
								$pagination = $('<div>', {"class": "ontology_pagination pagination-content"}),
								$ontology_page = null;

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
														"data-tooltip": "Displaying page " + current_page + " of " + pages + " - " + page_limit + " items per page"
													}).append(" | ")
													  .append($('<span>', {"class": "far fa-file-alt"}))
													  .append($('<span>', {"id": "page_no", "class": "grey-text"}).text(current_page))
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
										).append(
											$('<span>').text(categories.category.name)
										)
									)
								).append(
									$('<div>', {"class": "collapsible-body" + ((pages > 0) ? " paginated" : "")}).append(() => {
										if(pages > 1) { return $pagination; }
									}).append(
										$('<ul>', {"id": "ontology_container"}).append(
											/**
											 * Cycle all ontologies
											 */
											$.map(categories.ontologies, (vv, kk) => {
												page_count = (kk + 1);

												/**
												 * Subdivide ontologies in pages
												 */
												if(page_count % page_limit == 1 || page_limit == 1) {
													page++;

													let display = (page == 1 || pages == 1) ? "" : "hide";
													$ontology_page = $('<li>', {"class": "ontology page_" + page + " " + display}).append(
														$('<ul>', {"class": "collection"})
													);
												}
												$ontology_page.find(".collection").append(
													$('<li>', {"class": "collection-item"}).append(
														$('<a>', {
															"href": "./ontology/" + vv.ontology_id + ":" + vv.ontology_name.replace("/", "-")
														}).append(
															$('<h2>').append(vv.ontology_name)
														)
													).append(
														$('<a>', {"href": "javascript:;", "class": "secondary-content download"}).append("Download").append(
															$('<span>', {"class": "picol_arrow_full_down"})
														)
													).append(
														$('<span>', {"class": "items_count"}).text(vv.tot + " " + STR.pluralize(vv.tot, "item"))
													).append(
														$('<p>').text(vv.ontology_summary)
													)
												);
												return $ontology_page;
											})
										)
									).append(() => {
										if(pages > 1) { return $pagination.clone(); }
									})
								)
							).collapsible();

							$("#" + categories.category.id).find(".pagination-content").append(
								PAGINATION.build_pagination({
									id: "ontology_pagination",
									context_class: categories.category.id,
									content: "#ontology_container",
									items: ".ontology",
									total_pages: pages,
								})
							);
						});
					}
				}).catch((e) => {
					// handle the error
				});
				break;
   			/**
   			 * 							CONTACT US contents
			 * -----------------------------------------------------------------
   			 */
			case "contact-us":
			case "contact us":
				$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "contact_form").append(
					$('<form>', {
						"method": "get",
						"onsubmit": "return false;"
					}).append(
						$('<div>', {"class": "row"}).append(
							$('<form>', {"class": "col s12 m6 offset-m3"}).append(
								$('<div>', {"class": "row"}).append(
									$('<div>', {"class": "input-field col s6"}).append(
										$('<input>', {"type": "text", "id": "first_name", "class": "validate"})
									).append(
										$('<label>', {"for": "first_name"}).text("First name")
									)
								).append(
									$('<div>', {"class": "input-field col s6"}).append(
										$('<input>', {"type": "text", "id": "last_name", "class": "validate"})
									).append(
										$('<label>', {"for": "last_name"}).text("Last name")
									)
								).append(
									$('<div>', {"class": "input-field col s12"}).append(
										$('<input>', {"type": "email", "id": "email", "class": "validate"})
									).append(
										$('<label>', {"for": "email"}).text("E-mail address")
									)
								)
							).append(
								$('<div>', {"class": "row"}).append(
									$('<div>', {"class": "input-field col s10"}).append(
										$('<input>', {"type": "text", "id": "subject", "class": "validate"})
									).append(
										$('<label>', {"for": "subject"}).text("Subject")
									)
								).append(
									$('<div>', {"class": "input-field col s12"}).append(
										$('<textarea>', {"id": "message", "class": "materialize-textarea"})
									).append(
										$('<label>', {"for": "message"}).text("Message")
									)
								).append(
									// Google reCAPTCHA
									$('<div>', {"class": "g-recaptcha right", "data-sitekey": "6LdssoIUAAAAAIQYYHDi_jMiGHylKTm7JpPiq1GY"})
								)
							).append(
								$('<div>', {"class": "row"}).append(
									$('<a>', {"class": "btn btn-flat right waves-effect waves-light", "href": "javascript:;"}).text("Send")
								)
							)
						)
					)
				)
				break;
   			/**
   			 * 							ABOUT contents
			 * -----------------------------------------------------------------
   			 */
			case "about":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_ABOUT);
				break;
   			/**
   			 * 							PRIVACY POLICY contents
			 * -----------------------------------------------------------------
   			 */
			case "privacy-policy":
			case "privacy policy":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_PRIVACY_POLICY);
				break;
			/**
			 * 							API contents
			 * -----------------------------------------------------------------
			 */
			case "api":
			case "API":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_API);
				break;
			/**
			 * 							HELP contents
			 * -----------------------------------------------------------------
			 */
			case "help":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_HELP);
				break;
			/**
			 * 							LOGIN contents
			 * -----------------------------------------------------------------
			 */
			case "login":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_LOGIN);
				break;
			/**
			 * 							REGISTER contents
			 * -----------------------------------------------------------------
			 */
			case "register":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_REGISTER);
				break;
			/**
			 * 							FORGOT-PASSWORD contents
			 * -----------------------------------------------------------------
			 */
			case "forgot-password":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_FORGOT_PASSWORD);
				break;
			/**
			 * 							FEEDBACK contents
			 * -----------------------------------------------------------------
			 */
			case "feedback":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_FEEDBACK);
				break;
			/**
			 * 							ADD-ONTOLOGIES contents
			 * -----------------------------------------------------------------
			 */
			case "add-ontology":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_ADD_ONTOLOGY);
				break;
			/**
			 * 							ONTOLOGIES contents
			 * -----------------------------------------------------------------
			 */
			case "ontology":
				let name = "",
					term = "",
					language = "english";

				DATA.get_ontologies_data(NAV.get_ontology_id()).then((ontologies_data) => {
					$('<div>', {"id": "ontology_card", "class": "row container"}).append(
						$('<div>', {"class": "col s2"}).append(
							$('<img>', {"class": "crop_pict responsive-img", "src": ontologies_data.ontology_picture})
						)
					).append(
						$('<div>', {"class": "col s10"}).append(
							$('<h1>').append(() => {
								if(ontologies_data.ontology_title.link !== "") {
									return $('<a>', {"href": ontologies_data.ontology_title.link, "target": "_blank"}).text(ontologies_data.ontology_title.title);
								} else {
									return ontologies_data.ontology_title.title;
								}
							})
						).append(
							$('<table>').append(
								$('<thead>').append(
									$('<tr>').append(
										$('<th>').text("Ontology curators")
									).append(
										$('<th>').text("Scientists")
									).append(
										$('<th>', {"class": "center"}).text("Crop Lead Center")
									).append(
										$('<th>', {"class": "center"}).text("Partners")
									).append(
										$('<th>', {"class": "center"}).text("CGIAR research program")
									)
								)
							).append(
								$('<tbody>').append(
									$('<td>').append(() => {
										if(ontologies_data.ontology_curators.length > 0 && ontologies_data.ontology_curators[0] !== "") {
											return $('<ul>', {"class": "browser-default"}).append(
												$.map(ontologies_data.ontology_curators, (v, k) => {
													return $('<li>').append(v);
												})
											);
										}
									})
								).append(
									$('<td>').append(() => {
										if(ontologies_data.scientists.length > 0 && ontologies_data.scientists[0] !== "") {
											return $('<ul>', {"class": "browser-default"}).append(
												$.map(ontologies_data.scientists, (v, k) => {
													return $('<li>').append(v);
												})
											);
										}
									})
								).append(
									$('<td>', {"class": "center"}).append(() => {
										if(ontologies_data.lead_centers.length > 0) {
											// 	console.info(v.image);
											return $('<div>').append(
												$.map(ontologies_data.lead_centers, (v, k) => {
													return $('<a>', {"href": v.link, "target": "_blank"}).append(
														$('<img>', {"src": "common/img/" + v.image})
													)
												})
											).html();
										}
									})
								).append(
									$('<td>', {"class": "center"}).append(() => {
										if(ontologies_data.partners.length > 0) {
											// 	console.info(v.image);
											return $('<div>').append(
												$.map(ontologies_data.partners, (v, k) => {
													return $('<a>', {"href": v.link, "target": "_blank"}).append(
														$('<img>', {"src": "common/img/" + v.image})
													)
												})
											).html();
										}
									})
								).append(
									$('<td>', {"class": "center"}).append(() => {
										if(ontologies_data.cgiar_research_program.length > 0) {
											// 	console.info(v.image);
											return $('<div>').append(
												$.map(ontologies_data.cgiar_research_program, (v, k) => {
													return $('<a>', {"href": v.link, "target": "_blank"}).append(
														$('<img>', {"src": "common/img/" + v.image})
													)
												})
											).html();
										}
									})
								)
							)
						)
					).insertAfter("#contents .progress");
				});

				DATA.get_ontology(NAV.get_ontology_id()).then((data) => {
					LOADER.hide("#contents .progress");

					let langs = [];

					langs.push(STR.get_ontologies_languages(data.name));

					$("#ontology_tree .languages_refresh select").append(
						$.map(langs, (lang) => {
							return $('<option>', {
								"value": lang.toLowerCase(),
								"selected": ((lang.toLowerCase() == settings.general.language) ? true : false),
							}).text(lang)
						})
					).attr("disabled", (langs.length == 1)).material_select();

					TREEVIEW.add_items({
						item: "#treeview",
						source: data,
						term: '<tt>' + NAV.get_ontology_id() + "</tt> - " + STR.get_ontology_term(data.name),
						is_root: true,
						langs: langs
					});

					$("#term_permalink").attr("data-permalink", "http://www.cropontology.org/terms/" + data.id + "/" + term)
					$("#ontology_tree, #ontology_info").removeClass("disabled");
				});

				DATA.get_ontology_comments(NAV.get_ontology_id()).then((data) => {
					let comments_count = $.map(data, function(n, i) { return i; }).length;
					if(jQuery.isEmptyObject(data)) {
						data = {};
					}
					$("#new-comments a").text("Comments (" + comments_count + ")");
					$("#comments").append();
				});

				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").append(
						$('<div>', {"class": "row"}).append(
							$('<div>', {"class": "col s5"}).append(
								$('<h6>').text("Traits, methods and scales")
							).append(
								$('<div>', {"id": "ontology_tree", "class": "card z-depth-0 disabled"}).append(
									$('<nav>').append(
										$('<div>', {"class": "languages_refresh left"}).append(
											$('<select>', {"name": "language"})
										)
									).append(
										$('<ul>', {"class": "right"}).append(
											$('<li>').append(
												$('<a>', {"href": "javascript:;", "class": ""}).text("Download")
											)
										)
									)
								).append(
									$('<div>', {"id": "treeview_container", "class": "card-content"}).append(
										$('<ul>', {"id": "treeview", "class": "treeview"})
									)
								)
							)
						).append(
							$('<div>', {"class": "col s7"}).append(
								$('<h6>').text("Term information")
							).append(
								$('<div>', {"id": "ontology_info", "class": "disabled"}).append(
									$('<div>', {"class": "card z-depth-1 browser-content browser"}).append(
										$('<nav>', {"class": "nav-extended"}).append(
											$('<div>', {"class": "nav-content"}).append(
												$('<ul>', {"class": "tabs"}).append(
													$('<li>', {"id": "general", "class": "tab"}).append(
														$('<a>', {"href": "#page_info", "class": "active"}).text("General")
													)
												).append(
													$('<li>', {"id": "new-comments", "class": "tab"}).append(
														$('<a>', {"href": "#page_comments"}).text("Comments")
													)
												)
											)
										).append(
											$('<div>', {"class": "filterbar nav-wrapper"}).append(
												$('<ul>', {"class": "filters left"}).append(
													$('<li>', {"data-filter": "read"}).append(
														$('<span>', {"id": "term_info_name"})
													).append(
														$('<a>', {"href": "javascript:;", "id": "term_permalink", "class": "right tooltipped", "data-tooltip": "Permalink"}).append(
															$('<span>', {"class": "fa fa-link"})
														)
													)
												)
											)
										)
									).append(
										$('<div>', {"id": "pages"}).append(
											$('<div>', {"id": "page_info", "class": "card-content"})
										).append(
											$('<div>', {"id": "page_comments", "class": "card-content"}).append(
												$('<ul>', {"id": "comments", "class": "collection"})
											).append(
												$('<div>', {"id": "comment_form"}).append(() => {
													if(user.logged) {
														return $('<center>', {"class": "grey-text"}).append(
															$('<i>').text("Please log in to comment")
														)
													} else {
														return $('<div>', {"class": "row"}).append(
															$('<div>', {"class": "input-field col s12"}).append(
																$("<textarea>", {
																	"name": "comment",
																	"class": "materialize-textarea",
																	"id": "comment_input"
																})
															).append(
																$('<label>', {"for": "comment_input"}).text("Add a comment")
															)
														)
													}
												})
											)
										)
									)
								).append(
									$('<div>', {"id": "graph", "class": "card"}).append()
								)
							)
						)
					);

					$("#contents").prepend(
						LOADER.create({type: "progress"})
					);
				break;
		}
	}

	/**
	 * Build the footer section
	 */
	build_footer() {
		if(settings.general.footer.visible) {
			$("body").append(
				$("<footer>", {"class": "parallax-container"}).append(
					$("<div>", {"class": "parallax"}).append(
						$("<img>", {"src": "common/img/" + settings.general.footer.background})
					)
				).append(
					$("<div>", {"class": "row"}).append(
						$("<div>", {"class": "col s12 m3 l3 xl2"}).append(
							$('<a>', {"href": "./", "class": "brand-logo"}).append(
								$('<img>', {"class": "responsive-img", "src": "common/img/" + settings.general.footer.logo})
							)
						).append(
							$('<p>', {"class": "description"}).html(settings.general.footer.description)
						)
					).append(
						$("<div>", {"id": "left_menu", "class": "col s12 m2 l2 xl2 offset-xl1"})
					).append(
						$("<div>", {"id": "center_menu", "class": "col s12 m2 l2 xl2"})
					).append(
						$("<div>", {"id": "right_menu", "class": "col s12 m2 l2 xl2 offset-xl1"})
					)
				)
			).append(
				$('<section>', {"id": "bottom_links"}).append(
					$('<div>', {"class": "row container"}).append(
						$('<div>', {"id": "", "class": "col s12 m6 l6 xl6 left"})
					).append(
						$('<div>', {"id": "owner", "class": "col s12 m6 l6 xl6 right right-align"})
					)
				)
			).append(
				$('<center>', {"class": "license"}).append(
					$('<p>').html(settings.general.license.text)
				)
			);
		}

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
		// this.build_menu("owner");
	}
}

export default layout;
