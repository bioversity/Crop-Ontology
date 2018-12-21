/* jshint esversion: 6 */
"strict mode";


class loader {
	/**
	 * Build a circular or a progress loader
	 * @see https://materializecss.com/preloader.html
	 *
	 * @param  object 						options								The loader display options
	 */
	create(options) {
		let defaults = {
			/**
			 * The loader type.
			 * Options: "progress" or "circular"
			 * @type {String}
			 */
			type: "progress",
			/**
			 * The progress type.
			 * Options: `true` stay for determinate progress (need `size` option)
			 * NOTE: This option is available only for progress loaders
			 * @type {Boolean}
			 */
			determinate: false,
			/**
			 * The loader size.
			 * Options:
			 * 	- Circular loader: @type {String} 	"" or "small" or "big"
			 * 	- Progress loader: @type {Integer}	The percentage of progress
			 */
			size: "",
			/**
			 * The loader colour
			 * NOTE: This option is available only for circular loaders
			 * @type {String}
			 */
			colour: "grey",
			target: ""
		},
		data = $.extend({}, defaults, options);

		switch(data.type) {
			case "progress":
				$(data.target).prepend(
					$('<div>', {"class": "progress"}).append(
						$('<div>', {
							"class": (data.determinate) ? "determinate" : "indeterminate",
							"style": (data.size !== "") ? "width: " + data.size + "%" : ""
						})
					)
				);
				break;
			case "circular":
				$(data.target).prepend(
					$('<div>', {"class": "preloader-wrapper " + data.size + " active"}).append(
						$('<div>', {"class": "spinner-layer spinner-" + data.colour + "-only"}).append(
							$('<div>', {"class": "circle-clipper left"}).append(
								$('<div>', {"class": "circle"})
							)
						).append(
							$('<div>', {"class": "gap-patch"}).append(
								$('<div>', {"class": "circle"})
							)
						).append(
							$('<div>', {"class": "circle-clipper right"}).append(
								$('<div>', {"class": "circle"})
							)
						)
					)
				);
				break;
		}
	}

	hide(item) {
		$(item).animate({"opacity": 0});
	}
}

export default loader;
