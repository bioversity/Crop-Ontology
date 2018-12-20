/* jshint esversion: 6 */
"strict mode";


class navigation {
	/**
	* Get the path of the current page
	* @return array															The page path
	*/
	get_url_path() {
		let url = window.location.pathname.split("/").splice(1),
			path = [];
		$.each(url, (k, v) => {
			path.push(decodeURIComponent(v));
		})
		return path;
	}

	/**
	 * Get the current page from the address bar
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
	 * @see https://regex101.com/r/S4gNgj/2
	 */
	get_ontology_url_regex(separator) {
		let id = "([\\w]{2}\\_[\\d]{3})",
			label = "(.*)";
		return new RegExp(id + "\\" + separator + label, "g");
	}

	/**
	 * Get the current page from the address bar
	 * @uses get_url_path()
	 *
	 * @return string															The current page
	 */
	get_ontology_id() {
		let path = this.get_url_path();
		if(path[0] == "ontology") {
			return path[1].replace(this.get_ontology_url_regex(":"), "$1");
		}
	}

	/**
	 * Get the current page from the address bar
	 * @uses get_url_path()
	 *
	 * @return string															The current page
	 */
	get_ontology_label() {
		let path = this.get_url_path();
		if(path[0] == "ontology") {
			console.log(path[2]);
			if(path[2] !== undefined) {
				return path[2];
			} else {
				return path[1].replace(this.get_ontology_url_regex(":"), "$2");
			}
		}
	}
}

export default navigation;
