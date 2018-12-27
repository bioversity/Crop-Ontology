/* jshint esversion: 6 */
"strict mode";

class modals {
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
			class: "",
			title: "Modal Header",
			subtitle: "",
			content: "Modal Content",
			display_buttons: true,
			ok_button: "Ok",
			cancel_button: "Cancel",
			fixed_footer: true,
			bottom_sheet: false,
			width: "55%"
		},
		settings = $.extend( {}, defaults, options );

		$("body").prepend(
			$('<div>', {
				"id": settings.id,
				"class": "modal " + settings.class + " " + ((settings.fixed_footer) ? " modal-fixed-footer" : "") + ((settings.bottom_sheet) ? " bottom-sheet" : ""),
				"style": (settings.width) ? "width: " + settings.width : ""
			}).append(
				$('<div>', {"class": "modal-content"}).append(
					$('<h4>').text(settings.title)
				).append(() => {
					if(settings.subtitle) {
						return $('<h5>').text(settings.subtitle);
					}
				}).append(settings.content)
			).append(() => {
				if(settings.display_buttons) {
					return $('<div>', {"class": "modal-footer"}).append(
						$('<a>', {"href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat left"}).text(settings.cancel_button)
					).append(
						$('<a>', {"href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat right"}).text(settings.ok_button)
					)
				}
			})
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

	user_modal(title) {
		let $user_modal_content = $('<div>', {"class": "container"}).append(
    		$('<form>', {class: "col s12"}).append(
				$('<div>', {"class": "row"}).append(
					$('<div>', {"class": "input-field col s10 offset-s1"}).append(
						$('<input>', {
							"type": "text",
							"name": "username",
							"id": "log_username"
						})
					).append(
						$('<label>', {"for": "log_username"}).text("Username")
					)
			// 	)
			).append(
			// 	$('<div>', {"class": "row"}).append(
					$('<div>', {"class": "input-field col s10 offset-s1"}).append(
						$('<input>', {
							"type": "password",
							"name": "Password",
							"id": "log_password"
						})
					).append(
						$('<label>', {"for": "log_password"}).text("Password")
					)
				)
			).append(
				$('<div>', {"class": "row"}).append(
					$('<div>', {"class": "col s10 offset-s1"}).append(
						$('<a>', {"href": "./forgot-password"}).text("Forgot Password?")
					)
				)
			)
		);

		this.build_modal({
			id: "user_modal",
			width: "35%",
			title: title,
			content: $user_modal_content,
			fixed_footer: false,
			bottom_sheet: false
		});
	}

	download_ontology_modal(id, title) {
		let $download_ontology_modal = $('<div>', {"class": "container"}).append(
    		$('<div>', {class: "row"}).append(
				$('<div>', {"class": "col s4 m4 l4 xl4"}).append(
					$('<a>', {"target": "_blank", "href": "https://www.cropontology.org/report?ontology_id=" + id, "class": "center dowload-item", "download": id + ".csv"}).append(
						$('<h4>').append(
							$('<span>', {"class": "picol_document_text"})
						)
					).append(
						$('<h6>').text("Trait dictionary")
					)
				)
			).append(
				$('<div>', {"class": "col s4 m4 l4 xl4"}).append(
					$('<a>', {"target": "_blank", "href": "https://www.cropontology.org/ontology/" + id + "/" + title + "/nt", "class": "center dowload-item", "download": id + ".nt"}).append(
						$('<h4>').append(
							$('<span>', {"class": "picol_rdf_document"})
						)
					).append(
						$('<h6>').text("RDF N-Triples")
					)
				)
			).append(
				$('<div>', {"class": "col s4 m4 l4 xl4"}).append(
					$('<a>', {"target": "_blank", "href": "https://www.cropontology.org/obo/" + id, "class": "center dowload-item", "download": id + ".obo"}).append(
						$('<h4>').append(
							$('<span>', {"class": "picol_owl_lite_document"})
						)
					).append(
						$('<h6>').text("OBO File")
					)
				)
			)
		);

		this.build_modal({
			id: "download_ontology_modal",
			width: "35%",
			class: "centered",
			title: "Download ontology",
			subtitle: id + ":" + title,
			content: $download_ontology_modal,
			fixed_footer: false,
			bottom_sheet: false,
			display_buttons: false
		});
	}
}

export default modals;
