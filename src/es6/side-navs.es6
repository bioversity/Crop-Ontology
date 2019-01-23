/* jshint esversion: 6 */
"strict mode";

import navigation from "../../src/es6/_navigation.es6";
import str from "../../src/es6/_str.es6";
import data from "../../src/es6/data.es6";
var NAV = new navigation();
var STR = new str();
var DATA = new data();

class side_navs {
	/**
	 * Build a modal popup
	 * NOTE: Must be executed before or after creating the trigger button
	 * @see http://archives.materializecss.com/0.100.2/side-nav.html
	 *
	 * @example:
	 * ```
	 * // Trigger
	 * <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
	 * ```
	 *
	 * @param object						options								Parameters passed as JSON object
	 */
	build_side_nav(options) {
		let defaults = {
			id: "side-nav",
			button_id: "side-nav_btn",
			content: "",
			target: "body"
		},
		settings = $.extend( {}, defaults, options );
		if($("#" + settings.id).length == 0) {
			$(settings.target).append(
				$('<a>', {
					"href": "javascript:;", "id": settings.button_id,
					"data-activates": settings.id,
					"class": "button-collapse"
				})
			).append(
				$('<ul>', {"id": settings.id, "class": "side-nav"}).append(settings.content)
			);
			$("#" + settings.button_id).sideNav({
				edge: settings.position,
				closeOnClick: false
			});
		} else {
			$("#" + settings.id).html(settings.content)
		}
	}
}

export default side_navs;
