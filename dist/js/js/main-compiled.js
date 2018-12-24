"use strict";
/* jshint esversion: 6 */
"strict mode";

var _layout = require("../../src/js/layout.es6");

var _layout2 = _interopRequireDefault(_layout);

var _navigation = require("../../src/js/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // import ColorCanvas from "../../src/js/ColorCanvas.es6";
// import ColorPicker from "../../src/js/ColorPicker.es6";
// import Pantone from "../../src/js/PANTONE.es6";

require("../../src/js/_obj.es6");

var LAYOUT = new _layout2.default(),
    NAV = new _navigation2.default(),
    page = NAV.get_page(),
    settings = require("../../common/settings/contents.json");

// $.noConflict();
$(document).ready(function () {
	// Build the <header> object
	LAYOUT.build_header();
	// Build the top carousel
	LAYOUT.build_carousel();
	// Build the search bar
	LAYOUT.build_searchbar();
	if (page == "home") {
		// Build the halfway menu
		LAYOUT.build_halfway_menu();
		// Build the contents section
		LAYOUT.build_contents_section();
	} else {
		// Build the contents section
		LAYOUT.build_contents_section();
		// Build the halfway menu
		LAYOUT.build_halfway_menu();
	}
	// Build the footer
	LAYOUT.build_footer();

	LAYOUT.activate();
});
