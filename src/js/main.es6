/* jshint esversion: 6 */
"strict mode";

import layout from "../../src/js/layout.es6";
// // import ColorCanvas from "../../src/js/ColorCanvas.es6";
// import ColorPicker from "../../src/js/ColorPicker.es6";
// import Pantone from "../../src/js/PANTONE.es6";

var LAYOUT = new layout();
// 	PANTONE = new Pantone();

$(document).ready(() => {
	// Build the <header> object
	LAYOUT.build_header();
	// Build the top carousel
	LAYOUT.build_carousel();
	// Build the search bar
	LAYOUT.build_searchbar();
});
