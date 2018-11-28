/* jshint esversion: 6 */

class layout {
	/**
	 * Build a menu
	 * @param  string 						position							The menu position
	 * @return object
	 */
	build_menu(position) {
		let menus = require("../../common/menu.json");

		$.each(menus, (k, v) => {
			$("#" + position).append(
				$.map(v[position].items, (item) => {
					if(item.label === undefined && item.separator) {
						switch($.type(item.separator)) {
							case "boolean":
								return $('<li>').append(
									$('<span>', {"class": "separator"})
								);
								break;
							case "string":
								return $('<li>', {"class": "disabled black-text"}).append(
									$('<span>').text(item.separator)
								);
								break;
						}
					} else {
						return $('<li>').append(
							$('<a>', {"href": item.link}).text(item.label)
						);
					}
				})
			);
		});
	}

	/**
	 * Build the page <header>
	 * @return {[type]} [description]
	 */
	build_header() {
		$("body").prepend(
			$("<header>").append(
				$('<nav>', {"class": "transparent z-depth-0"}).append(
					$('<div>', {"class": "nav-wrapper"}).append(
						$('<a>', {"href": "javascript:;", "class": "brand-logo"}).append(
	                        $('<img>', {"src": "common/img/crop_ontology.png"})
						)
					).append(
						// Top menu container
						$('<ul>', {"id": "top_menu", "class": "right hide-on-med-and-down"})
					)
				)
			)
		);

		/**
		 * Build the top menu
		 * @uses build_menu()
		 */
		this.build_menu("top_menu");
	}

	/**
	 * Build the carousel messages slider
	 */
	build_carousel() {
		let top_carousel = require("../../common/top_carousel.json");

		$("body").append(
			$('<section>', {"id": "top_carousel", "class": "container"}).append(
				$('<div>', {"class": "carousel carousel-slider center"}).append(
					$.map(top_carousel.messages, (message) => {
						message = message.replace(/\n/gm, "<br />");
						message = message.replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>');
						return $('<div>', {"class": "carousel-item valign-wrapper", "href": "#one"}).append(
							$('<h1>').html(message)
						)
					})
				)
			)
		);

		// Instantiate Materialize carousel
		$(".carousel").carousel({
			duration: 50,
			fullWidth: true,
			indicators: false
		}).animate({"opacity": 1}, 300);

		/**
		* Animate the carousel
		* @param integer						time							The delay after carousel change (default is 10'000)
		*/
		// setInterval(() => {
		// 	$(".carousel .carousel-item").fadeOut(300, () => {
		// 		$(".carousel").carousel("next");
		// 		$(".carousel .carousel-item").delay(200).fadeIn();
		// 	})
		// }, 10000);
	}

	/**
	 * Build the searchbar
	 */
	build_searchbar() {
		$("body").append(
			$('<section>', {"id": "searchbar", "class": "container"}).append(
				$('<form>', {"method": "get", "onsubmit": "return false;"}).append(
					$('<div>', {"class": "row"}).append(
						$('<div>', {"class": "input-field"}).append(
							$('<input>', {
								"type": "search",
								"id": "search",
								"placeholder": "Search...",
								"name": "q"
							})
						).append(
							$('<a>', {"href": "javascript:;", "class": "btn-text right"}).append(
								$('<span>', {"class": "fa fa-filter"})
							).append(" Add a filter")
						)
					)
				)
			)
		);
	}
}

export default layout;
