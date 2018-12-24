"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var patches = function () {
	function patches() {
		_classCallCheck(this, patches);
	}

	_createClass(patches, [{
		key: "jquery_ui_patch",
		value: function jquery_ui_patch() {
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
	}]);

	return patches;
}();

exports.default = patches;
