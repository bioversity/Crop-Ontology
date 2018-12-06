'use strict';
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$.fn.serializeObject = function () {
    var o = {},
        a = this.serializeArray();

    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};

var obj = function obj() {
    _classCallCheck(this, obj);
};

exports.default = obj;
