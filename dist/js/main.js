(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
    "menu": {
        "top_menu": {
            "position": "right",
            "items": [
                {
                    "label": "Home",
                    "link": "./",
                    "display": true
                },
                {
                    "label": "About",
                    "link": "/About",
                    "display": true
                },
                {
                    "label": "API",
                    "link": "/API",
                    "display": true
                },
                {
                    "label": "Agtrials",
                    "link": "/Agtrials",
                    "display": true
                },
                {
                    "label": "Annotation Tool",
                    "link": "/Annotation-Tool",
                    "display": true
                },
                { "separator": true },
                {
                    "label": "Login",
                    "link": "/Login",
                    "display": true
                },
                { "separator": "or" },
                {
                    "label": "Register",
                    "link": "/Register",
                    "display": true
                }
            ]
        },
        "foter_menu": {
            "items": [
                {
                    "title": "",
                    "position": "left",
                    "items": [
                        {
                            "label": "Home",
                            "link": "./",
                            "display": true
                        },
                        { "separator": "" },
                        {
                            "label": "About the project",
                            "link": "/About",
                            "display": true
                        },
                        {
                            "label": "Blog",
                            "link": "/Blog",
                            "display": true
                        },
                        {
                            "label": "API",
                            "link": "/API",
                            "display": true
                        },
                        {
                            "label": "Agtrials",
                            "link": "/Agtrials",
                            "display": true
                        },
                        {
                            "label": "Annotation Tool",
                            "link": "/Annotation-Tool",
                            "display": true
                        },
                        {
                            "label": "All ontologies",
                            "link": "/All-ontologies",
                            "display": true
                        }
                    ]
                },
                {
                    "title": "Related sites",
                    "position": "left",
                    "items": [
                        {
                            "label": "Integrated Breeding Platform",
                            "link": "https://www.integratedbreeding.net",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Bioversity International",
                            "link": "http://www.bioversityinternational.org",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "NSF (National Science Foundation) -  cROP: Common Reference Ontologies and Applications for Plant Biology",
                            "link": "https://www.nsf.gov/awardsearch/showAward?AWD_ID=1340112",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Planteome",
                            "link": "http://www.planteome.org",
                            "display": true,
                            "target": "_blank"
                        }
                    ]
                },
                {
                    "title": "Othe projects",
                    "position": "left",
                    "items": [
                        {
                            "label": "External project",
                            "link": "",
                            "display": true
                        }
                    ]
                }
            ]
        },
        "bottom_links": {
            "items": [
                {
                    "title": "",
                    "position": "left",
                    "items": [
                        {
                            "label": "Integrated Breeding Platform",
                            "link": "https://www.integratedbreeding.net",
                            "image": "",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Bioversity International",
                            "link": "http://www.bioversityinternational.org",
                            "image": "",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "NSF (National Science Foundation) -  cROP: Common Reference Ontologies and Applications for Plant Biology",
                            "link": "https://www.nsf.gov/awardsearch/showAward?AWD_ID=1340112",
                            "image": "",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Planteome",
                            "link": "http://www.planteome.org",
                            "image": "",
                            "display": true,
                            "target": "_blank"
                        }
                    ]
                },
                {
                    "title": "Bottom Heading",
                    "position": "right",
                    "items": [
                        {
                            "label": "",
                            "link": "",
                            "image": "bottom_headings.svg",
                            "display": true
                        }
                    ]
                }
            ]
        }
    }
}

},{}],2:[function(require,module,exports){
module.exports={
    "messages": [
        "Claim text or 300x1920 banner image\nwith [carousel] sliding or fade effect",
        "Test"
    ]
}

},{}],3:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

var _layout = require("../../src/js/layout.es6");

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

// // import ColorCanvas from "../../src/js/ColorCanvas.es6";
// import ColorPicker from "../../src/js/ColorPicker.es6";
// import Pantone from "../../src/js/PANTONE.es6";

var LAYOUT = new _layout2.default();
// 	PANTONE = new Pantone();

$(document).ready(function () {
	// Build the <header> object
	LAYOUT.build_header();
	// Build the top carousel
	LAYOUT.build_carousel();
	// Build the search bar
	LAYOUT.build_searchbar();
});

},{"../../src/js/layout.es6":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint esversion: 6 */

var layout = function () {
	function layout() {
		_classCallCheck(this, layout);
	}

	_createClass(layout, [{
		key: "build_menu",

		/**
   * Build a menu
   * @param  string 						position							The menu position
   * @return object
   */
		value: function build_menu(position) {
			var menus = require("../../common/menu.json");

			$.each(menus, function (k, v) {
				$("#" + position).append($.map(v[position].items, function (item) {
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
						return $('<li>').append($('<a>', { "href": item.link }).text(item.label));
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
			// setInterval(() => {
			// 	$(".carousel .carousel-item").fadeOut(300, () => {
			// 		$(".carousel").carousel("next");
			// 		$(".carousel .carousel-item").delay(200).fadeIn();
			// 	})
			// }, 10000);
		}

		/**
   * Build the searchbar
   */

	}, {
		key: "build_searchbar",
		value: function build_searchbar() {
			$("body").append($('<section>', { "id": "searchbar", "class": "container" }).append($('<form>', { "method": "get", "onsubmit": "return false;" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field" }).append($('<input>', {
				"type": "search",
				"id": "search",
				"placeholder": "Search...",
				"name": "q"
			})).append($('<a>', { "href": "javascript:;", "class": "btn-text right" }).append($('<span>', { "class": "fa fa-filter" })).append(" Add a filter"))))));
		}
	}]);

	return layout;
}();

exports.default = layout;

},{"../../common/menu.json":1,"../../common/top_carousel.json":2}]},{},[3]);
