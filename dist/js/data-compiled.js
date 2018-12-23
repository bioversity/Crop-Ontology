"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require("es6-promise");

var _str = require("../../src/js/_str.es6");

var _str2 = _interopRequireDefault(_str);

var _obj = require("../../src/js/_obj.es6");

var _obj2 = _interopRequireDefault(_obj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STR = new _str2.default();
var OBJ = new _obj2.default();

var data = function () {
	function data() {
		_classCallCheck(this, data);
	}

	_createClass(data, [{
		key: "extract_name",
		value: function extract_name(json_name) {
			var term = void 0;

			if (STR.is_json(json_name)) {
				$.each(JSON.parse(json_name), function (lang, name) {
					if ($.isArray(name)) {
						name = name.join(", ");
					}
					term = STR.ucfirst(name);
				});
			} else {
				term = STR.ucfirst(json_name);
			}
			return term;
		}

		/**
   * Get and parse the CropOntology Community website feed
   * @NOTE This is an async function
   *
   * @return object															The feed data JSON object
   */

	}, {
		key: "get_community_website_feed",
		value: function get_community_website_feed() {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
     * @see https://developers.google.com/gdata/docs/json
     */
				var feed = [];
				$.ajax({
					type: "GET",
					url: "https://sites.google.com/feeds/content/cgxchange.org/cropontologycommunity",
					data: {
						alt: "json"
					},
					async: true,
					dataType: "json",
					success: function success(data) {
						var
						/**
       * Find all images in content: the first one will be the preview
       * @param  string 				content 				The HTML image tag
       * @return string|null									The image source
       */
						get_preview_image = function get_preview_image(content) {
							var $imgs = [];
							if ($(content).find("img").attr("src") !== undefined) {
								$imgs.push($(content).find("img").attr("src"));
								if ($imgs.length == 1) {
									return $('<img>', {
										"src": $imgs[0],
										"class": ""
									}).prop("outerHTML");
								}
							} else {
								return null;
							}
						},

						/**
       * Find all videos in content: the first one will be the preview
       * @param  string 				content 				The HTML video embed
       * @return string										The image source
       */
						get_preview_video = function get_preview_video(content) {
							if ($(content).find("iframe").attr("src") !== undefined) {
								return $(content).find("iframe").attr("width", "100%").attr("height", "100%");
							} else {
								return null;
							}
						};

						$.each(data.feed.entry, function (key, entry) {

							// Clean the response object
							feed.push({
								id: entry.id.$t,
								published: entry.published.$t,
								updated: entry.updated.$t,
								title: entry.title.$t,
								content: entry.content.$t,
								preview: get_preview_image(entry.content.$t) !== null ? get_preview_image(entry.content.$t) : get_preview_video(entry.content.$t),
								category: entry.category,
								page: entry.sites$pageName !== undefined ? entry.sites$pageName.$t : null,
								feeds: entry.link,
								link: $.map(entry.link, function (v, k) {
									if (v.type == "text/html") {
										return v.href;
									}
								})[0],
								author: $.map(entry.author, function (v, k) {
									return {
										name: STR.ucwords(v.name.$t),
										email: v.email.$t
									};
								})
							});
							if (feed[key].author.length == 1) {
								feed[key].author = feed[key].author[0];
							}
						});
						resolve(feed);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_help_content",
		value: function get_help_content() {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
     * @see https://developers.google.com/gdata/docs/json
     */
				var feed = [];
				$.ajax({
					type: "GET",
					url: "https://sites.google.com/feeds/content/cgxchange.org/cropontologycommunity",
					data: {
						path: "/home/help-for-the-crop-ontology",
						alt: "json"
					},
					async: true,
					dataType: "json",
					success: function success(data) {
						var
						/**
       * Find all images in content: the first one will be the preview
       * @param  string 				content 				The HTML image tag
       * @return string|null									The image source
       */
						get_preview_image = function get_preview_image(content) {
							var $imgs = [];
							if ($(content).find("img").attr("src") !== undefined) {
								$imgs.push($(content).find("img").attr("src"));
								if ($imgs.length == 1) {
									return $('<img>', {
										"src": $imgs[0],
										"class": ""
									}).prop("outerHTML");
								}
							} else {
								return null;
							}
						},

						/**
       * Find all videos in content: the first one will be the preview
       * @param  string 				content 				The HTML video embed
       * @return string										The image source
       */
						get_preview_video = function get_preview_video(content) {
							if ($(content).find("iframe").attr("src") !== undefined) {
								return $(content).find("iframe").attr("width", "100%").attr("height", "100%");
							} else {
								return null;
							}
						};

						$.each(data.feed.entry, function (key, entry) {
							// Clean the response object
							feed.push({
								id: entry.id.$t,
								published: entry.published.$t,
								updated: entry.updated.$t,
								title: entry.title.$t,
								content: entry.content.$t,
								preview: get_preview_image(entry.content.$t) !== null ? get_preview_image(entry.content.$t) : get_preview_video(entry.content.$t),
								category: entry.category,
								page: entry.sites$pageName !== undefined ? entry.sites$pageName.$t : null,
								feeds: entry.link,
								link: $.map(entry.link, function (v, k) {
									if (v.type == "text/html") {
										return v.href;
									}
								})[0],
								author: $.map(entry.author, function (v, k) {
									return {
										name: STR.ucwords(v.name.$t),
										email: v.email.$t
									};
								})
							});
							if (feed[key].author.length == 1) {
								feed[key].author = feed[key].author[0];
							}
						});
						resolve(feed);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get and parse all ontologies from the Crop Ontology website
   * @NOTE This is an async function
   *
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_ontologies",
		value: function get_ontologies() {
			return new _es6Promise.Promise(function (resolve, reject) {
				function filter_categories(cat, ontologies) {
					// if the first word contains a dash - good enough
					var words = cat.split(" "),
					    category = {
						id: words[0],
						name: $.trim(cat.replace(words[0], "")),
						icon: ""
					};

					if (category.id.includes("-")) {
						switch (category.name) {
							case "General Germplasm Ontology":
								category.icon = "picol_ontology";break;
							case "Phenotype and Trait Ontology":
								category.icon = "picol_relevance";break;
							case "Solanaceae Phenotype Ontology":
								category.icon = "picol_path";break;
							case "Structural and Functional Genomic Ontology":
								category.icon = "picol_hierarchy";break;
							case "Location and Environmental Ontology":
								category.icon = "picol_point_of_interest";break;
							case "Plant Anatomy & Development Ontology":
								category.icon = "picol_copy";break;
						}

						// order the categories
						return {
							category: category,
							ontologies: ontologies
						};
					} else {
						return cat;
					}
				}

				var filteredCats = [],
				    newCats = {},
				    categories = [];

				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-ontologies",
					data: {
						alt: "json"
					},
					async: true,
					dataType: "json",
					success: function success(data) {
						$.each(data, function (key, ontologies) {
							/**
        * Filtered categories
        * @type object
        */
							var filtered = filter_categories(key, ontologies);
							categories.push(filtered);
						});
						// console.info(categories);
						// categories = OBJ.sort_by_key(categories, ["category", "name"])
						// console.dir(categories);

						resolve(categories);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_ontologies_data",
		value: function get_ontologies_data(id) {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "common/ontologies_data.json",
					async: true,
					dataType: "json",
					success: function success(data) {
						if (data[id] !== undefined) {
							resolve(data[id]);
						}
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get and parse all ontologies from the Crop Ontology website
   * @NOTE This is an async function
   *
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_ontology",
		value: function get_ontology(id) {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-ontology-roots/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data[0]);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_ontology_attributes",
		value: function get_ontology_attributes(id) {
			var _this = this;

			return new _es6Promise.Promise(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-attributes/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						var d = {};
						$.each(data, function (k, v) {
							v.value = _this.extract_name(v.value);
							d[v.key] = STR.stripslashes(v.value);
						});
						resolve(d);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_ontology_comments",
		value: function get_ontology_comments(id) {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-comments-onto/?ontoId=/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_terms_comments",
		value: function get_terms_comments(term_id) {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-comments?termId=" + term_id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_children",
		value: function get_children(id) {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-children/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_user",
		value: function get_user(id) {
			return new _es6Promise.Promise(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/users/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						// Get Gravatar data
						$.ajax({
							type: "GET",
							url: "https://en.gravatar.com/" + data.gravatar + ".json",
							async: true,
							dataType: "json",
							success: function success(gravatar_data) {
								data.gravatar = gravatar_data.entry[0];
								resolve(data);
							}
						});
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}]);

	return data;
}();

exports.default = data;
