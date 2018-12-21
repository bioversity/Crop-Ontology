"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loader = function () {
	function loader() {
		_classCallCheck(this, loader);
	}

	_createClass(loader, [{
		key: "create",

		/**
   * Build a circular or a progress loader
   * @see https://materializecss.com/preloader.html
   *
   * @param  object 						options								The loader display options
   */
		value: function create(options) {
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
				colour: "grey",
				target: ""
			},
			    data = $.extend({}, defaults, options);

			switch (data.type) {
				case "progress":
					$(data.target).prepend($('<div>', { "class": "progress" }).append($('<div>', {
						"class": data.determinate ? "determinate" : "indeterminate",
						"style": data.size !== "" ? "width: " + data.size + "%" : ""
					})));
					break;
				case "circular":
					$(data.target).prepend($('<div>', { "class": "preloader-wrapper " + data.size + " active" }).append($('<div>', { "class": "spinner-layer spinner-" + data.colour + "-only" }).append($('<div>', { "class": "circle-clipper left" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "gap-patch" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "circle-clipper right" }).append($('<div>', { "class": "circle" })))));
					break;
			}
		}
	}, {
		key: "hide",
		value: function hide(item) {
			$(item).animate({ "opacity": 0 });
		}
	}]);

	return loader;
}();

exports.default = loader;
