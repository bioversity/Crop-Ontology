/* jshint esversion: 6 */
"strict mode";


class patches {
	jquery_ui_patch() {
		// Remove jQuery UI classes
		$(".ui-corner-all.ui-widget").removeClass("ui-corner-all ui-widget");
		$(".ui-button-icon-only").removeClass("ui-button-icon-only");

		// Remove jQuery UI unused objects
		$(".ui-button-icon-space").remove();

		// Convert jQuery UI classes with Materialize classes
		$(".ui-button").switchClass("ui-button", "btn white");
		// Convert jQuery UI classes with Font Awesome
		$(".ui-button-icon.ui-icon.ui-icon-plusthick").removeClass("ui-button-icon ui-icon ui-icon-plusthick").addClass("fa fa-plus");
	}
}

export default patches;
