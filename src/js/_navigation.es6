/* jshint esversion: 6 */
"strict mode";


class navigation {
	/**
	 * Get the current page from the address bar
	 * @return string															The current page
	 */
	get_page() {
		let page = window.location.pathname.split("/").splice(1)[0];
		return (page == "") ? "home" : page;
	}

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
}

export default navigation;
