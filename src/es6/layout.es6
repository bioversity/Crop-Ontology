/* jshint esversion: 6 */
"strict mode";

import data from "../../src/es6/data.es6";
import navigation from "../../src/es6/_navigation.es6";
import pagination from "../../src/es6/pagination.es6";
import treeview from "../../src/es6/_treeview.es6";
import filters from "../../src/es6/filters.es6";
import modals from "../../src/es6/modals.es6";
import str from "../../src/es6/_str.es6";
import loader from "../../src/es6/loader.es6";
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
import page_annotation_tool from "../../common/statics/annotation-tool.html";

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
	PAGE_ANNOTATION_TOOL = page_annotation_tool,

	page = NAV.get_page(),
	settings = require("../../common/settings/contents.json"),
	languages = require("../../common/settings/languages.json"),

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
		    if($(v).prop("hostname") && $(v).prop("hostname") !== location.hostname && $(v).prop("hostname") !== "www.cropontology.org") {
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

		// Sidenav
		$(".button-collapse").sideNav({edge: "right"});

		let search_data = {};
		$("input.autocomplete").on("keyup", (e) => {
			let start_search_after = 3,
				reg = new RegExp("[\\w\\d\\\\\/\\-\\_\\p{L}]");

			// Intercept only word, digits and allowed special characters (see regex above)
			if($("input.autocomplete").val().length > start_search_after && reg.test(e.key)) {
				// The search loader
				LOADER.create({
					type: "circular",
					size: "micro",
					colour: "yellow",
					target: "#search_loader"
				});
				DATA.search($("input.autocomplete").val()).then((data) => {
					LOADER.hide("#search_loader", true);
					$.each(data, (k, v) => {
						search_data["<small><tt>" + v.id + "</tt></small> - " + v.ontology_name + " - " + STR.get_ontology_term(JSON.stringify(v.name))] = null;
					});

					$("input.autocomplete").autocomplete({
						data: search_data,
						minLength: start_search_after,
						limit: 50,
						onAutocomplete: function(val) {
							location.href = "./terms/" + val.replace(/ \- (.*?) \- /g, "/");
						},
					}).blur().focus();
				});
			}
	    });


		$(".collapsible").collapsible();

		$(".tooltipped").tooltip({html: true});

		$(".materialboxed").materialbox();

		$(".parallax").parallax();

		$(".tabs:not(.add-ontology)").tabs();

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
			case "register":
				$.validator.setDefaults({
					errorClass: 'invalid',
					validClass: "valid",
					errorPlacement: (error, element) => {
						$(element)
						.closest("form")
						.find("label[for='" + element.attr("id") + "']")
						.attr('data-error', error.text());
					},
					submitHandler: (form) => {
						if(grecaptcha.getResponse().length == 0) {
							DATA.register_user($("#register_form").serializeObject()).then((response) => {
								if(response.message !== undefined) {
									Materialize.toast('<span class="fa fa-2x fa-check grey-text"></span> ' + response.message, 2000, "", () => {
										location.reload();
									});
								} else {
									$("#register_form :input").blur().removeClass("invalid").removeClass("valid");
									Materialize.toast('<span class="fa fa-2x fa-times grey-text"></span> ' + response.error, 4000);
								}
							});
						}
					}
				});
				$("#register_form").validate({
					rules: {
						first_name: {
							required: true
						},
						sirname: {
							required: true
						},
						email: {
							required: true,
							email: true
						},
						username: {
							required: true,
							minlength: 2
						},
						password: {
							required: true,
							minlength: 5
						},
						confirm_password: {
							required: true,
							minlength: 5,
							equalTo: "#password"
						},
					},
					messages: {
						first_name: "Please specify your name",
						sirname: "Please specify your last name",
						email: {
							required: "Please specify an e-mail address",
							email: "Your email address must be in the format of name@domain.com"
						},
						username: {
							required: "Please insert an username",
							minlength: "Your username must consist of at least 2 characters"
						},
						password: {
							required: "Please insert a password",
							minlength: "Your password must be at least 5 characters long",
						},
						confirm_password: {
							required: "Please insert a password",
							minlength: "Your password must be at least 5 characters long",
							equalTo: "Please enter the same password as before"
						}
					}
				});
				break;
		}

		// Adapt graph on fullscreen mode
		$(document).bind("fscreenchange", (e, state, elem) => {
			if($(elem).attr("id") == "graph") {
				if(state) {
					$(".fa-expand").removeClass("fa-expand").addClass("fa-compress");

					$("#graph.fullscreen").find(".btn.fullscreen").attr("data-tooltip", "Exit fullscreen").click((e) => {
						$.fullscreen.exit();
					});
				} else {
					$(".fa-compress").removeClass("fa-compress").addClass("fa-expand");

					$("#graph.fullscreen").find(".btn.fullscreen").attr("data-tooltip", "Show fullscreen")
				}
			}
		});
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
				$.map(v[position].items, (item, k) => {
					switch(position) {
						case "top_menu":
							let display = (!item.is_sidenav_link) ? (k >= 6 ? " hide-on-med-and-down" : " hide-on-small-only") : "";

							if(item.label === undefined && item.separator) {
								switch($.type(item.separator)) {
									case "boolean":
										return $('<li>', {"class": display}).append(
											$('<span>', {"class": "separator"})
										);
										break;
									case "string":
										return $('<li>', {"class": "disabled black-text" + display}).append(
											$('<span>').text(item.separator)
										);
										break;
								}
							} else {
								if(item.display) {
									let $li = $('<li>').append(
										$('<a>', {
											"href": item.link,
											"class": item.class + display
										}).append(() => {
											if(!item.is_sidenav_link) {
												return item.label;
											} else {
												return $('<i>', {"class": "material-icons"}).text("menu");
											}
										})
									);
									if(item.data !== undefined) {
										$.each(item.data, (data_key, data_value) => {
											$li.find("a").attr("data-" + data_key, data_value);
										})
									}
									if(item.is_sidenav_link) {
										$li.addClass("right show-on-medium-and-down");
									}
									return $li;
								}
							}
							break;
						case "bottom_links":
							$.each(item.items, (ik, iv) => {
								if(iv.display) {
									$("#" + position + " ." + item.position).append(
										$('<a>', {"class": "tooltipped", "href": iv.link, "target": iv.target, "data-tooltip": iv.label}).append(
											$('<img>', {"class": "", "src": "common/media/img/" + iv.image})
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
										return $('<li>', {"class": "divider"}).append(
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
	                        $('<img>', {"src": "common/media/img/crop_ontology.png"})
						)
					).append(
						// Sidenav
						$('<ul>', {"id": "sidenav", "class": "side-nav"}).append(
							$('<li>', {"class": "row-control"}).append(
								$('<a>', {"href": "javascript:;"}).append(
									$('<i>', {"class": "material-icons"}).text("close")
								).append("Close").click(() => {
									$(".button-collapse").sideNav("hide");
								})
							)
						// ).append(
							// $('<li>', {"class": "divider"})
						)
					).append(
						// Top menu container
						$('<ul>', {"id": "top_menu", "class": "right"})
					)
				)
			)
		);

		/**
		 * Build the top menu
		 * @uses build_menu()
		 */
		this.build_menu("sidenav");

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
		let path = STR.ucfirst(NAV.get_url_path()[NAV.get_url_path().length - 1]),
			title = "",
			subtitle = "";

		if(settings.general.carousel.visible && settings[page].carousel.visible) {
			$("body").append(
				$('<section>', {"id": "top_carousel", "class": ""}).append(
					$('<div>', {"class": "carousel carousel-slider center"}).append(
						$('<div>', {"class": "carousel-fixed-item container"}).append(
 							$('<div>', {"class": "left"}).append(() => {
								if(page == "404") {
									return $('<h1>', {"id": "page_subtitle"}).text(page);
								} else if(settings[page].subtitle !== undefined && settings[page].subtitle !== "") {
									return $('<h1>', {"id": "page_subtitle"}).text(settings[page].subtitle);
								}
							}).append(
								$('<h1>', {"id": "page_title"}).text(settings[page].title)
							)
						)
					).append(
						$.map(settings[page].carousel.items, (v) => {
							return $('<div>', {"class": "carousel-item valign-wrapper", "href": "#one"})
							.append(() => {
								if(v.image !== "") {
									return $('<img>', {"src": "common/media/img/carousel_images/" + v.image, "class": "responsive-img"});
								}
							}).append(
								$('<h1>').html(STR.nl2br(v.message).replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>'))
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

			if(settings[page].carousel.items.length == 1) {
				$(".carousel").css("pointer-events", "none");
			}

			/**
			* Animate the carousel
			* @param integer						time						The delay after carousel change (default is 10'000)
			*/
			if(settings.general.carousel.animate && settings[page].carousel.items.length > 1) {
				setInterval(() => {
					// $(".carousel .carousel-item").fadeOut(300, () => {
						$(".carousel").carousel("next");
						// $(".carousel .carousel-item").delay(300).fadeIn();
					// })
				}, settings.general.carousel.time);
			}
		} else {
			/**
			 * Set page title & subtitle
			 * @note
			 */
			let title = "",
				subtitle = "";
			switch(page) {
				case "ontology":
					title = NAV.get_ontology_id();
					subtitle = STR.camel_case_2_text(NAV.get_ontology_label());
					break;
				case "terms":
					title = '<a href="./terms/CO_020">' + NAV.get_ontology_id() + "</a><small>:" + NAV.get_term_id() + "</small>";
					subtitle = STR.camel_case_2_text(NAV.get_term_label());
					break;
				default:
					title = settings[page].title;
					subtitle = settings[page].subtitle;
					break;
			}

			$("body").append(
				$('<div>', {"id": "ontology_card", "class": "row container"}).append(
					$('<h1>', {"id": "page_subtitle"}).html(title)
				).append(
					$('<h2>', {"id": "page_title"}).text(subtitle)
				)
			)
		}
	}

	/**
	 * Build the searchbar
	 */
	build_searchbar() {
		// Build the filters modal
		// MODALS.filters_modal();

		if(settings.general.search.visible) {
			let $searchbar = $('<div>', {"class": "bar"}).append(
                    // Layout for search with tags
					// $('<div>', {"id": "search_input", "class": "input-field col s8 m8 l8 xl8"}).append(
					$('<div>', {"id": "search_input", "class": "input-field", "style": "width:100%;"}).append(
						$('<input>', {
							"type": "search",
							"id": "search",
							"autocomplete": "off",
							"class": "autocomplete",
							"placeholder": "Search...",
							"name": "q"
						})
					)
				).append(
					$('<div>', {"id": "search_loader"})
				),
				$breadcrumbs = $('<nav>', {"class": "transparent z-depth-0"}).append(
    				$('<div>', {"class": "nav-wrapper"}).append(
      					$('<div>', {"class": "col s12 truncate"}).append(
        					$('<a>', {"href": "./", "class": "breadcrumb"}).append(
								$('<span>', {"class": "fas fa-home"})
							)
						).append(() => {
							if(NAV.get_url_path().length > 1) {
								switch(page) {
									case "ontology":
										return $('<span>', {"class": "breadcrumb"}).html(
											$('<tt>').append(NAV.get_ontology_id())
										).append(" ").append(
											$("<span>", {"class": "page_name"}).append(STR.ucfirst(STR.camel_case_2_text(NAV.get_ontology_label())))
										);
										break;
									case "terms":
										return $('<span>', {"class": "breadcrumb"}).html(
											$('<tt>').append(NAV.get_ontology_id()).append(
												$('<small>').append(":" + NAV.get_term_id())
											)
										).append(" ").append(
											$("<span>", {"class": "page_name"}).append(STR.ucfirst(STR.camel_case_2_text(NAV.get_term_label())))
										);
										break;
									default:
										return $('<span>', {"class": "breadcrumb"}).html(STR.ucfirst(STR.camel_case_2_text(v.replace(NAV.get_ontology_url_regex(":"), "<tt>$1</tt> $2"))));
										break;
								}
							} else {
								return $('<span>', {"class": "breadcrumb"}).text(STR.ucfirst(NAV.get_page()));
							}
						})
					)
				);

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
							$('<div>', {"id": "searchbar", "class": "col s12 m8 l6 right"}).append(
								$searchbar
							)
						).append(
							$('<div>', {"id": "breadcrumb", "class": "col s12 m4 l6 left"}).append(
								$breadcrumbs
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
				switch(page) {
					/**
					* Home layout
					* -------------------------------------------------------------
					*/
					case "home":
						return $('<div>', {"class": "row"}).append(
							$('<div>', {"id": "ontologies_container", "class": "col s12 m12 l8 xl8 right"}).append(
								$('<div>', {"class": "center-align"}).text(settings.general.loader.text)
							)
						).append(
							$('<div>', {"class": "col s12 m12 l4 xl4 left"}).append(
								$('<div>', {"class": "row"}).append(
									$('<div>', {"id": "info_container", "class": "col s12 m12 l12 xl12"}).append(
										$('<div>', {"class": "card lighten-5"}).append(
											$('<div>', {"class": "card-content"}).append(
												$('<span>', {"class": "card-title highlight"})
											).append(
												// Loader
												// ---------------------------------
												$('<div>', {"class": "help"}).append(
													// $('<div>', {"class": "center-align"}).text(settings.general.loader.text)
												)
												// ---------------------------------
											)
										)
									)
								).append(
									$('<div>', {"id": "feed_container", "class": "col s12 m12 l12 xl12"})
								)
							)
						)
						break;
					case "latest":
						return $('<div>', {"class": "container"}).append(
							$('<div>', {"id": "ontologies_container", "class": "col s12 m8 l8 xl8"}).append(
								$('<div>', {"class": "center-align"}).text(settings.general.loader.text)
							)
						);
						break;
					default:
						return $('<div>', {"id": "page_content", "class": "container"});
						break;
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
		DATA.get_user_logged();

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
				LOADER.create({target: "#ontologies_container", type: "progress"});

				DATA.get_ontologies().then((data) => {
					LOADER.hide("#ontologies_container .progress", true);

					if(settings.home.sections.ontologies.visible) {
						$("#ontologies_container").html(
							$('<h5>').text("Ontologies")
						).append(
							$('<ul>', {"class": "collapsible z-depth-0", "data-collapsible": "accordion"})
						)

						var current_page = 1,
							page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
							page_content = [];

						if(page_limit <= 0) {
							page_limit = 1;
						}

						$("#ontologies_container .collapsible").append(
							$('<li>').append(
								$('<div>', {"class": "collapsible-header grey-text"}).append(
									$('<div>', {"class": "collapsible-secondary help-text"}).append(
										$('<span>', {"class": "fa fa-chevron-right"})
									)
								).append(
									$('<div>', {"class": "truncate"}).append(
										$('<span>', {"class": "picol_news"})
									).append("See latest")
								).click(() => {
									window.location.href = "./latest";
								})
							)
						);
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
										$('<div>', {"class": "truncate"}).append(
											$('<span>', {"class": categories.category.icon})
										).append(
											$('<span>', {
												"class": "tooltipped",
												"data-tooltip": categories.category.name,
												"data-position": "top"
											}).text(categories.category.name)
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
														$('<div>', {"class": "secondary-content"}).append(
															$('<a>', {
																"class": "download tooltipped",
																"data-position": "top",
																"data-tooltip": "Ontology RSS",
																"data-delay": "0",
																"target": "_blank",
																"href": "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + vv.ontology_name.replace("/", "-") + "/rss"
															}).append(
																$('<span>', {"class": "fa fa-rss-square"})
															)
														).append(
															$('<a>', {
																"class": "download tooltipped",
																"data-position": "top",
																"data-tooltip": "RDF N-Triples",
																"data-delay": "0",
																"target": "_blank",
																"href": "https://www.cropontology.org/ontology/" + vv.ontology_id + "/" + vv.ontology_name.replace("/", "-") + "/nt"
															}).append(
																$('<span>', {"class": "picol_rdf_document"})
															)
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
   			 * 							LATEST ONTOLOGIES AND NEWS contents
			 * -----------------------------------------------------------------
   			 */
			case "latest":
				LOADER.create({target: "#ontologies_container", type: "progress"});

				DATA.get_latest_ontologies().then((latest) => {
					LOADER.hide("#ontologies_container .progress", true);

					if(settings.latest.visible) {
						$("#ontologies_container").html(
							$('<ul>', {"class": "collapsible z-depth-0", "data-collapsible": "accordion"})
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
						$.each(latest, (k, categories) => {
							$("#ontologies_container .collapsible").append(
								$('<li>', {
									"class": ((k == "latestOntos") ? "active" : ""),
									"id": k
								}).append(
									$('<div>', {"class": "collapsible-header " + ((k == "latestOntos") ? "active" : "")}).append(
										$('<div>', {"class": "left"}).append(
											$('<span>').text(STR.ucfirst(STR.camel_case_2_text(k.replace("Ontos", "Ontologies"))) + " (top 10)")
										)
									)
								).append(
									$('<div>', {"class": "collapsible-body"}).append(
										$('<ul>', {"id": "ontology_container"}).append(
											$.map(categories, (vv, kk) => {
												let name = "",
													href = "",
													rss = "",
													nt = "",
													summary = "",
													author = "";

												if(k == "latestOntos") {
													name = vv.ontology_name;
													href = "./ontology/" + vv.ontology_id + ":" + name.replace("/", "-");
													rss = "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + name.replace("/", "-") + "/rss";
													nt = "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + name.replace("/", "-") + "/nt";
													summary = STR.ucfirst(vv.ontology_summary),
													author = vv.username;
												} else {
													name = STR.get_ontology_term(vv.name);
													href = "./terms/" + vv.id + ":" + name.replace("/", "-");
													rss = "http://www.cropontology.org/ontology/" + vv.id + "/" + name.replace("/", "-") + "/rss";
													nt = "http://www.cropontology.org/ontology/" + (vv.id.split(":")[0]) + "/" + ((vv.ontology_name == null || vv.ontology_name == "null") ? "" : vv.ontology_name.replace("/", "-")) + "/nt";
													summary = "",
													author = vv.author;
												}
												return $('<ul>', {"class": "collection"}).append(
													$('<li>', {"class": "collection-item"}).append(
														$('<a>', {
															"href": href
														}).append(
															$('<h2>').append(name)
														)
													).append(
														$('<div>', {"class": "secondary-content"}).append(
															$('<a>', {
																"class": "download tooltipped",
																"data-position": "top",
																"data-tooltip": "Ontology RSS",
																"data-delay": "0",
																"target": "_blank",
																"href": rss
															}).append(
																$('<span>', {"class": "fa fa-rss-square"})
															).tooltip()
														).append(
															$('<a>', {
																"class": "download tooltipped",
																"data-position": "top",
																"data-tooltip": "RDF N-Triples",
																"data-delay": "0",
																"target": "_blank",
																"href": nt
															}).append(
																$('<span>', {"class": "picol_rdf_document"})
															).tooltip()
														)
													).append(
														$('<a>', {"href": "javascript:;", "class": "tag green"}).text(author)
													).append(() => {
														if(summary.length > 0) {
															return $('<p>').html(summary);
														}
													})
												)
											})
										)
									)
								)
							).collapsible();
						});
					}
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
				var counter = 0,
					ontoId,
					getPars = (o, $cont, ontoId, parent) => {
						let term = {};
						if($cont.attr("id") !== "cont") { // we dont want to save the root
							let name = $cont.find("input[name=name]:first").val();
							term = {
								id: ontoId + ":" + counter++,
								name: name,
								parent: parent
							};
							o.push(term);
						}
						// children() returns only the top most elements
						$cont.children("ul").each((k, v) => {
							getPars(o, $(v), ontoId, term.id || null);
						});
					};

				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_ADD_ONTOLOGY);
				$(".tooltipped").tooltip();

				$("#add_childs_btn").on("click", (e) => {
					let $template = $('<ul>', {"class": "treeview form"}).append(
						$('<li>', {"class": "term"}).append(
							$('<div>', {"class": "item valign-wrapper"}).append(
								$('<div>', {"class": "input-field col s5"}).append(
									$('<input>', {"type": "text", "name": "name", "placeholder": "Term Name"})
								)
							).append(
								$('<div>', {"class": "input-field col s5"}).append(
									$('<input>', {"type": "text", "name": "relation_name", "placeholder": "Relation Name"})
								)
							).append(
								$('<div>', {"class": "col s1"}).append(
									$('<a>', {"class": "btn btn-mini add", "href": "javascript:;", "tabindex": "-1"}).append(
										$('<span>', {"class": "fa fa-plus"})
									)
								).append(
									$('<a>', {"class": "btn btn-mini remove", "href": "javascript:;", "tabindex": "-1"}).append(
										$('<span>', {"class": "fa fa-minus"})
									)
								)
							)
						)
					);

					$("#cont").append($template);
					$("#cont").find("ul:last-child li:last-child input:first").focus();

					$(".btn-mini.add").unbind().on("click", (e) => {
						let $cloned_template = $template.clone(true);
						$cloned_template.find("input").val("");
						$(e.target).closest("ul").last().append($cloned_template);
						$(e.target).closest("ul").last().find("li").last().find("input:first").focus();
					});
					$(".btn-mini.remove").unbind().on("click", (e) => {
						if(!confirm("Are you sure you want to remove this term and all its children?")) return;
						$(e.target).closest("ul").last().remove();
					});

					e.preventDefault();
					e.stopPropagation();
				});
				$("#save").click((e) => {
					let ret = [],
						counter = 0,
						ontoId = $.trim($("form:visible").find("#ontology_id").val());

					getPars(ret, $("#cont"), ontoId);

					// we need to obey the API which is a list of objects.
					// the tree is given by referencing each id
					// so the developer needs to give us IDs for us to know about
					// relation logic
					let pars = {
						ontology_name: $.trim($("form:visible").find("#ontology_name").val()),
						ontology_version: (data.ontology_version !== undefined) ? data.ontology_version + 1 : 1,
						ontology_id: $.trim($("form:visible").find("#ontology_id").val()),
						ontology_summary: $.trim($("form:visible").find("#ontology_summary").val()),
						category: $.trim($("form:visible").find("#create_ontology_cont select[name=category]").val()),
						json: JSON.stringify(ret)
					};

					if($.trim(pars.ontology_name) == "" || pars.ontology_name == undefined || pars.ontology_id == "" || pars.ontology_id == undefined) {
						$("#error").text("Please insert the name of Ontology and its ID").fadeIn();
						return;
					}
					DATA.get_ontology(ontoId).then((data) => {
						$("#error").fadeOut();

						DATA.add_ontology(pars).then((data) => {
							window.location.href = "/";
						}, (error) => {
							$("#error").html($(error.responseText).text()).fadeIn();
						});

						e.preventDefault();
						e.stopPropagation();
					});
				});


				setTimeout(() => {
					DATA.get_ontology_upload_url().then((upload_url) => {
						$("#add_ontology_tab_contents .col.active form").attr("action", upload_url);
					});
				}, 100);

				$(".tabs").tabs({
					onShow: (e) => {
						DATA.get_ontology_upload_url().then((upload_url) => {
							$("#add_ontology_tab_contents .col.active form").attr("action", upload_url);
						});
					}
				});

				break;
			/**
			 * 							ONTOLOGIES contents
			 * -----------------------------------------------------------------
			 */
			case "ontology":
			case "terms":
				let name = "",
					term = "",
					language = "english";

				MODALS.download_ontology_modal();

				/**
				 * Ontology card
				 */
				DATA.get_ontologies_data(NAV.get_ontology_id()).then((ontologies_data) => {
					$("#ontology_card").html(
						$('<div>', {"class": "col s4 m3 l2"}).append(
							$('<img>', {"class": "crop_pict responsive-img", "src": ontologies_data.ontology_picture})
						)
					).append(
						$('<div>', {"class": "col s8 m9 l10"}).append(
							$('<h1>', {"id": "page_subtitle"}).append(NAV.get_ontology_id()).append((NAV.get_term_id() !== undefined) ? "<small>:" + NAV.get_term_id() + "</small>" : "")
						).append(
							$('<h2>', {"id": "page_title"}).append(() => {
								// if(ontologies_data.ontology_title.link !== "") {
								// 	return $('<a>', {"href": ontologies_data.ontology_title.link, "target": "_blank"}).append(ontologies_data.ontology_title.title).append((NAV.get_term_id() !== undefined) ? NAV.get_term_label() : "");
								// } else {
								// 	return ontologies_data.ontology_title.title + ((page == "terms" && NAV.get_term_id() !== undefined) ? "<small>" + NAV.get_term_label() + "</small>" : "");
								// }
							})
						).append(
							$('<table>', {"class": "responsive-table hide-on-small-only"}).append(
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
													if(v.image) {
														let image = (!STR.is_url(v.image)) ? "common/media/img/" + v.image : v.image;
														return $('<a>', {"href": v.link, "target": "_blank"}).append(
															$('<img>', {"src": image})
														)
													}
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
													if(v.image) {
														let image = (!STR.is_url(v.image)) ? "common/media/img/" + v.image : v.image;
														return $('<a>', {"href": v.link, "target": "_blank"}).append(
															$('<img>', {"src": "common/media/img/" + image})
														)
													}
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
														$('<img>', {"src": "common/media/img/" + v.image})
													)
												})
											).html();
										}
									})
								)
							)
						)
					)
				});

				DATA.get_ontology(NAV.get_ontology_id()).then((data) => {
					LOADER.hide("#contents .progress");

					// Set Ontology languages
					let langs = [];
					langs.push(STR.get_ontologies_languages(data.name));
					// Set the page name
					let page_name = STR.get_ontology_term(data.name);
					$(".page_name").text(page_name);
					// Reset the page title
					$("#page_title").html(page_name);

					$("#ontology_tree .languages_refresh select").append(
						$.map(langs, (lang) => {
							return $('<option>', {
								"value": lang.toLowerCase(),
								"selected": ((lang.toLowerCase() == settings.general.language) ? true : false),
							}).text(lang)
						})
					)
					//.attr("disabled", (langs.length == 1))
					.material_select();

					TREEVIEW.add_items({
						item: "#treeview",
						source: data,
						term: '<tt>' + NAV.get_ontology_id() + "</tt> - " + STR.get_ontology_term(data.name),
						is_root: true,
						langs: langs
					});

					let permalink = "./ontology/" + NAV.get_ontology_id() + ":" + NAV.get_ontology_label(),
						ext_permalink = "https://www.cropontology.org/terms/" + data.id + "/" + STR.get_ontology_term(data.name) + "/static-html?language=" + STR.get_ontology_term_language(data.name);

					// $("#term_permalink").attr("href", ext_permalink);
					$("#term_info_name").attr("href", permalink);
					$("#ontology_tree, #ontology_info").removeClass("disabled");
				});

				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").append(
						$('<div>', {"class": "row"}).append(
							$('<div>', {"class": "col s12 m6 l5"}).append(
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
												$('<a>', {"href": "#download_ontology_modal", "class": "modal-trigger"}).append(
													$('<span>', {"class": "picol_arrow_full_down"})
												).append(" Download")
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
							$('<div>', {"class": "col s12 m6 l7"}).append(
								$('<h6>').text("Term information")
							).append(
								$('<div>', {"id": "ontology_info", "class": "disabled"}).append(
									$('<div>', {"class": "card z-depth-1 browser-content browser"}).append(
										$('<nav>', {"class": "nav-extended"}).append(
											$('<div>', {"class": "nav-content"}).append(
												$('<ul>', {"class": "tabs"}).append(
													// Info tab
													$('<li>', {"id": "general", "class": "tab"}).append(
														$('<a>', {"href": "#page_info", "class": "active", "class": "tooltipped", "data-tooltip": "General", "data-position": "top"}).append(
															$('<span>', {"class": "hide-on-large-only fa fa-info-circle"})
														).append(
															$('<span>', {"class": "hide-on-med-and-down text"}).text("General")
														)
													)
												).append(
													// Variables tab
													$('<li>', {"id": "variables", "class": "tab disabled"}).append(
														$('<a>', {"href": "#item_variables", "class": "tooltipped", "data-tooltip": "Variables", "data-position": "top"}).append(
															$('<span>', {"class": "hide-on-large-only fa fa-code-branch"})
														).append(
															$('<span>', {"class": "hide-on-med-and-down text"}).text("Variables")
														)
													)
												).append(
													// Comments tab
													$('<li>', {"id": "new-comments", "class": "tab"}).append(
														$('<a>', {"href": "#page_comments", "class": "tooltipped", "data-tooltip": "Comments", "data-position": "top"}).append(
															$('<span>', {"class": "hide-on-large-only fa fa-comments"})
														).append(
															$('<span>', {"class": "hide-on-med-and-down text"}).text("Comments")
														)
													)
												)
											)
										).append(
											$('<div>', {"class": "filterbar nav-wrapper"}).append(
												$('<ul>', {"class": "filters left"}).append(
													$('<span>', {"class": "fa fa-link grey-text"})
												).append(
													$('<li>', {"data-filter": "read"}).append(
														$('<a>', {
															"href": "javascript:;",
															"id": "term_info_name",
															"class": "tooltipped",
															"data-tooltip": '<center>Permalink<br /><small>Click to refresh this page</small></center>'
														}).html(
															$('<span>', {"class": "getting_data"}).text("Getting data...")
														)
													)
												// ).append(
												// 	$('<li>', {"data-filter": "read"}).append(
												// 		$('<a>', {
												// 			"href": "javascript:;",
												// 			"target": "_blank",
												// 			"id": "term_permalink",
												// 			"class": "right tooltipped",
												// 			"data-tooltip": "Permalink"
												// 		}).append(
												// 			$('<span>', {"class": "fa fa-link"})
												// 		)
												// 	)
												)
											)
										)
									).append(
										$('<div>', {"id": "pages"}).append(
											// Info container
											$('<div>', {"id": "page_info", "class": "card-content"})
										).append(
											// Variables container
											$('<div>', {"id": "item_variables", "class": "card-content"})
										).append(
											// Comments container
											$('<div>', {"id": "page_comments", "class": "card-content"}).append(
												$('<ul>', {"id": "comments", "class": "collection"}).hide()
											).append(
												$('<div>', {"id": "comment_form"}).append(() => {
													if(DATA.get_user_logged()) {
														return $('<form>', {"method": "post", "action": "http://www.cropontology.org/add-comment"}).append(
															$('<div>', {"class": "row"}).append(
																$('<input>', {"type": "hidden", "name": "termId"}).val((page == "terms") ? NAV.get_term_id() : "")
															).append(
																$('<input>', {"type": "hidden", "name": "ontologyId"}).val(NAV.get_ontology_id())
															).append(
																$('<div>', {"class": "input-field col s12"}).append(
																	$("<textarea>", {
																		"name": "comment",
																		"class": "materialize-textarea",
																		"id": "comment_input"
																	})
																).append(
																	$('<label>', {"for": "comment_input"}).text("Add a comment")
																)
															).append(
																$('<input>', {"type": "submit", "class": "btn btn-flat btn-highlight waves-effect waves-light right"}).val("Comment")
															)
														)
													} else {
														return $('<center>').append(
															$('<i>')
																.append("Please ")
																.append(
																	$('<a>', {"href": "#user_modal", "class": "modal-trigger"}).text("login")
																)
																.append(" to comment")
														)
													}
												})
											)
										)
									)
								).append(
									$('<div>', {"id": "graph", "class": "card disabled"}).append(
										$('<div>', {"id": "graph_content", "class": "valign-wrapper"}).append(
											// $('<h1>').html('<svg aria-hidden="true" data-prefix="fal" data-icon="chart-network" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-chart-network fa-w-20 fa-3x"><path fill="currentColor" d="M513.6 202.8l-19.2-25.6-48 36 19.2 25.6 48-36zM576 192c13.3 0 25.6-4 35.8-10.9 6.8-4.6 12.7-10.5 17.3-17.3C636 153.6 640 141.3 640 128c0-13.3-4-25.6-10.9-35.8-2.3-3.4-4.9-6.6-7.8-9.5-2.9-2.9-6.1-5.5-9.5-7.8C601.6 68 589.3 64 576 64s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C516 102.4 512 114.7 512 128c0 35.3 28.7 64 64 64zm0-96c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zM99.8 250.9C89.6 244 77.3 240 64 240s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C4 278.4 0 290.7 0 304c0 35.3 28.7 64 64 64s64-28.7 64-64c0-13.3-4-25.6-10.9-35.8-4.6-6.8-10.5-12.7-17.3-17.3zM64 336c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm88-16h48v-32h-48v32zm469.3 82.7c-2.9-2.9-6.1-5.5-9.5-7.8C601.6 388 589.3 384 576 384s-25.6 4-35.8 10.9c-3.3 2.2-6.3 4.7-9.1 7.5l-91.8-55.1c5.6-13.3 8.7-28 8.7-43.3 0-61.9-50.1-112-112-112-11.3 0-21.9 2.2-32.2 5.2l-39.3-84.1C278.8 101.4 288 83.9 288 64c0-13.3-4-25.6-10.9-35.8-4.6-6.8-10.5-12.7-17.3-17.3C249.6 4 237.3 0 224 0s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C164 38.4 160 50.7 160 64c0 35.3 28.7 64 64 64 4 0 7.9-.5 11.7-1.2l39 83.6c-30.5 20-50.7 54.4-50.7 93.6 0 61.9 50.1 112 112 112 35 0 65.8-16.4 86.4-41.5l92.4 55.4c-1.7 5.8-2.7 11.8-2.7 18.1 0 35.3 28.7 64 64 64 13.3 0 25.6-4 35.8-10.9 6.8-4.6 12.7-10.5 17.3-17.3C636 473.6 640 461.3 640 448c0-13.3-4-25.6-10.9-35.8-2.3-3.4-5-6.6-7.8-9.5zM224 96c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm112 288c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm240 96c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32z" class=""></path></svg>')
											$('<h1>').append(
												$('<span>', {"class": "fab fa-hubspot fa-3x"})
											)
										)
									)
								)
							)
						)
					);

					$("#contents").prepend(
						LOADER.create({type: "progress"})
					);
				break;
			/**
			 * 							Annotation Tool contents
			 * -----------------------------------------------------------------
			 */
			case "annotation-tool":
				// Place the external html page
				$("#contents").addClass("coloured grey lighten-5")
					.find(".container").attr("id", "static_contents")
						.append(PAGE_ANNOTATION_TOOL);
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
						$("<img>", {"src": "common/media/img/" + settings.general.footer.background})
					)
				).append(
					$("<div>", {"class": "row"}).append(
						$("<div>", {"class": "col s12 m12 l3 xl2"}).append(
							$('<a>', {"href": "./", "class": "brand-logo"}).append(
								$('<img>', {"class": "responsive-img", "src": "common/media/img/" + settings.general.footer.logo})
							)
						).append(
							$('<p>', {"class": "description"}).html(settings.general.footer.description)
						)
					).append(
						$("<div>", {"id": "left_menu", "class": "col s12 m4 l2 offset-l1 offset-xl1"})
					).append(
						$("<div>", {"id": "center_menu", "class": "col s12 m4 l3"})
					).append(
						$("<div>", {"id": "right_menu", "class": "col s12 m4 l3 offset-xl1"})
					)
				)
			).append(
				$('<section>', {"id": "bottom_links"}).append(
					$('<div>', {"class": "row container"}).append(
						$('<div>', {"id": "", "class": "col s12 m12 l8 xl8 left"})
					).append(
						$('<div>', {"id": "owner", "class": "col s12 m12 l4 xl4 right right-align"})
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

	load_scripts() {
		switch(page) {
			case "add-ontology":
				$("head").append(
					"<!-- Main style -->"
				).append(
					$('<link>', {"rel": "stylesheet", "href": "dist/css/jquery.treeview.css", "type": "text/css", "media": "screen"})
				);
				break;
			case "ontology":
			case "terms":
				$("head").append(
			        "<!-- Main style -->"
				).append(
					$('<link>', {"rel": "stylesheet", "href": "dist/css/jquery.treeview.css", "type": "text/css", "media": "screen"})
				);

				$("#scripts").append(
					"<!-- Fullscreen feature -->"
				).append(
		            $('<script>', {"type": "text/javascript", "src": "bower_components/jq-fullscreen/release/jquery.fullscreen.min.js"})
				).append(
		            "<!--  The Raphael JavaScript library for vector graphics display  -->"
				).append(
					$('<script>', {"type": "text/javascript", "src": "dist/js/raphael-min.js"})
				).append(
		            "<!--  Dracula  -->"
				).append(
		            "<!--  An extension of Raphael for connecting shapes -->"
				).append(
					$('<script>', {"type": "text/javascript", "src": "dist/js/dracula_graffle.js"})
				).append(
		            "<!--  Graphs  -->"
				).append(
					$('<script>', {"type": "text/javascript", "src": "dist/js/dracula_graph.js"})
				).append(
					$('<script>', {"type": "text/javascript", "src": "dist/js/dracula_algorithms.js"})
				);
				break;
			case "annotation-tool":
				$("#scripts").append(
					"<!-- Poshy Tip -->"
				).append(
					$('<script>', {"type": "text/javascript", "src": "dist/js/jquery.poshytip.js"})
				)
				break;
			case "register":
				$("#scripts").append(
					"<!-- jquery-validation -->"
				).append(
					$('<script>', {"type": "text/javascript", "src": "bower_components/jquery-validation/dist/jquery.validate.min.js"})
				).append(
					"<!-- Google reCAPTCHA -->"
				).append(
					$('<script>', {"type": "text/javascript", "src": "https://www.google.com/recaptcha/api.js"})
				)
				break;
		}
	}
}

export default layout;
