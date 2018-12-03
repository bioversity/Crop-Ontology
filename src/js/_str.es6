/* jshint esversion: 6 */
"strict mode";



class str {
	/**
	 * Make a string's first character uppercase
	 * This function is a porting of equivalent PHP ucfirst()
	 * @see http://php.net/manual/en/function.ucfirst.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	ucfirst(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

	/**
	 * Make a string's first character lowercase
	 * This function is a porting of equivalent PHP lcfirst()
	 * @see http://php.net/manual/en/function.lcfirst.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	lcfirst(string) { return string.charAt(0).toLowerCase() + string.slice(1); }

	/**
	 * Uppercase the first character of each word in a string
	 * This function is a porting of equivalent PHP ucwords()
	 * @see http://php.net/manual/en/function.ucwords.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	ucwords(string) { return (string + "").replace(/^(.)|\s+(.)/g, function ($1) { return $1.toUpperCase(); }); }

	extract_text(string) {
		let string_part = $.trim($(string).text()).split(".")[0] + ".";
		return string_part.split("\n")[0];
	}

	addslashes(str) {
	    return str.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\"/g, '\\"').replace(/\0/g, '\\0');
	}

	stripslashes(str) {
	    return str.replace(/\\'/g, '\'').replace(/\\"/g, '"').replace(/\\0/g, '\0').replace(/\\\\/g, '\\');
	}
}
export default str;
