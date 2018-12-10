"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var str = function () {
	function str() {
		_classCallCheck(this, str);
	}

	_createClass(str, [{
		key: "ucfirst",

		/**
   * Make a string's first character uppercase
   * This function is very similar to PHP ucfirst()
   * @see http://php.net/manual/en/function.ucfirst.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */
		value: function ucfirst(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		/**
   * Make a string's first character lowercase
   * This function is very similar to PHP lcfirst()
   * @see http://php.net/manual/en/function.lcfirst.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "lcfirst",
		value: function lcfirst(string) {
			return string.charAt(0).toLowerCase() + string.slice(1);
		}

		/**
   * Uppercase the first character of each word in a string
   * This function is very similar to PHP ucwords()
   * @see http://php.net/manual/en/function.ucwords.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "ucwords",
		value: function ucwords(string) {
			return (string + "").replace(/^(.)|\s+(.)/g, function ($1) {
				return $1.toUpperCase();
			});
		}

		/**
   * Quote string with slashes
   * This function is very similar to PHP addslashes()
   * @see http://php.net/manual/en/function.addslashes.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "addslashes",
		value: function addslashes(str) {
			return str.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\"/g, '\\"').replace(/\0/g, '\\0');
		}

		/**
   * Un-quotes a quoted string
   * This function is very similar to PHP stripslashes()
   * @see http://php.net/manual/en/function.stripslashes.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "stripslashes",
		value: function stripslashes(str) {
			return str.replace(/\\'/g, '\'').replace(/\\"/g, '"').replace(/\\0/g, '\0').replace(/\\\\/g, '\\');
		}

		/**
   * Split a multiline string by a given separator, then get the first line
   * NOTE: If not provided the separator is a comma ","
   * @param  string 							string							The string to split
   * @param  string 							split_by						The separator to split
   * @return string															The extracted string
   */

	}, {
		key: "extract_text",
		value: function extract_text(string, split_by) {
			if (split_by == undefined) {
				split_by = ",";
			}
			var string_part = $.trim($(string).text()).split(split_by)[0] + ".";
			return string_part.split("\n")[0];
		}

		/**
   * Pluralize a string
   * @param  integer 							items							The amount of items
   * @param  string 							string							The string to pluralize
   * @return The pluralized string
   */

	}, {
		key: "pluralize",
		value: function pluralize(items, string) {
			return items !== 1 ? string + "s" : string;
		}
	}]);

	return str;
}();

exports.default = str;
