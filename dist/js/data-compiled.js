"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require("es6-promise");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

var _obj = require("../../src/es6/_obj.es6");

var _obj2 = _interopRequireDefault(_obj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STR = new _str2.default();
var OBJ = new _obj2.default();
var user = {
	logged: false
};

var data = function () {
	function data() {
		_classCallCheck(this, data);
	}

	_createClass(data, [{
		key: "extract_name",

		/**
   * -------------------------------------------------------------------------
   * 								GET
   * -------------------------------------------------------------------------
   */
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
	}, {
		key: "search",
		value: function search(string) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/search",
					data: {
						q: string
					},
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
		key: "get_ontology_upload_url",
		value: function get_ontology_upload_url() {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/obo-upload-url",
					async: true,
					dataType: "html",
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
		key: "get_attribute_upload_url",
		value: function get_attribute_upload_url() {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/attribute-upload-url",
					async: true,
					dataType: "html",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
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
			return new _es6Promise2.default(function (resolve, reject) {
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
			return new _es6Promise2.default(function (resolve, reject) {
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
			return new _es6Promise2.default(function (resolve, reject) {
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

		/**
   * Get latest ontologies
   * @NOTE This is an async function
   *
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_latest_ontologies",
		value: function get_latest_ontologies() {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "POST",
					url: "http://www.cropontology.org/latest",
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

		/**
   * Get and parse the Ontology data (for the Ontology card)
   * @NOTE This is an async function
   *
   * @param  string 							id								Tho Ontology ID
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_ontologies_data",
		value: function get_ontologies_data(id) {
			return new _es6Promise2.default(function (resolve, reject) {
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
   * @param  string 							id								Tho Ontology ID
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_ontology",
		value: function get_ontology(id) {
			return new _es6Promise2.default(function (resolve, reject) {
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

			return new _es6Promise2.default(function (resolve, reject) {
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
							d[STR.readable_data(v.key)] = STR.camel_case_2_text(STR.stripslashes(_this.extract_name(v.value)));
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
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-comments-onto/?ontoId=" + id,
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
		key: "get_term_parents",
		value: function get_term_parents(term_id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-term-parents/" + term_id,
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
		key: "get_terms_variables",
		value: function get_terms_variables(term_id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-variables/" + term_id,
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
			return new _es6Promise2.default(function (resolve, reject) {
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
			return new _es6Promise2.default(function (resolve, reject) {
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

		/**
   * Get and parse the Ontology data (for the Ontology card)
   * @NOTE This is an async function
   *
   * @param  string 							id								Tho Ontology ID
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_login",
		value: function get_login() {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/login",
					async: true,
					dataType: "json",
					success: function success(data) {
						if (data.username !== undefined && data.username !== "") {
							resolve(data);
						} else {
							resolve(false);
						}
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_user_logged",
		value: function get_user_logged() {
			if (!user.logged) {
				// Check if user is logged
				this.get_login().then(function (login_data) {
					if (login_data) {
						user = login_data;
						user.logged = true;
					} else {
						user.logged = false;
					}
					return user.logged;
				});
			} else {
				return true;
			}
		}
	}, {
		key: "get_user",
		value: function get_user(id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				if (!$.isNumeric(id)) {
					// The passed identifier is not a an ID but an username
					$.ajax({
						type: "GET",
						url: "http://www.cropontology.org/users",
						async: true,
						dataType: "json",
						success: function success(users) {
							$.each(users, function (ku, vu) {
								if (vu.username == id) {
									$.ajax({
										type: "GET",
										url: "http://www.cropontology.org/users/" + vu.userid,
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
								}
							});
						},
						error: function error(jqXHR, textStatus, errorThrown) {
							reject(errorThrown);
						}
					});
				} else {
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
				}
			});
		}

		/**
  * -------------------------------------------------------------------------
  * 								POST
  * -------------------------------------------------------------------------
  */

	}, {
		key: "log_user",
		value: function log_user(user_data) {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "POST",
					url: "http://www.cropontology.org/login",
					data: user_data,
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
		key: "register_user",
		value: function register_user(user_data) {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "POST",
					url: "http://www.cropontology.org/register",
					data: user_data,
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
		key: "add_ontology",
		value: function add_ontology(pars) {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "POST",
					url: "http://www.cropontology.org/add-ontology",
					data: pars,
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
	}]);

	return data;
}();

exports.default = data;
