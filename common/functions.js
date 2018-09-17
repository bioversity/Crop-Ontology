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
 * Replace a specific value from a given object
 * @param  array                  array                           The array to clean
 * @param  value                  string                          The value to remove
 * @return array                                                  The cleaned array
 **/
exports.object_key_replace = function(search, replace, object) {
	var new_obj = {};

	if(object.toString().indexOf("{") > 0) {
		object = object.getValue();
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
   delete obj['undefined'];
   log(JSON.stringify(obj));
   return JSON.stringify(obj);
};
