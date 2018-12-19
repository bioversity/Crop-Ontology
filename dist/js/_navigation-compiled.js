"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var navigation = function () {
	function navigation() {
		_classCallCheck(this, navigation);
	}

	_createClass(navigation, [{
		key: "get_page",

		/**
   * Get the current page from the address bar
   * @return string															The current page
   */
		value: function get_page() {
			var page = window.location.pathname.split("/").splice(1)[0];
			return page == "" ? "home" : page;
		}

		/**
   * Get the path of the current page
   * @return array															The page path
   */

	}, {
		key: "get_url_path",
		value: function get_url_path() {
			var url = window.location.pathname.split("/").splice(1),
			    path = [];
			$.each(url, function (k, v) {
				path.push(decodeURIComponent(v));
			});
			return path;
		}
	}]);

	return navigation;
}();

exports.default = navigation;
