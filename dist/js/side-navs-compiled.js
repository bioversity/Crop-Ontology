"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

var _data = require("../../src/es6/data.es6");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAV = new _navigation2.default();
var STR = new _str2.default();
var DATA = new _data2.default();

var side_navs = function () {
	function side_navs() {
		_classCallCheck(this, side_navs);
	}

	_createClass(side_navs, [{
		key: "build_side_nav",

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
		value: function build_side_nav(options) {
			var defaults = {
				id: "side-nav",
				button_id: "side-nav_btn",
				content: "",
				target: "body"
			},
			    settings = $.extend({}, defaults, options);
			if ($("#" + settings.id).length == 0) {
				$(settings.target).append($('<a>', {
					"href": "javascript:;", "id": settings.button_id,
					"data-activates": settings.id,
					"class": "button-collapse"
				})).append($('<ul>', { "id": settings.id, "class": "side-nav" }).append(settings.content));
				$("#" + settings.button_id).sideNav({
					edge: settings.position,
					closeOnClick: false
				});
			} else {
				$("#" + settings.id).html(settings.content);
			}
		}
	}]);

	return side_navs;
}();

exports.default = side_navs;
