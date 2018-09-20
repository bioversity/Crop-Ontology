/**
 * Common functions
 **/
var languages = require("./languages.js");

/**
 * Remove a specific value from a given array
 * @param  array                  array                           The array to clean
 * @param  value                  string                          The value to remove
 * @return array                                                  The cleaned array
 **/
exports.array_clean = function(array, value) {
	return jQuery.grep(array, function(val) {
		return val != value;
	});
};

/**
 * Replace a specific key from a given object
 * @param  string                 search                          The key to search
 * @param  mixed                  replace                         The string to replace
 * @param  value                  string                          The value to remove
 * @return array                                                  The cleaned array
 **/
exports.object_key_replace = function(search, replace, object) {
	var new_obj = {};

	switch(typeof object) {
		case "string":
			if(object.indexOf("{") > 0) {
				object = object.getValue();
			}
			break;
		case "undefined":
			object = '{"undefined": ""}';
			break;
		case "object":
			if(object == null) {
				object = '{"undefined": ""}';
			} else {
				if(object.indexOf("{") == -1) {
					object = '"' + object + '"';
				}
			}
			break;
	}

	var obj = JSON.parse(object);
	for(var k in obj) {
		if(k == "undefined") {
			switch(replace) {
				case null:	obj = obj['undefined'];							break;
				case "":	obj[languages.default] = obj['undefined'];		break;
			}
		}
	}
	if(obj["undefined"] !== "undefined" && obj["undefined"] !== undefined) {
		delete obj["undefined"];
	}
	return (typeof obj == "object") ? JSON.stringify(obj) : obj;
};
