
/**
 * Common functions
 **/
var languages = require("./languages.js"),
	diff_match_patch = require('./diff_match_patch_uncompressed.js').diff_match_patch;

/**
 * Remove a specific value from a given array
 * @param  array							array								The array to clean
 * @param  value							string								The value to remove
 * @return array																The cleaned array
 **/
exports = {
	/**
	 * Replace a specific key from a given object
	 * @param  string						search								The key to search
	 * @param  mixed						replace								The string to replace
	 * @param  value						string								The value to remove
	 * @return array															The cleaned array
	 **/
	object_key_replace: function(search, replace, object) {
		var new_obj = {};

		switch(typeof object) {
			case "string":
				if(object.indexOf("{") > 0) {
					object = object.getValue();
				} else {
					// object = JSON.parse(object);
				}
				break;
			case "undefined":
				object = '{"undefined": ""}';
				break;
			case "object":
				if(object == null) {
					object = '{"undefined": ""}';
				} else {
					object = JSON.stringify(object);
					if(object.indexOf("{") == -1) {
						object = '"' + object + '"';
					}
				}
				break;
			default:
				break;
		}
		if(typeof object !== "string") {
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
		} else {
			obj = object.replace(/\{.*?\:\"(.*?)\"\}/g, "$1").replace(/[\\]+/g, "");
		}
		return (typeof obj == "object") ? JSON.stringify(obj) : obj;
	},

	/**
	 * Calculate the difference between two strings
	 * @param  string						text1								The first string to compare
	 * @param  string						text2								The second string to compare
	 * @return object|bool														If there's difference return an object with statistics and differences, otherwise return false
	 */
	load_diff: function(text1, text2) {
		var dmp = new diff_match_patch(),
			diff = dmp.diff_main(text1, text2),
			patch = dmp.patch_make(text1, text2, diff),
			results = dmp.patch_apply(patch, text1),
			diff_obj = {};

		if(patch.length) {
			diff_obj.has_diff = true;
			diff_obj.stats = {
				total: {
					count: 0,
					additions: 0,
					removal: 0
				},
				detailed: []
			};
			diff_obj.diff = patch;
			for (var j in patch) {
				diff_obj.stats.detailed[j] = {
					total: 0,
					additions: 0,
					removal: 0
				};
				for(var i = 0; i < patch[j].diffs.length; i++) {
					// log(patch[j].diffs[i][0])
					if(patch[j].diffs[i][0] == -1 || patch[j].diffs[i][0] == 1) {
						diff_obj.stats.detailed[j].total++;
						diff_obj.stats.total.count++;
					}
					if(patch[j].diffs[i][0] == 1) {
						diff_obj.stats.detailed[j].removal++;
						diff_obj.stats.total.removal++;
					}
					if(patch[j].diffs[i][0] == -1) {
						diff_obj.stats.detailed[j].additions++;
						diff_obj.stats.total.additions++;
					}
				}
			}
		}
		return patch.length ? diff_obj: false;
	},

	renderIndex: function(htmlFile, data) {
		if(!data) data = {};
		var partials = {
			CONTENT: render(htmlFile),
			VERSION: VERSION,
			languages: JSON.stringify(languages.all)
		};
		var html = Mustache.to_html(render("skins/index.html"), data, partials);
		return html;
	},

	isblank: function(javaStr) {
		if(javaStr == null || javaStr.equals("")) {
			return true;
		}
		return false;
	},

	print: function(response) {
		response.setCharacterEncoding("UTF-8");
		return {
			// callback is a Java string that contains the name
			// of the callback, so we can run JSONP if it exists
			json: function(j, callback) {
				if(response == null) return;
				var jsonString = JSON.stringify(j, null, 2);

				if(!Common.isblank(callback)) { // JSONP
					jsonString = "" + callback + "(" + jsonString + ");";
				}

				response.setContentType("application/json");
				response.getWriter().println(jsonString);
				return jsonString;
			},
			text: function(text) {
				if(response == null) return;
				response.getWriter().println(text);
			},
			textPlain: function(text) {
				if(response == null) return;
				response.setContentType("text/plain");
				response.getWriter().println(text);
			},
			html: function(html) {
				if(response == null) return;
				response.setContentType("text/html");
				response.getWriter().println(html);
			},
			rss: function(title, arr) {
				if(response == null) return;
				response.getWriter().println(rss(title, arr));
			}
		};
	},

	translate: function(jsonStr, isoLang) {
		var isoLang = isoLang;
		if(!isoLang) isoLang = 'EN';
		try {
			var obj = JSON.parse(jsonStr);
			var lang = languages.iso[isoLang];
			if(obj[lang]) {
				return obj[lang];
			} else if (obj['undefined']){
				return obj['undefined'];
			} else {
				return jsonStr;
			}
		} catch(e) {
			return jsonStr;
		}

		return jsonStr;
	},

	error: function(response, msg) {
		response.sendError(response.SC_BAD_REQUEST, msg);
	},

	defaultRelationship: function(relationship) {
		if(!relationship) relationship = 'is_a';
		// relationship could be an array
		if(relationship && (relationship instanceof java.util.List)) {
			relationship = relationship.get(0);
		}

		/*
		if(relationship.length)
		relationship = relationship[0];
		*/

		if(relationship instanceof Text) {
			relationship = relationship.getValue();
		}

		if(!(relationship instanceof java.lang.String)) {
			relationship = new java.lang.String(relationship);
		}

		if(!relationship || relationship.equals("")) {
			relationship = "is_a";
		} else {
			relationship = ""+relationship.trim().split(" ")[0];
		}
		return relationship;
	},

	defaultParent: function(parent) {
		if(!parent) parent = 0;
		if(parent === 'null') parent = 0;
		if(typeof parent === 'string') {
			return parent;
		}

		if(parent.length) {
			parent = parent[0];
		}

		return parent;
	},

	pad: function(number, length) {
		var str = '' + number;
		while (str.length < length) {
				str = '0' + str;
		}
		return str;
	}
};
