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
}

export default navigation;
