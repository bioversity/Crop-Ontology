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
		key: "get_url_path",

		/**
  * Get the path of the current URL
  * @return array															The page path
  */
		value: function get_url_path() {
			var url = window.location.pathname.split(/(?:\/|\:)+/).splice(1),
			    path = [];

			$.each(url, function (k, v) {
				path.push(decodeURIComponent(v));
			});
			return path;
		}

		/**
   * Get the current page from the current URL
   * @uses get_url_path()
   *
   * @return string															The current page
   */

	}, {
		key: "get_page",
		value: function get_page() {
			var page = this.get_url_path()[0];
			return page == "" ? "home" : page;
		}

		/**
   * ONTOLOGY
   * -------------------------------------------------------------------------
   */

		/**
   * The Ontology URL performed by regex
   * @see https://regex101.com/r/S4gNgj/4
   *
   * @param string						separator							The string separator
   */

	}, {
		key: "get_ontology_url_regex",
		value: function get_ontology_url_regex(separator) {
			var id = "([\\w]+\\_[\\w\\d]+)",
			    label = "(.*)";
			return new RegExp(id + "\\" + separator + label, "g");
		}

		/**
   * The Ontology Term URL performed by regex
   * @see https://regex101.com/r/S4gNgj/5
   *
   * @param string						separator							The string separator
   */

	}, {
		key: "get_terms_url_regex",
		value: function get_terms_url_regex(separator) {
			var id = "([\\w]+\\_[\\w\\d]+)",
			    label = "(.*)";
			return new RegExp(id + "\\" + separator + label + separator + label, "g");
		}

		/**
   * Get the Ontology ID from the current URL
   * @uses get_url_path()
   *
   * @return string															The Ontology ID
   */

	}, {
		key: "get_ontology_id",
		value: function get_ontology_id() {
			return this.get_url_path()[1];
		}

		/**
   * Get the Ontology Term ID from the current URL
   * @uses get_url_path()
   *
   * @return string															The Term ID
   */

	}, {
		key: "get_term_id",
		value: function get_term_id() {
			return this.get_url_path()[2];
		}

		/**
   * Get the Ontology and the Ontology Term ID from the current URL
   *
   * @return string															The Ontology and the Ontology Term ID
   */

	}, {
		key: "get_full_id",
		value: function get_full_id() {
			return this.get_page() == "terms" ? this.get_url_path()[1] + ":" + this.get_url_path()[2] : this.get_url_path()[1];
		}

		/**
   * Get the Ontology label from the current URL
   * @uses get_url_path()
   *
   * @return string															The current page
   */

	}, {
		key: "get_ontology_label",
		value: function get_ontology_label() {
			return this.get_url_path()[2];
		}

		/**
   * Get the Ontology Term label from the current URL
   * @uses get_url_path()
   *
   * @return string															The current page
   */

	}, {
		key: "get_term_label",
		value: function get_term_label() {
			return this.get_url_path()[3];
		}
	}]);

	return navigation;
}();

exports.default = navigation;
