"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAV = new _navigation2.default(),
    page = NAV.get_page();

var actions = function actions() {
    _classCallCheck(this, actions);
};

exports.default = actions;
