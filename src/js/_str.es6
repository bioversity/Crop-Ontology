/* jshint esversion: 6 */
"strict mode";


var settings = require("../../common/settings/contents.json");

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

	/**
	 * Check wheter a given string is a JSON
	 * @param  string 							string							The string to analyze
	 * @return boolean
	 */
	is_json(string) {
	    try { JSON.parse(string); } catch (e) { return false; }
	    return true;
	}

	/**
	 * 								ONTOLOGIES
	 * -------------------------------------------------------------------------
	 */

	/**
	 * Get all languages in a JSON string
	 * @param  string 							string							The string to analyze
	 * @return array|string														All collected languages
	 */
	get_ontologies_languages(string) {
		let langs = [];
		if(this.is_json(string)) {
			$.each(JSON.parse(string), (lang, name) => {
				langs.push(this.ucfirst(lang));
			});
		} else {
			langs.push("English");
		}
		return (langs.length == 1) ? langs[0] : langs;
	}

	/**
	 * Extract a string from a JSON string
	 * The Crop Onlogy API often provide a JSON language string.
	 * This method extract the string value from that JSON string
	 * @example `{"english": "Text in english"}`
	 *
	 * @param  string 							string							The string to analyze
	 * @param  string 							language						The preferred language
	 * @return string															The extracted string
	 */
	get_ontology_term(string, language) {
		language = (language == undefined) ? settings.general.language : language;

		let strings = {};
		if(this.is_json(string)) {
			$.each(JSON.parse(string), (lang, term) => {
				strings[lang] = this.ucfirst(term);
			});
		} else {
			strings[language] = "?";
		}
		return strings[language];
	}
}
export default str;
