"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/js/data.es6");

var _data2 = _interopRequireDefault(_data);

var _navigation = require("../../src/js/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

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

/**
 * Static pages
 */
var about = "<h2>About the Project</h2>\n\n<p>The Crop Ontology project is the creation of the Generation Challenge Programme (GCP, <a href=\"http://www.generationcp.org/\">http://www.generationcp.org/</a> ), which understood from its inception the importance of controlled vocabularies and ontologies for the digital annotation of data.  In ontologies, terms bear a particular, logically defined relationship to each other, allowing computational reasoning on data annotated with a structured vocabulary. The volume of agriculture-related information and terminology related to phenotype, breeding, germplasm, pedigree, traits, among others, is increasing exponentially. In order to facilitate access to the data held within and/or across the databases, GCP initiated the development of Trait Dictionaries for breeders' fieldbooks and a Crop Ontology (CO) to facilitate the harmonization of the data capture and powerful manipulations of the data through ontology-driven queries. This is a development that raised interest in CGIAR Centres and other communities, like the Gramene team developing the Plant Trait Ontology, ecologists and semantic web developers holding vast quantities of agriculture-related data. The project will continue the incremental validation and refinement of the Crop Ontology, which involves adding methods of trait measurement and experiments to enable the mapping of ontology terms onto measured, stored or published variables.The Crop Ontology is a key element of the Integrated Breeding Platform <a href=\"https://www.integratedbreeding.net/\">https://www.integratedbreeding.net/</a></p>\n<a href=\"http://www.generationcp.org/\" ><img src=\"common/img/gcp-logo.png?{{>VERSION}}\" /></a>\n\n<h2>About the Crop Ontology</h2>\n\n<p>The Crop Ontology (CO) current objective is to compile validated concepts along with their inter-relationships on anatomy, structure and phenotype of Crops, on trait measurement and methods as well as on Germplasm with the multi-crop passport terms. The concepts of the CO are being used to curate agronomic databases and describe the data. The use of ontology terms to describe agronomic phenotypes and the accurate mapping of these descriptions into databases is important in comparative phenotypic and genotypic studies across species and gene-discovery experiments as it provides harmonized description of the data and therefore facilitates the retrieval of information.  Development of crop-specific trait ontologies and the germplasm ontologies began in 2008 for chickpea, maize, <em>Musa</em>, potato, rice and wheat, and in 2010 for cassava. The GCP Crop Ontology is a global public good, available to be used freely by all. </p>\n\n<h2>About the tool</h2>\n\n<p>This curation and annotation web site is a participatory tool that enables you to browse the Crop Ontology, search for specific terms and access the definition, as well as additional information. It is possible to post a suggestion at the level of a term and provide feedback on your experience using the site. Please, consult the video tutorials to get a visual explanation of the web site use.</p>\n\n<p>The Ontology curators are able to upload a full ontology in OBO format, create it online, add attribute information, and submit or delete terms from the Crop Ontology. Researchers can also submit/deposit trait names using the curation/annotation tool &lsquo;add an ontology&rsquo; to increment the tool&rsquo;s capacity. </p>\n\n<p>All lists can be downloaded and a web service API is available. The site is hosted on <a href=\"http://code.google.com/appengine\">Google App Engine</a> and the versioned code is hosted on <a href=\"https://github.com/bioversity/Crop-Ontology\">GitHub</a>.</p>\n\n<p>The tool is still under development, so your feedback will help to improve it. Please provide any comments or suggestions using the &lsquo;Feedback&rsquo; button.</p>\n\n<p>This work was greatly inspired by the Crop Ontology Look-up service developed by Martin Senger, consultant in Bioinformatics, and by Terminizer, online annotation tool developed by David Hancock, from the University of Manchester. </p>\n\n<p>Citation:\n&ldquo;Crop Ontology curation and annotation tool &ndash; 2011 Generation Challenge Programme, Bioversity International as project implementing agency.&rdquo;</p>\n<!--\n<h2>Project partners in 2012</h2>\n\n<p>This work is primarily coordinated and undertaken by the lead institution, Bioversity International (hereafter referred to as Bioversity), and coordinated by Elizabeth Arnaud. Rosemary Shrestha (CIMMYT, Mexico) coordinates the CO community and its implementation in crop-specific databases.</p>\n\n<p>\nPrincipal Investigator &ndash; Elizabeth Arnaud (Bioversity International)\n</p>\n\n<p>\nCurators of the Crop-specific Ontology in 2012\n</p>\n\n<ul>\n<li>Barley - Flavio Capettini (ICARDA)</li>\n<li>Cassava - Bakare Moshood Agba  (IITA) </li>\n<li>Common Beans - Fabio Alberto Gerrera (CIAT)</li>\n<li>Chikpea and Groundnut, Sorghum and pigeon pea - Prasad Peteti, Praveen Reddy, Suyash Pati (ICRISAT)</li>\n<li>Cowpea - Sam Ofodile , Ousmane Boukare (IITA)</li>\n<li>Rice - Nikki Frances Borja (IRRI)</li>\n<li>Potato - Reinhard Simon (CIP)</li>\n<li>Maize and Wheat - Rosemary Shrestha (CIMMYT) - Global Ontology Coordinator until 2011/li>\n</ul>\n\n<p>\nScientists coordinating or actively contributing to the development of crop specific Trait Dictionaries and ontologies:\n</p>\n<ul>\n<li>Bioversity - Inge van den Bergh</li>\n<li>CIRAD - Jean FRancois Rami</li>\n<li>ICARDA - Sanjaya Gyawali,</li> Adnan al-Yassin, Mohamad Maatougui, S. Rajaram., Ahmed Amri, Fawzy Nawar</li>\n<li>ICRISAT - Trushar Shah, Eva Wietzel, Tom Hash</li>\n<li>IITA - Ousmane Boukare, Peter Kulakow, Antonio Lopes Montez </li>\n<li>CIAT - Steve Beebe, Rowland Chirwa</li>\n<li>IRRI- Mauleon Ramil, Ruaraidh Sackville Hamilton</li>\n\n<li>and the Crop Communities of Practice </li>\n</ul>\n\n<p><strong>Acknowledgements to</strong>: Adriana Alercia, (Bioversity International, Crop descriptors specialist), Richard Bruskiewich (GCP Bioinformatics, former project Principle Investigator, IRRI), Guy Davenport (GCP bioinformatics, CIMMYT), Graham McLaren (GCP sub-programme on Crop information system, Leader), Martin SENGER (GCP Bioinformatics, formerly IRRI)</p>\n-->\n<h3>Articles</h3>\n<p>2012 - Shrestha Rosemary, Matteis Luca, Skofic Milko, Portugal Arlett, McLaren Graham, Hyman Glenn, Arnaud Elizabeth    - Bridging the phenotypic and genetic data useful for integrated breeding through a data annotation using the Crop Ontology developed by the crop communities of practice , in Frontiers in Physiology , vol.3, no.0326 <a href=\"http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326\"> URL=http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326</a></p>\n<p>2012 - Elizabeth Arnaud, Laurel Cooper, Rosemary Shrestha, Naama Menda, Rex T. Nelson, Luca Matteis, Milko Skofic, Ruth Bastow, Pankaj Jaiswal, Lukas Mueller, Graham McLaren:  Towards a Reference Plant Trait Ontology For Modeling Knowledge of Plant Traits and Phenotypes in: proceedings of the 4th Conference on Knowledge Engineering and Ontology Development, 4-7 October 2012 , Spain.</p>\n<p>2010 - Rosemary Shrestha, Elizabeth Arnaud, Ramil Mauleon, Martin Senger, Guy F. Davenport, David Hancock, Norman Morrison, Richard Bruskiewich, and Graham McLaren - <strong>Multifunctional crop trait ontology for breeders' data: field book, annotation, data discovery and semantic enrichment of the literature</strong>, AoB PLANTS (2010) Vol. 2010 first published online May 27, 2010 doi:10.1093/aobpla/plq008  - <a href=\"http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008\">http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008</a></p>\n\n<h3>Book chapter</h3>\n<p>2011 - Shrestha Rosemary, Guy F Davenport, Richard Bruskiewich and Elizabeth Arnaud in : Monneveux Philippe and Ribaut Jean-Marcel, eds (2011). Drought phenotyping in crops: from theory to practice CGIAR Generation Challenge Programme, Texcoco, Mexico. ISBN: 978-970-648-178-8. 475pp. Chapter is: Development of crop ontology for sharing crop phenotypic information .</p>\n\n<h2>Posters</h2>\n\n<style>\n.posters a img {\n  border: 1px solid #ddd;\n  vertical-align: top;\n  margin-right: 20px;\n}\n</style>\n\n<p class=\"posters\">\n  <a href=\"common/media/pdf/GRM_poster_Curation_annotation_tools.pdf\"><img src=\"common/img/posters/GRM_poster_Curation_annotation_tools.png\" /></a>\n  <a href=\"common/media/pdf/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.pdf\"><img src=\"common/img/posters/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.png\" /></a>\n  <a href=\"common/media/pdf/Poster_GCP_GRM_Musa.pdf\"><img src=\"common/img/posters/Poster_GCP_GRM_Musa.png\" /></a>\n  <a href=\"common/media/pdf/biocuration2012-poster.pdf\"><img src=\"common/img/posters/biocuration_thumb.png\" /></a>\n</p>\n";


var DATA = new _data2.default(),
    NAV = new _navigation2.default(),
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
   * Build a circular or a progress loader
   * @see https://materializecss.com/preloader.html
   *
   * @param  object 						options								The loader display options
   */

	}, {
		key: "loader",
		value: function loader(options) {
			var defaults = {
				/**
     * The loader type.
     * Options: "progress" or "circular"
     * @type {String}
     */
				type: "progress",
				/**
     * The progress type.
     * Options: `true` stay for determinate progress (need `size` option)
     * NOTE: This option is available only for progress loaders
     * @type {Boolean}
     */
				determinate: false,
				/**
     * The loader size.
     * Options:
     * 	- Circular loader: @type {String} 	"" or "small" or "big"
     * 	- Progress loader: @type {Integer}	The percentage of progress
     */
				size: "",
				/**
     * The loader colour
     * NOTE: This option is available only for circular loaders
     * @type {String}
     */
				colour: "grey"
			},
			    settings = $.extend({}, defaults, options);

			switch (settings.type) {
				case "progress":
					return $('<div>', { "class": "progress" }).append($('<div>', {
						"class": settings.determinate ? "determinate" : "indeterminate",
						"style": settings.size !== "" ? "width: " + settings.size + "%" : ""
					}));
					break;
				case "circular":
					return $('<div>', { "class": "preloader-wrapper " + settings.size + " active" }).append($('<div>', { "class": "spinner-layer spinner-" + settings.colour + "-only" }).append($('<div>', { "class": "circle-clipper left" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "gap-patch" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "circle-clipper right" }).append($('<div>', { "class": "circle" }))));
					break;
			}
		}

		/**
   * Build a menu
   * @param  string 						position							The menu position
   * @return object
   */

	}, {
		key: "build_menu",
		value: function build_menu(position) {
			var menus = require("../../common/settings/menu.json");

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
							$("#" + item.position).prepend($('<h2>').html(item.title));
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
			var top_carousel = require("../../common/settings/top_carousel.json");

			$("body").append($('<section>', { "id": "top_carousel", "class": "" }).append($('<div>', { "class": "carousel carousel-slider center" }).append($.map(top_carousel.messages, function (message) {
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
   * @uses build_page_contents()
   */

	}, {
		key: "build_contents_section",
		value: function build_contents_section() {
			var _this = this;

			var page = NAV.get_page();

			/**
    * Prepare containers
    */
			$("body").append($('<section>', { "id": "contents", "class": "" }).append(function () {
				if (page == "home") {
					return $('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m4 l4 xl4" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "info_container", "class": "col s12 m12 l12 xl12" }).append($('<div>', { "class": "card lighten-5" }).append($('<div>', { "class": "card-content" }).append($('<span>', { "class": "card-title highlight" })).append($('<div>', { "class": "help" }).append($('<div>', { "class": "center-align" }).text("Getting data...")).append(_this.loader({ type: "progress" })))))).append($('<div>', { "id": "feed_container", "class": "col s12 m12 l12 xl12" })))).append($('<div>', { "id": "ontologies_container", "class": "col s12 m8 l8 xl8" }));
				} else {
					return $('<div>', { "class": "container" });
				}
			}));

			// Get and place contents in the page
			this.build_page_contents(page);
		}

		/**
   * Build pages contents
   * @param  string 						page								Tha page name
   */

	}, {
		key: "build_page_contents",
		value: function build_page_contents(page) {
			var settings = require("../../common/settings/contents.json");
			switch (page) {
				case "home":
					/**
      * ---------------------------------------------------------------------
      */

					var news_per_page = 3;

					/**
      * Info
      * ---------------------------------------------------------------------
      */
					DATA.get_help_content().then(function (data) {
						$("#info_container .card-title").append($('<small>', { "class": "far fa-question-circle grey-text" })).append(" " + settings.home.sections.help.title);
						$("#info_container .card-content .help").html(data[0].content.replace("<ul>", '<ul class="browser-default">'));
						// return data[0].content;
					});

					/**
      * Feeds
      * ---------------------------------------------------------------------
      */
					DATA.get_community_website_feed().then(function (data) {
						var $feeds = [],
						    feeds = [],
						    total_pages = Math.ceil(parseInt(data.length) / news_per_page),
						    visible_data = 0,
						    current_page = 0,
						    visible;

						$.each(data, function (k, v) {
							if (v.category[0].label == "announcement") {
								visible_data++;
								if (visible_data % parseInt(settings.home.sections.news.items_per_page + 1) == 0) {
									current_page++;
								}

								feeds.push({
									page: current_page,
									visible: current_page == 0 ? "visible" : "hide",
									title: v.title,
									preview: v.preview,
									author: $('<a>', { "href": "mailto:" + v.author.email }).text(v.author.name).prop("outerHTML"),
									published: moment(v.published).local().format("MMM DD, YYYY"),
									link: v.link,
									abstract: STR.extract_text(v.content) + "<br />"
								});
							}
						});
						$.each(feeds, function (k, v) {
							$feeds.push($('<div>', { "class": "feed page_" + v.page + " " + v.visible }).append($('<div>', { "class": "preview" }).append($('<a>', { "href": v.link }).append($(v.preview)))).append($('<span>', { "class": "card-title highlight" }).append($('<a>', { "href": v.link }).text(v.title))).append($('<div>', { "class": "release" }).append($('<span>', { "class": "far fa-fw fa-clock" })).append($('<span>').html(" " + v.published + " by " + v.author))
							// Uncomment below if you want the abstract and the "Read more" button on each news
							//
							// ).append(
							// 	$('<div>', {"class": "content"}).append(
							// 		v.abstract
							// 	).append(
							// 		$('<a>', {"href": v.link, "class": "readmore"}).text("Read more...")
							// 	)
							));
						});

						$("#feed_container").append($('<div>', { "class": "card z-depth-1" }).append($('<div>', { "class": "card-content" }).append($('<div>', { "class": "card-title highlight" }).append(settings.home.sections.news.title))).append($('<div>', { "class": "card-content" }).append($feeds

						// Uncomment below if you want news pagination
						//
						// PAGINATION.build_pagination({
						// 	id: "feed_pagination",
						// 	content: "#feed_container",
						// 	items: ".feed",
						// 	current_page: 1,
						// 	total_pages: Math.ceil(parseInt(data.length)/news_per_page),
						// })
						)).append($('<div>', { "class": "card-action right-align" }).append($('<a>', { "class": "btn btn-flat highlight-btn", "href": "https://sites.google.com/a/cgxchange.org/cropontologycommunity/" }).text("Read more...")))).slideDown(300);
					}).catch(function (e) {
						// handle the error
					});

					/**
      * Ontologies
      * ---------------------------------------------------------------------
      */
					DATA.get_ontologies().then(function (data) {
						$("#ontologies_container").append($('<h5>').text("Ontologies")).append($('<ul>', { "class": "collapsible z-depth-0", "data-collapsible": "accordion" })).append($('<h5>', { "class": "all-ontologies" }).append($('<a>', { "href": "" }).text("All ontologies ›")));

						var current_page = 1,
						    page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
						    page_content = [];

						if (page_limit <= 0) {
							page_limit = 1;
						}

						/**
       * Cycle categories (5 items)
       */
						$.each(data, function (k, categories) {
							var page = 0,
							    pages = categories.ontologies.length > page_limit ? Math.ceil(categories.ontologies.length / page_limit) : 1,
							    page_count = 0,
							    $pagination = $('<div>', { "class": "ontology_pagination pagination-content" }),
							    $ontology_page = null;

							$("#ontologies_container .collapsible").append($('<li>', {
								"class": k == 3 ? "active" : "",
								"id": categories.category.id
							}).append($('<div>', { "class": "collapsible-header " + (k == 3 ? "active" : "") }).append($('<div>', { "class": "collapsible-secondary help-text" }).append(categories.ontologies.length + " " + STR.pluralize(categories.ontologies.length, "item")).append(function () {
								if (pages > 1) {
									var $indications = $('<span>', {
										"class": "tooltipped",
										"data-tooltip": "Displaying page " + current_page + " of " + pages + " - " + page_limit + " items per page"
									}).append(" | ").append($('<span>', { "class": "far fa-file-alt" })).append($('<span>', { "id": "page_no", "class": "grey-text" }).text(current_page)).append("/" + pages).prop("outerHTML");

									setTimeout(function () {
										$("#ontologies_container .tooltipped").tooltip({ position: "left" });
									}, 1000);
									return $indications;
								}
							})).append($('<div>', { "class": "left" }).append($('<span>', { "class": categories.category.icon })).append($('<span>').text(categories.category.name)))).append($('<div>', { "class": "collapsible-body" + (pages > 0 ? " paginated" : "") }).append(function () {
								if (pages > 1) {
									return $pagination;
								}
							}).append($('<ul>', { "id": "ontology_container" }).append(
							/**
        * Cycle all ontologies
        */
							$.map(categories.ontologies, function (vv, kk) {
								page_count = kk + 1;

								/**
         * Subdivide ontologies in pages
         */
								if (page_count % page_limit == 1 || page_limit == 1) {
									page++;

									var display = page == 1 || pages == 1 ? "" : "hide";
									$ontology_page = $('<li>', { "class": "ontology page_" + page + " " + display }).append($('<ul>', { "class": "collection" }));
								}
								$ontology_page.find(".collection").append($('<li>', { "class": "collection-item" }).append($('<a>', {
									"href": "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + vv.ontology_name
								}).append($('<h2>').append(vv.ontology_name))).append($('<a>', { "href": "javascript:;", "class": "secondary-content download" }).append("Download").append($('<span>', { "class": "picol_arrow_full_down" }))).append($('<span>', { "class": "items_count" }).text(vv.tot + " " + STR.pluralize(vv.tot, "item"))).append($('<p>').text(vv.ontology_summary)));
								return $ontology_page;
							}))).append(function () {
								if (pages > 1) {
									return $pagination.clone();
								}
							}))).collapsible();

							$("#" + categories.category.id).find(".pagination-content").append(PAGINATION.build_pagination({
								id: "ontology_pagination",
								context_class: categories.category.id,
								content: "#ontology_container",
								items: ".ontology",
								total_pages: pages
							}));
						});
					}).catch(function (e) {
						// handle the error
					});
					break;
				case "contact-us":
				case "contact us":
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "contact_form").append($('<h1>').text("Contact us")).append($('<form>', {
						"method": "get",
						"onsubmit": "return false;"
					}).append($('<div>', { "class": "row" }).append($('<form>', { "class": "col s12 m6" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s6" }).append($('<input>', { "type": "text", "id": "first_name", "class": "validate" })).append($('<label>', { "for": "first_name" }).text("First name"))).append($('<div>', { "class": "input-field col s6" }).append($('<input>', { "type": "text", "id": "last_name", "class": "validate" })).append($('<label>', { "for": "last_name" }).text("Last name"))).append($('<div>', { "class": "input-field col s12" }).append($('<input>', { "type": "email", "id": "email", "class": "validate" })).append($('<label>', { "for": "email" }).text("E-mail address")))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s10" }).append($('<input>', { "type": "text", "id": "subject", "class": "validate" })).append($('<label>', { "for": "subject" }).text("Subject"))).append($('<div>', { "class": "input-field col s12" }).append($('<textarea>', { "id": "message", "class": "materialize-textarea" })).append($('<label>', { "for": "message" }).text("Message")))))));
					break;
				case "about":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(about);
					break;
			}
		}
		/**
   * Build the footer section
   */

	}, {
		key: "build_footer",
		value: function build_footer() {
			$("body").append($("<footer>").append($("<div>", { "class": "row" }).append($("<div>", { "class": "col s12 m3 l3 xl3" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "class": "responsive-img", "src": "common/img/crop_ontology_white.png" }))).append($('<p>', { "class": "description" }).html("Some identities data<br />such as address, informations, etc..."))).append($("<div>", { "id": "left_menu", "class": "col s12 m2 l2 xl2" })).append($("<div>", { "id": "center_menu", "class": "col s12 m2 l2 xl2" })).append($("<div>", { "id": "right_menu", "class": "col s12 m2 l2 xl2" })))).append($('<section>', { "id": "partners" }).append($('<div>', { "class": "row container center" }).append($('<div>', { "id": "bottom_links", "class": "col s12 m6 l6 xl6" })).append($('<div>', { "class": "col s12 m6 l6 xl6 right right-align" }).append($('<a>', { "href": "javascript:;", "target": "_blank" }).append($('<img>', { "src": "common/img/big-data_platform_logo.png" })))))).append($('<center>').append($('<p>').append("Crop Ontology by Integrated Breeding Platform is licensed under a ").append($('<a>', { "href": "https://creativecommons.org/licenses/by/4.0/", "target": "_blank" }).text("Creative Commons Attribution 4.0 International License"))));

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
