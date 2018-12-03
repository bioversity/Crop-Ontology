/* jshint esversion: 6 */
"strict mode";

import { Promise } from 'es6-promise'
import str from "../../src/js/_str.es6";
var STR = new str();

class data {
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
										"class": "responsive-img"
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
								return $(content).find("iframe").attr("width", "100%");
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
}
export default data;
