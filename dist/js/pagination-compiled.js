"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _str = require("../../src/js/_str.es6");

var _str2 = _interopRequireDefault(_str);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STR = new _str2.default();

var pagination = function () {
	function pagination() {
		_classCallCheck(this, pagination);
	}

	_createClass(pagination, [{
		key: "build_pagination",

		/**
  * Build a pagination menu
  * @param  integer 						total_pages							The amount of pages
  */
		value: function build_pagination(options) {
			var _this = this;

			var defaults = {
				id: "",
				content: "",
				items: "",
				current_page: 1,
				total_pages: 1
			},
			    settings = $.extend({}, defaults, options);

			var prev_page = settings.current_page <= 1 ? 1 : settings.current_page - 1,
			    next_page = settings.current_page >= settings.total_pages ? settings.total_pages : settings.current_page + 1,
			    $news_pagination = $('<ul>', {
				"id": settings.id,
				"class": "pagination center",
				"data-current_page": settings.current_page,
				"data-total_pages": settings.total_pages
			}),
			    $left_arrow_btn = $('<li>', { "class": "prev_page_btn" }).append($('<a>', { "href": "javascript:;" }).append($('<span>', { "class": "fa fa-chevron-left" }))).click(function () {
				_this.goto(settings.id, "prev", settings.content, settings.items);
			}),
			    $right_arrow_btn = $('<li>', { "class": "next_page_btn" }).append($('<a>', { "href": "javascript:;" }).append($('<span>', { "class": "fa fa-chevron-right" }))).click(function () {
				_this.goto(settings.id, "next", settings.content, settings.items);
			});

			var _loop = function _loop(p) {
				var pagelink_class = p == settings.current_page ? "waves-effect active" : "waves-effect",
				    left_arrow_class = settings.current_page <= 1 ? "disabled" : "",
				    right_arrow_class = settings.current_page >= settings.total_pages ? "disabled" : "";

				$left_arrow_btn.addClass(left_arrow_class);
				$right_arrow_btn.addClass(right_arrow_class);
				$news_pagination.append($('<li>', { "class": pagelink_class + " page_" + p }).append($('<a>', { "href": "javascript:;" }).text(p).click(function () {
					_this.goto(settings.id, p, settings.content, settings.items);
				})));
			};

			for (var p = 1; p <= settings.total_pages; p++) {
				_loop(p);
			}

			return $news_pagination.prepend($left_arrow_btn).append($right_arrow_btn);
		}
	}, {
		key: "goto",
		value: function goto(id, page, content, items) {
			var current_page = parseInt($("#" + id).data("current_page")),
			    total_pages = parseInt($("#" + id).data("total_pages")),
			    prev_page = current_page <= 1 ? 1 : current_page - 1,
			    next_page = current_page >= total_pages ? total_pages : current_page + 1;

			$("#" + id).find("li.active").removeClass("active");

			$(content + " " + items + ".page_" + current_page).addClass("hide");
			switch (page) {
				case "prev":
					$("#" + id).find("li.page_" + prev_page).addClass("active");
					$("#" + id).data("current_page", prev_page);
					current_page = prev_page;
					break;
				case "next":
					$("#" + id).find("li.page_" + next_page).addClass("active");
					$("#" + id).data("current_page", next_page);
					current_page = next_page;
					break;
				default:
					$("#" + id).find("li.page_" + page).addClass("active");
					$("#" + id).data("current_page", page);
					current_page = page;
					break;
			}
			$(content + " " + items + ".page_" + current_page).removeClass("hide");

			// Prev/next buttons
			if (current_page > 1) {
				$(".prev_page_btn").removeClass("disabled");
			} else {
				$(".prev_page_btn").addClass("disabled");
			}
			if (current_page < total_pages) {
				$(".next_page_btn").removeClass("disabled");
			} else {
				$(".next_page_btn").addClass("disabled");
			}
		}
	}]);

	return pagination;
}();

exports.default = pagination;
