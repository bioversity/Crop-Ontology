/* jshint esversion: 6 */
"strict mode";



class str {
	/**
	 * Make a string's first character uppercase
	 * This function is very similar to PHP ucfirst()
	 * @see http://php.net/manual/en/function.ucfirst.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	ucfirst(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

	/**
	 * Make a string's first character lowercase
	 * This function is very similar to PHP lcfirst()
	 * @see http://php.net/manual/en/function.lcfirst.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	lcfirst(string) { return string.charAt(0).toLowerCase() + string.slice(1); }

	/**
	 * Uppercase the first character of each word in a string
	 * This function is very similar to PHP ucwords()
	 * @see http://php.net/manual/en/function.ucwords.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	ucwords(string) { return (string + "").replace(/^(.)|\s+(.)/g, function ($1) { return $1.toUpperCase(); }); }

	/**
	 * Quote string with slashes
	 * This function is very similar to PHP addslashes()
	 * @see http://php.net/manual/en/function.addslashes.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	addslashes(str) {
	    return str.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\"/g, '\\"').replace(/\0/g, '\\0');
	}

	/**
	 * Un-quotes a quoted string
	 * This function is very similar to PHP stripslashes()
	 * @see http://php.net/manual/en/function.stripslashes.php
	 *
	 * @param  string 							string							The input string
	 * @return string															The converted string
	 */
	stripslashes(str) {
	    return str.replace(/\\'/g, '\'').replace(/\\"/g, '"').replace(/\\0/g, '\0').replace(/\\\\/g, '\\');
	}

	/**
	 * Split a multiline string by a given separator, then get the first line
	 * NOTE: If not provided the separator is a comma ","
	 * @param  string 							string							The string to split
	 * @param  string 							split_by						The separator to split
	 * @return string															The extracted string
	 */
	extract_text(string, split_by) {
		if(split_by == undefined) {
			split_by = ",";
		}
		let string_part = $.trim($(string).text()).split(split_by)[0] + ".";
		return string_part.split("\n")[0];
	}

	/**
	 * Pluralize a string
	 * @param  integer 							items							The amount of items
	 * @param  string 							string							The string to pluralize
	 * @return The pluralized string
	 */
	pluralize(items, string) {
		return (items !== 1) ? string + "s" : string;
	}

	is_json(str) {
	    try { JSON.parse(str); } catch (e) {
	        return false;
	    }
	    return true;
	}
}
export default str;
