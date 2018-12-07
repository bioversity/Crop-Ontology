"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/js/data.es6");

var _data2 = _interopRequireDefault(_data);

var _pagination = require("../../src/js/pagination.es6");

var _pagination2 = _interopRequireDefault(_pagination);

var _filters = require("../../src/js/filters.es6");

var _filters2 = _interopRequireDefault(_filters);

var _modals = require("../../src/js/modals.es6");

var _modals2 = _interopRequireDefault(_modals);

var _str = require("../../src/js/_str.es6");

var _str2 = _interopRequireDefault(_str);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA = new _data2.default(),
    PAGINATION = new _pagination2.default(),
    FILTERS = new _filters2.default(),
    MODALS = new _modals2.default(),
    STR = new _str2.default(),
    moment = require("moment");

var layout = function () {
	function layout() {
		_classCallCheck(this, layout);
	}

	_createClass(layout, [{
		key: "activate",
		value: function activate() {
			$("select").material_select();

			// Modals
			$(".modal").modal({
				dismissible: true,
				opacity: 0.8,
				ready: function ready(modal, trigger) {},
				complete: function complete() {
					// this.add_search_filters($(".modal-content").find("form").serializeObject());
					// $("#tags").tagit("createTag", "brand-new-tag");

					// 	$(".modal-content").find("form").serializeObject();//.reduce(function(obj, item) {obj[item.name] = item.value; return obj; }, {}))
					// }
				}
			});

			$(".collapsible").collapsible();

			$(".tooltipped").tooltip({ html: true });
		}

		/**
   * Build a menu
   * @param  string 						position							The menu position
   * @return object
   */

	}, {
		key: "build_menu",
		value: function build_menu(position) {
			var menus = require("../../common/menu.json");

			$.each(menus, function (k, v) {
				$("#" + position).append($.map(v[position].items, function (item) {
					switch (position) {
						case "bottom_links":
							$.each(item.items, function (ik, iv) {
								if (iv.display) {
									$("#" + position).append($('<a>', { "href": iv.link, "target": iv.target, "title": iv.label }).append($('<img>', { "src": "common/img/" + iv.image })));
								}
							});
							break;
						case "footer_menu":
							$("#" + item.position).prepend($('<h2>').text(item.title));
							$("#" + item.position).append($('<ul>'));
							$.each(item.items, function (ik, iv) {
								$("#" + item.position).find("ul").append(function () {
									if (iv.display) {
										return $('<li>').append($('<a>', { "href": iv.link, "target": iv.target }).text(iv.label));
									}
									if (iv.separator !== undefined) {
										return $('<li>', { "class": "separator" });
									}
								});
							});
							break;
						default:
							if (item.label === undefined && item.separator) {
								switch ($.type(item.separator)) {
									case "boolean":
										return $('<li>').append($('<span>', { "class": "separator" }));
										break;
									case "string":
										return $('<li>', { "class": "disabled black-text" }).append($('<span>').text(item.separator));
										break;
								}
							} else {
								if (item.display) {
									return $('<li>').append($('<a>', { "href": item.link }).text(item.label));
								}
							}
							break;
					}
				}));
			});
		}

		/**
   * Build the page <header>
   * @return {[type]} [description]
   */

	}, {
		key: "build_header",
		value: function build_header() {
			$("body").prepend($("<header>").append($('<nav>', { "class": "transparent z-depth-0" }).append($('<div>', { "class": "nav-wrapper" }).append($('<a>', { "href": "javascript:;", "class": "brand-logo" }).append($('<img>', { "src": "common/img/crop_ontology.png" }))).append(
			// Top menu container
			$('<ul>', { "id": "top_menu", "class": "right hide-on-med-and-down" })))));

			/**
    * Build the top menu
    * @uses build_menu()
    */
			this.build_menu("top_menu");
		}

		/**
   * Build the carousel messages slider
   */

	}, {
		key: "build_carousel",
		value: function build_carousel() {
			var top_carousel = require("../../common/top_carousel.json");

			$("body").append($('<section>', { "id": "top_carousel", "class": "container" }).append($('<div>', { "class": "carousel carousel-slider center" }).append($.map(top_carousel.messages, function (message) {
				message = message.replace(/\n/gm, "<br />");
				message = message.replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>');
				return $('<div>', { "class": "carousel-item valign-wrapper", "href": "#one" }).append($('<h1>').html(message));
			}))));

			// Instantiate Materialize carousel
			$(".carousel").carousel({
				duration: 50,
				fullWidth: true,
				indicators: false
			}).animate({ "opacity": 1 }, 300);

			/**
   * Animate the carousel
   * @param integer						time							The delay after carousel change (default is 10'000)
   */
			setInterval(function () {
				$(".carousel .carousel-item").fadeOut(300, function () {
					$(".carousel").carousel("next");
					$(".carousel .carousel-item").delay(300).fadeIn();
				});
			}, 10000);
		}

		/**
   * Build the searchbar
   */

	}, {
		key: "build_searchbar",
		value: function build_searchbar() {
			// Build the filters modal
			MODALS.filters_modal();

			$("body").append($('<section>', { "id": "searchbar", "class": "container" }).append($('<form>', { "method": "get", "onsubmit": "return false;" }).append($('<div>', { "class": "" }).append($('<div>', { "class": "row bar" }).append($('<div>', { "id": "search_input", "class": "input-field col s8 m8 l8 xl8" }).append($('<input>', {
				"type": "search",
				"id": "search",
				"placeholder": "Search...",
				"name": "q"
			}))).append($('<div>', { "id": "tags_list", "class": "input-field col s4 m4 l4 xl4" }).append($('<ul>', { "class": "tags" }).append(FILTERS.draw_filter("type", "TRAIT")).append(FILTERS.draw_filter("user", "MALAPORTE"))))).append($('<a>', { "href": "#searchbar_filters", "class": "btn-text blue-text right modal-trigger" }).append($('<span>', { "class": "fa fa-filter" })).append(" Add a filter")))));
		}

		/**
   * Build the halfway menu
   */

	}, {
		key: "build_halfway_menu",
		value: function build_halfway_menu() {
			$("body").append($('<section>', { "id": "halfway", "class": "" }).append($('<ul>', { "id": "halfway_menu", "class": "center horizontal" })));

			/**
    * Build the top menu
    * @uses build_menu()
    */
			this.build_menu("halfway_menu");
		}

		/**
   * Build the contents section
   */

	}, {
		key: "build_contents_section",
		value: function build_contents_section() {
			$("body").append($('<section>', { "id": "contents", "class": "" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m4 l4 xl4" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "info_container", "class": "col s12 m12 l12 xl12" }).append($('<div>', { "class": "card grey lighten-5" }).append($('<div>', { "class": "card-content" }).append($('<span>', { "class": "card-title highlight" }).text("Instructions")).append($('<p>').html("<b>To develop a Trait Dictionary Version 5:</b><ul><li>Download the Trait Dictionary template v5</li><li>Read the Guidelines - may 2018</li><li>Contact helpdesk@cropontologycurationtool.org to get the Crop code for your Trait dictionary and to upload it</li></ul><br /><br /><b>To download a Trait Dictionary from this site:</b><br /><p>Text from the grey banner on the current site</p>"))))).append($('<div>', { "id": "feed_container", "class": "col s12 m12 l12 xl12" })))).append($('<div>', { "id": "ontologies_container", "class": "col s12 m8 l8 xl8" }))));

			var news_per_page = 3;

			/**
    * Feeds
    * ---------------------------------------------------------------------
    */
			DATA.get_community_website_feed().then(function (data) {
				var $feeds = [],
				    feeds = [],
				    total_pages = Math.ceil(parseInt(data.length) / news_per_page),
				    current_page = 0;

				$.each(data, function (k, v) {
					feeds.push({
						title: data[k].title,
						preview: data[k].preview,
						author: $('<a>', { "href": "mailto:" + data[k].author.email }).text(data[k].author.name).prop("outerHTML"),
						published: moment(data[k].published).local().format("MMM DD, YYYY, h:mm A"),
						link: data[k].link,
						abstract: STR.extract_text(data[k].content) + "<br />"
					});
					if (k % 3 == 0) {
						current_page++;
					}

					var visible = current_page == 1 ? "visible" : "hide";
					$feeds.push($('<div>', { "class": "card-content feed page_" + current_page + " " + visible }).append($('<div>', { "class": "preview" }).append($('<a>', { "href": feeds[k].link }).append($(feeds[k].preview)))).append($('<span>', { "class": "card-title highlight" }).append($('<a>', { "href": feeds[k].link }).text(feeds[k].title))).append($('<div>', { "class": "release" }).append($('<span>', { "class": "far fa-fw fa-clock" })).append($('<span>').html(" posted on " + feeds[k].published + " by " + feeds[k].author))
					// ).append(
					// 	$('<div>', {"class": "content"}).append(
					// 		feeds[k].abstract
					// 	).append(
					// 		$('<a>', {"href": feeds[k].link, "class": "readmore"}).text("Read more...")
					// 	)
					));
				});
				$("#feed_container").append($('<div>', { "class": "card z-depth-1" }).append($('<div>', { "class": "card-content" }).append($('<div>', { "class": "card-title highlight" }).append("Latest news"))).append($feeds
				// PAGINATION.build_pagination({
				// 	id: "feed_pagination",
				// 	content: "#feed_container",
				// 	items: ".feed",
				// 	current_page: 1,
				// 	total_pages: Math.ceil(parseInt(data.length)/news_per_page),
				// })
				).append($('<div>', { "class": "card-action right-align" }).append($('<a>', { "class": "btn btn-flat highlight-btn", "href": "https://sites.google.com/a/cgxchange.org/cropontologycommunity/" }).text("Read more...")))).slideDown(300);
			}).catch(function (e) {
				// handle the error
			});

			/**
    * Ontologies
    * ---------------------------------------------------------------------
    */
			DATA.get_ontologies().then(function (data) {
				$("#ontologies_container").append($('<ul>', { "class": "collapsible z-depth-0", "data-collapsible": "accordion" })).append($('<h5>', { "class": "all-ontologies" }).append($('<a>', { "href": "" }).text("All ontologies ›")));

				console.log(data.ontologies);
				$.each(data, function (k, data) {
					// console.log(data);
					$("#ontologies_container .collapsible").append($('<li>', {
						"class": k == 3 ? "active" : "",
						"data-category": data.category.id
					}).append($('<div>', { "class": "collapsible-header " + (k == 3 ? "active" : "") }).append($('<span>', { "class": data.category.icon })).append(data.category.name)).append($('<div>', { "class": "collapsible-body" }).append($.map(data.ontologies, function (v, k) {
						return $('<div>', { "class": "content" }).append($('<h2>').append($('<a>', { "href": "javascript:;", "class": "right" }).append("Download").append($('<span>', { "class": "picol_arrow_full_down" }))).append(v.ontology_name)
						// $('<a>', {"href": "javascript:;", "class": "right"}).append(
						).append($('<span>', { "class": "items_count" }).text(v.tot + " items")).append($('<p>').text(v.ontology_summary));
					})))).collapsible();
				});
			}).catch(function (e) {
				// handle the error
			});
		}

		/**
   * Build the footer section
   */

	}, {
		key: "build_footer",
		value: function build_footer() {
			$("body").append($("<footer>").append($("<div>", { "class": "row" }).append($("<div>", { "class": "col s12 m3 l3 xl3" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "src": "common/img/crop_ontology_white.png" }))).append($('<p>', { "class": "description" }).html("Some identities data<br />such as address, informations, etc..."))).append($("<div>", { "id": "left_menu", "class": "col s12 m2 l2 xl2" })).append($("<div>", { "id": "center_menu", "class": "col s12 m2 l2 xl2" })).append($("<div>", { "id": "right_menu", "class": "col s12 m2 l2 xl2" })))).append($('<section>', { "id": "partners" }).append($('<div>', { "class": "row container center" }).append($('<div>', { "id": "bottom_links", "class": "col s12 m6 l6 xl6" })).append($('<div>', { "class": "col s12 m6 l6 xl6 right right-align" }).append($('<a>', { "href": "javascript:;", "target": "_blank" }).append($('<img>', { "src": "common/img/big-data_platform_logo.png" })))))).append($('<center>').append($('<p>').append("Crop Ontology by Integrated Breeding Platform is licensed under a Creative Commons Attribution 4.0 International License")));

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
	}]);

	return layout;
}();

exports.default = layout;
