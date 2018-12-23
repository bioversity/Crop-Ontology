"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var settings = require("../../common/settings/contents.json");

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
			return str.replace(/\\'/g, '\'').replace(/\\"/g, '"').replace(/\\:/g, ':').replace(/\\0/g, '\0').replace(/\\\\/g, '\\');
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

		/**
   * Check wheter a given string is a JSON
   * @param  string 							string							The string to analyze
   * @return boolean
   */

	}, {
		key: "is_json",
		value: function is_json(string) {
			try {
				JSON.parse(string);
			} catch (e) {
				return false;
			}
			return true;
		}
	}, {
		key: "camel_case_2_text",
		value: function camel_case_2_text(string) {
			return string.replace(/([a-z])([A-Z])/g, "$1 $2");
		}
	}, {
		key: "readable_data",
		value: function readable_data(string) {
			return this.camel_case_2_text(string.replace("_", " "));
		}

		/**
   * 								ONTOLOGIES
   * -------------------------------------------------------------------------
   */

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
   * Get all languages in a JSON string
   * @param  string 							string							The string to analyze
   * @return array|string														All collected languages
   */

	}, {
		key: "get_ontologies_languages",
		value: function get_ontologies_languages(string) {
			var _this = this;

			var langs = [];
			if (this.is_json(string)) {
				$.each(JSON.parse(string), function (lang, name) {
					langs.push(_this.ucfirst(lang));
				});
			} else {
				langs.push("English");
			}
			return langs.length == 1 ? langs[0] : langs;
		}

		/**
   * Extract a string from a JSON string
   * The Crop Onlogy API often provide a JSON language string.
   * This method extract the string value from that JSON string
   * @example `{"english": "Text in english"}`
   *
   * @param  string 							string							The string to analyze
   * @param  string 							language						The preferred language
   * @return string															The extracted string
   */

	}, {
		key: "get_ontology_term",
		value: function get_ontology_term(string, language) {
			var _this2 = this;

			language = language == undefined ? settings.general.language : language;

			var strings = {};
			if (this.is_json(string)) {
				$.each(JSON.parse(string), function (lang, term) {
					strings[lang] = _this2.ucfirst(term);
				});
			} else {
				strings[language] = "?";
			}
			return strings[language];
		}
	}]);

	return str;
}();

exports.default = str;
