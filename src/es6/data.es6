/* jshint esversion: 6 */
"strict mode";

import Promise from 'es6-promise';
import str from "../../src/es6/_str.es6";
import obj from "../../src/es6/_obj.es6";
var STR = new str();
var OBJ = new obj();
var user = {
	logged: false
};

class data {
	/**
	 * -------------------------------------------------------------------------
	 * 								GET
	 * -------------------------------------------------------------------------
	 */
	extract_name(json_name) {
		let term;

		if(STR.is_json(json_name)) {
			$.each(JSON.parse(json_name), (lang, name) => {
				if($.isArray(name)) {
					name = name.join(", ");
				}
				term = STR.ucfirst(name);
			});
		} else {
			term = STR.ucfirst(json_name);
		}
		return term;
	}

	get_annotation_tool_sample(callback) {
		// return new Promise((resolve, reject) => {
			/**
			* @see http://www.cropontology.org/api
			*/
			$.ajax({
				type: "GET",
				url: "/common/statics/annotation-tool_sample.txt",
				dataType: "text",
				success: (data) => {
					if(typeof callback == "function") {
						callback(data);
					}
					// resolve(data);
				},
				// error: (jqXHR, textStatus, errorThrown) => {
				// 	reject(errorThrown);
				// }
			});
		// });
	}

	search(string) {
		return new Promise((resolve, reject) => {
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
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_ontology_upload_url() {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/obo-upload-url",
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_attribute_upload_url() {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/attribute-upload-url",
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
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
	get_community_website_feed() {
		return new Promise((resolve, reject) => {
			/**
			 * @see https://developers.google.com/gdata/docs/json
			 */
			let feed = [];
			$.ajax({
				type: "GET",
				url: "https://sites.google.com/feeds/content/cgxchange.org/cropontologycommunity",
				data: {
					alt: "json"
				},
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					let
						/**
						 * Find all images in content: the first one will be the preview
						 * @param  string 				content 				The HTML image tag
						 * @return string|null									The image source
						 */
						get_preview_image = (content) => {
							let $imgs = [];
							if($(content).find("img").attr("src") !== undefined) {
								$imgs.push($(content).find("img").attr("src"));
								if($imgs.length == 1) {
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
						get_preview_video = (content) => {
							if($(content).find("iframe").attr("src") !== undefined) {
								return $(content).find("iframe").attr("width", "100%").attr("height", "100%");
							} else {
								return null;
							}
						}
					;

					$.each(data.feed.entry, (key, entry) => {

						// Clean the response object
						feed.push({
							id: entry.id.$t,
							published: entry.published.$t,
							updated: entry.updated.$t,
							title: entry.title.$t,
							content: entry.content.$t,
							preview: (get_preview_image(entry.content.$t) !== null) ? get_preview_image(entry.content.$t) : get_preview_video(entry.content.$t),
							category: entry.category,
							page: (entry.sites$pageName !== undefined) ? entry.sites$pageName.$t : null,
							feeds: entry.link,
							link: $.map(entry.link, (v, k) => {
								if(v.type == "text/html") {
									return v.href;
								}
							})[0],
							author: $.map(entry.author, (v, k) => {
								return {
									name: STR.ucwords(v.name.$t),
									email: v.email.$t
								}
							})
						});
						if(feed[key].author.length == 1) {
							feed[key].author = feed[key].author[0];
						}
					});
					resolve(feed);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_help_content() {
		return new Promise((resolve, reject) => {
			/**
			 * @see https://developers.google.com/gdata/docs/json
			 */
			let feed = [];
			$.ajax({
				type: "GET",
				url: "https://sites.google.com/feeds/content/cgxchange.org/cropontologycommunity",
				data: {
					path: "/home/help-for-the-crop-ontology",
					alt: "json"
				},
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					let
						/**
						 * Find all images in content: the first one will be the preview
						 * @param  string 				content 				The HTML image tag
						 * @return string|null									The image source
						 */
						get_preview_image = (content) => {
							let $imgs = [];
							if($(content).find("img").attr("src") !== undefined) {
								$imgs.push($(content).find("img").attr("src"));
								if($imgs.length == 1) {
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
						get_preview_video = (content) => {
							if($(content).find("iframe").attr("src") !== undefined) {
								return $(content).find("iframe").attr("width", "100%").attr("height", "100%");
							} else {
								return null;
							}
						}
					;

					$.each(data.feed.entry, (key, entry) => {
						// Clean the response object
						feed.push({
							id: entry.id.$t,
							published: entry.published.$t,
							updated: entry.updated.$t,
							title: entry.title.$t,
							content: entry.content.$t,
							preview: (get_preview_image(entry.content.$t) !== null) ? get_preview_image(entry.content.$t) : get_preview_video(entry.content.$t),
							category: entry.category,
							page: (entry.sites$pageName !== undefined) ? entry.sites$pageName.$t : null,
							feeds: entry.link,
							link: $.map(entry.link, (v, k) => {
								if(v.type == "text/html") {
									return v.href;
								}
							})[0],
							author: $.map(entry.author, (v, k) => {
								return {
									name: STR.ucwords(v.name.$t),
									email: v.email.$t
								}
							})
						});
						if(feed[key].author.length == 1) {
							feed[key].author = feed[key].author[0];
						}
					});
					resolve(feed);
				},
				error: (jqXHR, textStatus, errorThrown) => {
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
	get_ontologies() {
		return new Promise((resolve, reject) => {
			function filter_categories(cat, ontologies) {
			    // if the first word contains a dash - good enough
			    let words = cat.split(" "),
					category = {
						id: words[0],
						name: $.trim(cat.replace(words[0], "")),
						icon: ""
					};

			    if(category.id.includes("-")) {
					switch(category.name) {
						case "General Germplasm Ontology":					category.icon = "picol_ontology";				break;
						case "Phenotype and Trait Ontology":				category.icon = "picol_relevance";				break;
						case "Solanaceae Phenotype Ontology":				category.icon = "picol_path";					break;
						case "Structural and Functional Genomic Ontology":	category.icon = "picol_hierarchy";				break;
						case "Location and Environmental Ontology":			category.icon = "picol_point_of_interest";		break;
						case "Plant Anatomy & Development Ontology":		category.icon = "picol_copy";					break;
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

			let filteredCats = [],
				newCats = {},
				categories = [];

			// this.ask({
			// 	endpoint: "get-ontologies",
			// 	data: {
			// 		alt: "json"
			// 	},
			// 	dataType: "jsonp",
			// 	success: (data) => {
			// 		$.each(data, (key, ontologies) => {
			// 			/**
			// 			 * Filtered categories
			// 			 * @type object
			// 			 */
			// 			var filtered = filter_categories(key, ontologies);
			// 			categories.push(filtered);
			// 		});
			// 		// console.info(categories);
			// 		// categories = OBJ.sort_by_key(categories, ["category", "name"])
			// 		// console.dir(categories);
            //
			// 		resolve(categories);
			// 	},
			// 	error: (jqXHR, textStatus, errorThrown) => {
			// 		reject(errorThrown);
			// 	}
			// });
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
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					$.each(data, (key, ontologies) => {
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
				error: (jqXHR, textStatus, errorThrown) => {
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
	get_latest_ontologies() {
		return new Promise((resolve, reject) => {
			/**
			* @see http://www.cropontology.org/api
			*/
			$.ajax({
				type: "POST",
				url: "http://www.cropontology.org/latest",
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
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
	get_ontologies_data(id) {
		return new Promise((resolve, reject) => {
			/**
			* @see http://www.cropontology.org/api
			*/
			$.ajax({
				type: "GET",
				url: "common/ontologies_data.json",
				dataType: "json",
				success: (data) => {
					if(data[id] !== undefined) {
						resolve(data[id]);
					}
				},
				error: (jqXHR, textStatus, errorThrown) => {
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
	get_ontology(id) {
		return new Promise((resolve, reject) => {
			/**
			 * @see http://www.cropontology.org/api
			 */
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/get-ontology-roots/" + id,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data[0]);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_ontology_attributes(id) {
		return new Promise((resolve, reject) => {
			/**
			 * @see http://www.cropontology.org/api
			 */
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/get-attributes/" + id,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					let d = {};
					$.each(data, (k, v) => {
						d[STR.readable_data(v.key)] = STR.camel_case_2_text(STR.stripslashes(this.extract_name(v.value)));
					});
					resolve(d);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_ontology_comments(id) {
		return new Promise((resolve, reject) => {
			/**
			* @see http://www.cropontology.org/api
			*/
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/get-comments-onto/?ontoId=" + id,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_term_parents(term_id) {
		return new Promise((resolve, reject) => {
			/**
			 * @see http://www.cropontology.org/api
			 */
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/get-term-parents/" + term_id,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_terms_variables(term_id) {
		return new Promise((resolve, reject) => {
			/**
			 * @see http://www.cropontology.org/api
			 */
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/get-variables/" + term_id,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_terms_comments(term_id) {
		return new Promise((resolve, reject) => {
			/**
			 * @see http://www.cropontology.org/api
			 */
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/get-comments?termId=" + term_id,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_children(id) {
		return new Promise((resolve, reject) => {
			/**
			 * @see http://www.cropontology.org/api
			 */
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/get-children/" + id,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
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
	get_login() {
		return new Promise((resolve, reject) => {
			/**
			* @see http://www.cropontology.org/api
			*/
			$.ajax({
				type: "GET",
				url: "http://www.cropontology.org/login",
				data: {
					alt: "json"
				},
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					if(data.username !== undefined && data.username !== "") {
						resolve(data);
					} else {
						resolve(false);
					}
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	get_user_logged() {
		if(!user.logged) {
			// Check if user is logged
			this.get_login().then((login_data) => {
				if(login_data) {
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

	get_user(id) {
		return new Promise((resolve, reject) => {
			/**
			* @see http://www.cropontology.org/api
			*/
			if(!$.isNumeric(id)) {
				// The passed identifier is not a an ID but an username
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/users",
					async: true,
					crossDomain: true,
					dataType: "json",
					success: (users) => {
						$.each(users, (ku, vu) => {
							if(vu.username == id) {
								$.ajax({
									type: "GET",
									url: "http://www.cropontology.org/users/" + vu.userid,
									async: true,
									crossDomain: true,
									dataType: "json",
									success: (data) => {
										// Get Gravatar data
										$.ajax({
											type: "GET",
											url: "https://en.gravatar.com/" + data.gravatar + ".json",
											async: true,
											crossDomain: true,
											dataType: "json",
											success: (gravatar_data) => {
												data.gravatar = gravatar_data.entry[0];
												resolve(data);
											}
										});
									},
									error: (jqXHR, textStatus, errorThrown) => {
										reject(errorThrown);
									}
								});
							}
						});
					},
					error: (jqXHR, textStatus, errorThrown) => {
						reject(errorThrown);
					}
				});
			} else {
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/users/" + id,
					async: true,
					dataType: "json",
					success: (data) => {
						// Get Gravatar data
						$.ajax({
							type: "GET",
							url: "https://en.gravatar.com/" + data.gravatar + ".json",
							async: true,
							dataType: "json",
							success: (gravatar_data) => {
								data.gravatar = gravatar_data.entry[0];
								resolve(data);
							}
						});
					},
					error: (jqXHR, textStatus, errorThrown) => {
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

	log_user(user_data) {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "POST",
				url: "http://www.cropontology.org/login",
				data: user_data,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	register_user(user_data) {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "POST",
				url: "http://www.cropontology.org/register",
				data: user_data,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}

	add_ontology(pars) {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "POST",
				url: "http://www.cropontology.org/add-ontology",
				data: pars,
				async: true,
				crossDomain: true,
				dataType: "json",
				success: (data) => {
					resolve(data);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	}
}
export default data;
