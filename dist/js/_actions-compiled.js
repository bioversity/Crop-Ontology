"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAV = new _navigation2.default(),
    page = NAV.get_page();

var actions = function () {
    function actions() {
        _classCallCheck(this, actions);
    }

    _createClass(actions, [{
        key: "execute",
        value: function execute() {
            if (page == "ontology" || page == "terms") {
                this.edit_button_action();
            }
        }
    }, {
        key: "edit_button_action",
        value: function edit_button_action() {
            // Edit button action
            $("#page_info .btn-mini").on("click", function (e) {
                console.warn("mmm");
                // let $dd = $(e.target).closest("dd"),
                //     $dd2 = $dd.clone();
                //
                // $dd.html(
                //     $('<form>', {"method": "post", "enctype": "multipart/form-data", "action": ""}).append(
                //         $('<div>', {"class": "row"}).append(
                //             $('<div>', {"class": "input-field col s12"}).append(
                //                 $('<textarea>', {"class": "materialize-textarea", "name": "value"})
                //             )
                //         )
                //     ).append(
                //         $('<div>', {"class": "row"}).append(
                //             $('<div>', {"class": "col s12"}).append(
                //                 $('<a>', {"href": "javascript:;", "class": "grey-text left"}).text("‹ Cancel").on("click", () => {
                //                     $dd.html($dd2.html());
                //                 })
                //             ).append(
                //                 $('<a>', {"href": "javascript:;", "class": "btn btn-flat btn-highlight right"}).text("Save").on("click", () => {
                //                     console.log("Okay!");
                //                 })
                //             )
                //         )
                //     )
                // );
                // console.log();
            });
        }
    }]);

    return actions;
}();

exports.default = actions;
