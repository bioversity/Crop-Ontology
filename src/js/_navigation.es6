/* jshint esversion: 6 */
"strict mode";


class navigation {
	/**
	* Get the path of the current URL
	* @return array															The page path
	*/
	get_url_path() {
		let url = window.location.pathname.split(/(?:\/|\:)+/).splice(1),
			path = [];

		$.each(url, (k, v) => {
			path.push(decodeURIComponent(v));
		})
		return path;
	}

	/**
	 * Get the current page from the current URL
	 * @uses get_url_path()
	 *
	 * @return string															The current page
	 */
	get_page() {
		let page = this.get_url_path()[0];
		return (page == "") ? "home" : page;
	}

	/**
	 * ONTOLOGY
	 * -------------------------------------------------------------------------
	 */

	/**
	 * The ontology url performed by regex
	 * @see https://regex101.com/r/S4gNgj/4
	 */
	get_ontology_url_regex(separator) {
		let id = "([\\w]+\\_[\\w\\d]+)",
			label = "(.*)";
		return new RegExp(id + "\\" + separator + label, "g");
	}

	/**
	 * The ontology url performed by regex
	 * @see https://regex101.com/r/S4gNgj/5
	 */
	get_terms_url_regex(separator) {
		let id = "([\\w]+\\_[\\w\\d]+)",
			label = "(.*)";
		return new RegExp(id + "\\" + separator + label + separator + label, "g");
	}

	/**
	 * Get the Ontology ID from the current URL
	 * @uses get_url_path()
	 *
	 * @return string															The current page
	 */
	get_ontology_id() {
		return this.get_url_path()[1];
	}

	/**
	 * Get the Ontology Term ID from the current URL
	 * @uses get_url_path()
	 *
	 * @return string															The current page
	 */
	get_term_id() {
		console.warn(this.get_url_path());
		return this.get_url_path()[2];
	}

	/**
	 * Get the Ontology label from the current URL
	 * @uses get_url_path()
	 *
	 * @return string															The current page
	 */
	get_ontology_label() {
		return this.get_url_path()[2];
	}

	/**
	 * Get the Ontology Term label from the current URL
	 * @uses get_url_path()
	 *
	 * @return string															The current page
	 */
	get_term_label() {
		return this.get_url_path()[3];
	}
}

export default navigation;
