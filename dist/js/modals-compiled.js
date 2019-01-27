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

var modals = function () {
	function modals() {
		_classCallCheck(this, modals);
	}

	_createClass(modals, [{
		key: "build_modal",

		/**
   * Build a modal popup
   * NOTE: Must be executed before or after creating the trigger button
   * @see http://archives.materializecss.com/0.100.2/modals.html
   *
   * @example:
   * ```
   * // Trigger
   * <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
   * ```
   *
   * @param object						options								Parameters passed as JSON object
   */
		value: function build_modal(options) {
			var defaults = {
				id: "modal",
				class: "",
				title: "Modal Header",
				subtitle: "",
				content: "Modal Content",
				display_buttons: true,
				ok_button: "Ok",
				cancel_button: "Cancel",
				ok_action: function ok_action() {
					return false;
				},
				cancel_action: function cancel_action() {
					return false;
				},
				fixed_footer: true,
				bottom_sheet: false,
				size: "medium" // Modal size. Possible options: "small", "medium", "large"
			},
			    settings = $.extend({}, defaults, options);

			$("body").prepend($('<div>', {
				"id": settings.id,
				"class": "modal " + settings.class + " " + settings.size + " " + (settings.fixed_footer ? " modal-fixed-footer" : "") + (settings.bottom_sheet ? " bottom-sheet" : "")
			}).append($('<div>', { "class": "modal-content" }).append($('<h4>').html(settings.title)).append(function () {
				if (settings.subtitle) {
					return $('<h5>').html(settings.subtitle);
				}
			}).append(settings.content)).append(function () {
				if (settings.display_buttons) {
					return $('<div>', { "class": "modal-footer" }).append($('<a>', { "href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat left" }).text(settings.cancel_button).click(function () {
						settings.cancel_action();
					})).append($('<a>', { "href": "javascript:;", "class": "modal-action waves-effect waves-green btn-flat right" }).text(settings.ok_button).click(function () {
						settings.ok_action();
					}));
				}
			}));
		}
	}, {
		key: "confirm",
		value: function confirm(options) {
			this.build_modal({
				id: "confirm_modal",
				size: "small",
				title: options.title,
				content: options.content,
				fixed_footer: false,
				bottom_sheet: false,
				ok_action: options.ok_action
			});
		}
	}, {
		key: "add_filter_row",
		value: function add_filter_row(options) {
			var defaults = {
				id: "",
				name: "",
				placeholder: ""
			},
			    settings = $.extend({}, defaults, options);

			return $('<div>', { class: "row filter" }).append($('<div>', { class: "input-field col s2" }).append($('<p>').append($('<input>', {
				type: "checkbox",
				class: "filled-in",
				id: settings.id
			})).append($('<label>', { for: settings.id }).text(settings.label)))).append($('<div>', { class: "input-field col s4" }).append($('<input>', {
				type: "text",
				name: settings.name,
				placeholder: settings.placeholder,
				disabled: true
			})));
		}

		/**
   * Build the filters modal
   */

	}, {
		key: "filters_modal",
		value: function filters_modal() {
			function activate_rows() {
				$(".filter").each(function (k, v) {
					var $checkbox = $(v).find("input[type='checkbox']"),
					    $input = $(v).find("input[type='text']");

					$checkbox.on("change", function () {
						if ($checkbox.is(":checked")) {
							$input.attr("disabled", false).focus();
						} else {
							$input.attr("disabled", true);
						}
					});
				});
			}

			var $filters_modal_content = $('<div>', { "class": "row" }).append($('<form>', { class: "col s12" }).append(this.add_filter_row({
				id: "user_check",
				name: "user",
				label: "Users:",
				placeholder: "Type a username, name or last name..."
			})).append(this.add_filter_row({
				id: "type_check",
				name: "type",
				label: "Type:",
				placeholder: "Ontology type..."
			})));

			this.build_modal({
				id: "searchbar_filters",
				title: "Filters",
				content: $filters_modal_content,
				fixed_footer: false
			});
			activate_rows();
		}
	}, {
		key: "user_modal",
		value: function user_modal(title) {
			var $user_modal_content = $('<div>', { "class": "" }).append($('<form>', { "class": "col s12" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s10 offset-s1" }).append($('<input>', {
				"type": "text",
				"name": "username",
				"id": "log_username"
			})).append($('<label>', { "for": "log_username" }).text("Username"))).append($('<div>', { "class": "input-field col s10 offset-s1" }).append($('<input>', {
				"type": "password",
				"name": "password",
				"id": "log_password"
			})).append($('<label>', { "for": "log_password" }).text("Password")))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s10 offset-s1" }).append($('<a>', { "href": "./forgot-password" }).text("Forgot Password?"))))).append($('<div>', { "id": "login_error", "class": "card red white-text center-align" }));

			this.build_modal({
				id: "user_modal",
				size: "small",
				title: title,
				content: $user_modal_content,
				fixed_footer: false,
				bottom_sheet: false,
				ok_action: function ok_action() {
					DATA.log_user($user_modal_content.find("form").serialize()).then(function (data) {
						if (data.error !== undefined) {
							$("#login_error").html(STR.ucfirst(STR.readable_data(data.error)));
						} else {
							location.reload();
						}
					}, function (error) {
						$("#login_error").html(error);
						return false;
					});
				}
			});
		}
	}, {
		key: "download_ontology_modal",
		value: function download_ontology_modal() {
			var $download_ontology_modal = $('<div>', { "class": "" }).append($('<div>', { class: "row" }).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/report?ontology_id=" + NAV.get_ontology_id(),
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".csv"
			}).append($('<h4>').append($('<span>', { "class": "picol_document_text" }))).append($('<h6>').text("Trait dictionary")))).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/rdf/" + NAV.get_ontology_id() + (NAV.get_term_id() !== undefined ? ":" + NAV.get_term_id() : "") + "/" + NAV.get_ontology_label(),
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".nt"
			}).append($('<h4>').append($('<span>', { "class": "picol_rdf" }))).append($('<h6>').text("RDF")))).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/ontology/" + NAV.get_ontology_id() + "/" + NAV.get_ontology_label() + "/nt",
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".nt"
			}).append($('<h4>').append($('<span>', { "class": "picol_rdf_document" }))).append($('<h6>').text("RDF N-Triples")))).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/obo/" + NAV.get_ontology_id(),
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".obo"
			}).append($('<h4>').append($('<span>', { "class": "picol_owl_lite_document" }))).append($('<h6>').text("OBO File")))));

			this.build_modal({
				id: "download_ontology_modal",
				size: "small",
				class: "centered",
				title: "Download",
				subtitle: "<tt>" + NAV.get_ontology_id() + (NAV.get_term_id() !== undefined ? "<small>:" + NAV.get_term_id() + "</small>" : "") + "</tt> &rsaquo; " + (NAV.get_term_label() !== undefined ? NAV.get_term_label() : NAV.get_ontology_label()),
				content: $download_ontology_modal,
				fixed_footer: false,
				bottom_sheet: false,
				display_buttons: false
			});
		}
	}]);

	return modals;
}();

exports.default = modals;
