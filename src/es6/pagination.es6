/* jshint esversion: 6 */
"strict mode";

import str from "../../src/es6/_str.es6";
var STR = new str();

class pagination {
	/**
	* Build a pagination menu
	* @param  integer 						total_pages							The amount of pages
	*/
	build_pagination(options) {
		let defaults = {
			id: "",
			context_class: "group",
			content: "",
			items: "",
			current_page: 1,
			total_pages: 1
		},
		settings = $.extend( {}, defaults, options );
		let prev_page = (settings.current_page <= 1) ? 1 : settings.current_page - 1,
			next_page = (settings.current_page >= settings.total_pages) ? settings.total_pages : settings.current_page + 1,

			$pagination = $('<ul>', {
				"id": settings.id,
				"class": settings.context_class + " pagination center",
				"data-current_page": settings.current_page,
				"data-total_pages": settings.total_pages
			}),
			$left_arrow_btn = $('<li>', {"class": "prev_page_btn", disabled: true}).append(
				$('<a>', {"href": "javascript:;"}).append(
					$('<span>', {"class": "fa fa-chevron-left"})
				)
			).click((e) => {
				this.goto(e, settings.context_class, "prev", settings.content, settings.items);
			}),
			$right_arrow_btn = $('<li>', {"class": "next_page_btn"}).append(
				$('<a>', {"href": "javascript:;"}).append(
					$('<span>', {"class": "fa fa-chevron-right"})
				)
			).click((e) => {
				this.goto(e, settings.context_class, "next", settings.content, settings.items);
			});

		for (let p = 1; p <= settings.total_pages; p++) {
			let pagelink_class = (p == settings.current_page) ? "waves-effect active" : "waves-effect",
			left_arrow_class = (settings.current_page <= 1) ? "disabled" : "",
			right_arrow_class = (settings.current_page >= settings.total_pages) ? "disabled" : "";

			$left_arrow_btn.addClass(left_arrow_class);
			$right_arrow_btn.addClass(right_arrow_class);
			$pagination.append(
				$('<li>', {"class": pagelink_class + " page_" + p}).append(
					$('<a>', {"href": "javascript:;"}).text(p).click((e) => {
						this.goto(
							e,
							settings.context_class,
							p,
							settings.content,
							settings.items
						);
					})
				)
			);
		}
		return $pagination.prepend($left_arrow_btn).append($right_arrow_btn);
	}

	goto(e, context_class, page, content, items) {
		if(!$(e.target).closest("li").attr("disabled")) {
			let current_page = parseInt($("." + context_class).data("current_page")),
				total_pages = parseInt($("." + context_class).data("total_pages")),
				prev_page = (current_page <= 1) ? 1 : current_page -1,
				next_page = (current_page >= total_pages) ? total_pages : current_page + 1;

			$("." + context_class).find("li.active").removeClass("active");
			$("#" + context_class + " " + items).addClass("hide");
			switch(page) {
				case "prev":
					$("." + context_class).find("li.page_" + prev_page).addClass("active");
					$("." + context_class).data("current_page", prev_page);
					current_page = prev_page;
					break;
				case "next":
					$("." + context_class).find("li.page_" + next_page).addClass("active");
					$("." + context_class).data("current_page", next_page);
					current_page = next_page;
					break;
				default:
					$("." + context_class).find("li.page_" + page).addClass("active");
					$("." + context_class).data("current_page", page);
					current_page = page;
					break;
			}
			$(content + " " + items + ".page_" + current_page).removeClass("hide");
			if($("#page_no").length > 0) {
				$("#page_no").text(current_page);
			}

			// Prev/next buttons
			if(current_page > 1) {
				$(".prev_page_btn").removeClass("disabled").attr("disabled", false);
			} else {
				$(".prev_page_btn").addClass("disabled").attr("disabled", true);
			}
			if(current_page < total_pages) {
				$(".next_page_btn").removeClass("disabled").attr("disabled", false);
			} else {
				$(".next_page_btn").addClass("disabled").attr("disabled", true);
			}
		}
	}
}
export default pagination;
