/* jshint esversion: 6 */
"strict mode";

class filters {
	draw_filter(key, value) {
		return $('<li>', {"class": "tag " + key}).text(key + ": " + value).append(
			$('<a>', {
				"href": "javascript:;",
				"class": "tooltipped",
				"data-position": "top",
				"data-tooltip": $('<i>').text("Are you sure?").prop("outerHTML")
			}).append(
				$('<span>', {"class": "fa fa-times"})
			)
		)
	}

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
	build_modal(options) {
		let defaults = {
			id: "modal",
			title: "Modal Header",
			content: "Modal Content",
			ok_button: "Ok",
			cancel_button: "Cancel",
			fixed_footer: true
		},
		settings = $.extend({}, defaults, options);

		$("body").prepend(
			$('<div>', {"id": settings.id, "class": "modal" + ((settings.fixed_footer) ? " modal-fixed-footer" : "")}).append(
				$('<div>', {"class": "modal-content"}).append(
					$('<h4>').text(settings.title)
				).append(settings.content)
			).append(
				$('<div>', {"class": "modal-footer"}).append(
					$('<a>', {"href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat left"}).text(settings.cancel_button)
				).append(
					$('<a>', {"href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat right"}).text(settings.ok_button)
				)
			)
		);
	}

	add_filter_row(options) {
		let defaults = {
			id: "",
			name: "",
			placeholder: ""
		},
		settings = $.extend( {}, defaults, options );

		return $('<div>', {class: "row filter"}).append(
			$('<div>', {class: "input-field col s2"}).append(
				$('<p>').append(
					$('<input>', {
						type: "checkbox",
						class: "filled-in",
						id: settings.id
					})
				).append(
					$('<label>', {for: settings.id}).text(settings.label)
				)
			)
		).append(
			$('<div>', {class: "input-field col s4"}).append(
				$('<input>', {
					type: "text",
					name: settings.name,
					placeholder: settings.placeholder,
					disabled: true
				})
			)
		)
	}

	/**
	 * Build the filters modal
	 */
	filters_modal() {
		function activate_rows() {
			$(".filter").each((k, v) => {
				let $checkbox = $(v).find("input[type='checkbox']"),
					$input = $(v).find("input[type='text']");

				$checkbox.on("change", () => {
					if($checkbox.is(":checked")) {
						$input.attr("disabled", false).focus();
					} else {
						$input.attr("disabled", true);
					}
				});
			})
		}

		let $filters_modal_content = $('<div>', {"class": "row"}).append(
    		$('<form>', {class: "col s12"}).append(
				this.add_filter_row({
					id: "user_check",
					name: "user",
					label: "Users:",
					placeholder: "Type a username, name or last name..."
				})
			).append(
				this.add_filter_row({
					id: "type_check",
					name: "type",
					label: "Type:",
					placeholder: "Ontology type..."
				})
			)
		);

		this.build_modal({
			id: "searchbar_filters",
			title: "Filters",
			content: $filters_modal_content,
			fixed_footer: false
		});
		activate_rows();
	}
}

export default filters;
