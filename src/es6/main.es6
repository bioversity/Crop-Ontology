/* jshint esversion: 6 */
"strict mode";

import actions from "../../src/es6/_actions.es6";
import layout from "../../src/es6/layout.es6";
import navigation from "../../src/es6/_navigation.es6";

require("../../src/es6/_obj.es6");

var
	LAYOUT = new layout(),
	ACTIONS = new actions(),
	NAV = new navigation(),

	page = NAV.get_page(),

	settings = require("../../common/settings/contents.json")
;


// $.noConflict();
$(document).ready(() => {
	// Build the <header> object
	LAYOUT.build_header();
	// Build the top carousel
	LAYOUT.build_carousel();
	// Build the search bar
	LAYOUT.build_searchbar();
	if(page == "home") {
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

	// Load scripts
	LAYOUT.load_scripts();


	LAYOUT.activate();
});
