"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/es6/data.es6");

var _data2 = _interopRequireDefault(_data);

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

var _pagination = require("../../src/es6/pagination.es6");

var _pagination2 = _interopRequireDefault(_pagination);

var _treeview = require("../../src/es6/_treeview.es6");

var _treeview2 = _interopRequireDefault(_treeview);

var _filters = require("../../src/es6/filters.es6");

var _filters2 = _interopRequireDefault(_filters);

var _modals = require("../../src/es6/modals.es6");

var _modals2 = _interopRequireDefault(_modals);

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

var _loader = require("../../src/es6/loader.es6");

var _loader2 = _interopRequireDefault(_loader);

var _annotation_tool = require("../../src/es6/pages/annotation_tool.es6");

var _annotation_tool2 = _interopRequireDefault(_annotation_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Static pages
 */
var page_about = "<p>The Crop Ontology project is the creation of the Generation Challenge Programme (GCP, <a href=\"http://www.generationcp.org/\">http://www.generationcp.org/</a> ), which understood from its inception the importance of controlled vocabularies and ontologies for the digital annotation of data.  In ontologies, terms bear a particular, logically defined relationship to each other, allowing computational reasoning on data annotated with a structured vocabulary. The volume of agriculture-related information and terminology related to phenotype, breeding, germplasm, pedigree, traits, among others, is increasing exponentially. In order to facilitate access to the data held within and/or across the databases, GCP initiated the development of Trait Dictionaries for breeders' fieldbooks and a Crop Ontology (CO) to facilitate the harmonization of the data capture and powerful manipulations of the data through ontology-driven queries. This is a development that raised interest in CGIAR Centres and other communities, like the Gramene team developing the Plant Trait Ontology, ecologists and semantic web developers holding vast quantities of agriculture-related data. The project will continue the incremental validation and refinement of the Crop Ontology, which involves adding methods of trait measurement and experiments to enable the mapping of ontology terms onto measured, stored or published variables.The Crop Ontology is a key element of the Integrated Breeding Platform <a href=\"https://www.integratedbreeding.net/\">https://www.integratedbreeding.net/</a></p>\n<a href=\"http://www.generationcp.org/\" ><img src=\"common/media/img/gcp-logo.png?{{>VERSION}}\" /></a>\n\n<h2>About the Crop Ontology</h2>\n\n<p>The Crop Ontology (CO) current objective is to compile validated concepts along with their inter-relationships on anatomy, structure and phenotype of Crops, on trait measurement and methods as well as on Germplasm with the multi-crop passport terms. The concepts of the CO are being used to curate agronomic databases and describe the data. The use of ontology terms to describe agronomic phenotypes and the accurate mapping of these descriptions into databases is important in comparative phenotypic and genotypic studies across species and gene-discovery experiments as it provides harmonized description of the data and therefore facilitates the retrieval of information.  Development of crop-specific trait ontologies and the germplasm ontologies began in 2008 for chickpea, maize, <em>Musa</em>, potato, rice and wheat, and in 2010 for cassava. The GCP Crop Ontology is a global public good, available to be used freely by all. </p>\n\n<h2>About the tool</h2>\n\n<p>This curation and annotation web site is a participatory tool that enables you to browse the Crop Ontology, search for specific terms and access the definition, as well as additional information. It is possible to post a suggestion at the level of a term and provide feedback on your experience using the site. Please, consult the video tutorials to get a visual explanation of the web site use.</p>\n\n<p>The Ontology curators are able to upload a full ontology in OBO format, create it online, add attribute information, and submit or delete terms from the Crop Ontology. Researchers can also submit/deposit trait names using the curation/annotation tool &lsquo;add an ontology&rsquo; to increment the tool&rsquo;s capacity. </p>\n\n<p>All lists can be downloaded and a web service API is available. The site is hosted on <a href=\"http://code.google.com/appengine\">Google App Engine</a> and the versioned code is hosted on <a href=\"https://github.com/bioversity/Crop-Ontology\">GitHub</a>.</p>\n\n<p>The tool is still under development, so your feedback will help to improve it. Please provide any comments or suggestions using the &lsquo;Feedback&rsquo; button.</p>\n\n<p>This work was greatly inspired by the Crop Ontology Look-up service developed by Martin Senger, consultant in Bioinformatics, and by Terminizer, online annotation tool developed by David Hancock, from the University of Manchester. </p>\n\n<p>Citation:\n&ldquo;Crop Ontology curation and annotation tool &ndash; 2011 Generation Challenge Programme, Bioversity International as project implementing agency.&rdquo;</p>\n<!--\n<h2>Project partners in 2012</h2>\n\n<p>This work is primarily coordinated and undertaken by the lead institution, Bioversity International (hereafter referred to as Bioversity), and coordinated by Elizabeth Arnaud. Rosemary Shrestha (CIMMYT, Mexico) coordinates the CO community and its implementation in crop-specific databases.</p>\n\n<p>\nPrincipal Investigator &ndash; Elizabeth Arnaud (Bioversity International)\n</p>\n\n<p>\nCurators of the Crop-specific Ontology in 2012\n</p>\n\n<ul>\n<li>Barley - Flavio Capettini (ICARDA)</li>\n<li>Cassava - Bakare Moshood Agba  (IITA) </li>\n<li>Common Beans - Fabio Alberto Gerrera (CIAT)</li>\n<li>Chikpea and Groundnut, Sorghum and pigeon pea - Prasad Peteti, Praveen Reddy, Suyash Pati (ICRISAT)</li>\n<li>Cowpea - Sam Ofodile , Ousmane Boukare (IITA)</li>\n<li>Rice - Nikki Frances Borja (IRRI)</li>\n<li>Potato - Reinhard Simon (CIP)</li>\n<li>Maize and Wheat - Rosemary Shrestha (CIMMYT) - Global Ontology Coordinator until 2011/li>\n</ul>\n\n<p>\nScientists coordinating or actively contributing to the development of crop specific Trait Dictionaries and ontologies:\n</p>\n<ul>\n<li>Bioversity - Inge van den Bergh</li>\n<li>CIRAD - Jean FRancois Rami</li>\n<li>ICARDA - Sanjaya Gyawali,</li> Adnan al-Yassin, Mohamad Maatougui, S. Rajaram., Ahmed Amri, Fawzy Nawar</li>\n<li>ICRISAT - Trushar Shah, Eva Wietzel, Tom Hash</li>\n<li>IITA - Ousmane Boukare, Peter Kulakow, Antonio Lopes Montez </li>\n<li>CIAT - Steve Beebe, Rowland Chirwa</li>\n<li>IRRI- Mauleon Ramil, Ruaraidh Sackville Hamilton</li>\n\n<li>and the Crop Communities of Practice </li>\n</ul>\n\n<p><strong>Acknowledgements to</strong>: Adriana Alercia, (Bioversity International, Crop descriptors specialist), Richard Bruskiewich (GCP Bioinformatics, former project Principle Investigator, IRRI), Guy Davenport (GCP bioinformatics, CIMMYT), Graham McLaren (GCP sub-programme on Crop information system, Leader), Martin SENGER (GCP Bioinformatics, formerly IRRI)</p>\n-->\n<h3>Articles</h3>\n<p>2012 - Shrestha Rosemary, Matteis Luca, Skofic Milko, Portugal Arlett, McLaren Graham, Hyman Glenn, Arnaud Elizabeth    - Bridging the phenotypic and genetic data useful for integrated breeding through a data annotation using the Crop Ontology developed by the crop communities of practice , in Frontiers in Physiology , vol.3, no.0326 <a href=\"http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326\"> URL=http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326</a></p>\n<p>2012 - Elizabeth Arnaud, Laurel Cooper, Rosemary Shrestha, Naama Menda, Rex T. Nelson, Luca Matteis, Milko Skofic, Ruth Bastow, Pankaj Jaiswal, Lukas Mueller, Graham McLaren:  Towards a Reference Plant Trait Ontology For Modeling Knowledge of Plant Traits and Phenotypes in: proceedings of the 4th Conference on Knowledge Engineering and Ontology Development, 4-7 October 2012 , Spain.</p>\n<p>2010 - Rosemary Shrestha, Elizabeth Arnaud, Ramil Mauleon, Martin Senger, Guy F. Davenport, David Hancock, Norman Morrison, Richard Bruskiewich, and Graham McLaren - <strong>Multifunctional crop trait ontology for breeders' data: field book, annotation, data discovery and semantic enrichment of the literature</strong>, AoB PLANTS (2010) Vol. 2010 first published online May 27, 2010 doi:10.1093/aobpla/plq008  - <a href=\"http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008\">http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008</a></p>\n\n<h3>Book chapter</h3>\n<p>2011 - Shrestha Rosemary, Guy F Davenport, Richard Bruskiewich and Elizabeth Arnaud in : Monneveux Philippe and Ribaut Jean-Marcel, eds (2011). Drought phenotyping in crops: from theory to practice CGIAR Generation Challenge Programme, Texcoco, Mexico. ISBN: 978-970-648-178-8. 475pp. Chapter is: Development of crop ontology for sharing crop phenotypic information .</p>\n\n<h2>Posters</h2>\n\n<style>\n.posters a img {\n  border: 1px solid #ddd;\n  vertical-align: top;\n  margin-right: 20px;\n}\n</style>\n\n<p class=\"posters\">\n  <a href=\"common/media/pdf/GRM_poster_Curation_annotation_tools.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/GRM_poster_Curation_annotation_tools.png\" /></a>\n  <a href=\"common/media/pdf/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.png\" /></a>\n  <a href=\"common/media/pdf/Poster_GCP_GRM_Musa.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/Poster_GCP_GRM_Musa.png\" /></a>\n  <a href=\"common/media/pdf/biocuration2012-poster.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/biocuration_thumb.png\" /></a>\n</p>\n";
var page_privacy_policy = "\n\n<h2>Photo credit</h2>\n<ul>\n    <li>Neil Palmer, CIAT via Flickr (<a href=\"https://www.flickr.com/photos/CIAT/albums\">https://www.flickr.com/photos/CIAT/albums</a>)</li>\n    <li>Bioversity International via Flickr (<a href=\"https://www.flickr.com/photos/bioversity/albums\">https://www.flickr.com/photos/bioversity/albums</a>)</li>\n    <li>Freepik (<a href=\"https://www.freepik.com/free-photo/golden-color-wheat-ear-in-front-of-white-wooden-wall_2741083.htm#term=wheat&page=1&position=41\">https://www.freepik.com/free-photo/golden-color-wheat-ear-in-front-of-white-wooden-wall_2741083.htm#term=wheat&page=1&position=41</a>)</li>\n</ul>\n";
var page_api = "<style>\nli {\n    margin-left: 15px;\n    list-style: none;\n}\n.api_left h2 {\n    margin-top: 30px !important;\n    padding-top: 30px !important;\n    color: #f28021 !important;\n}\n</style>\n<script>\n\n$(function(){\n\n    // replaces API urls for examples\n    $(\".example\").each(function() {\n        var $this = $(this);\n\n        var url = $this.parent().siblings().first().find(\"code\").text();\n\n        var parameters = url.match(/{(.*?)}/g);\n\n        if(parameters) {\n            for(var i=0; i<parameters.length; i++) {\n                var par = parameters[i];\n                var clean = par.substring(1, par.length-1);\n                url = url.replace(par, $this.attr(clean));\n            }\n        }\n\n        $this.html(\"<a href='\"+url+\"' target='_blank'>\"+url+\"</a>\");\n\n    });\n\n});\n\n</script>\n\n<div class=\"api_left\">\n\n<p>\nThis is the official API for the Ontology Curation Tool. It allows you to programmatically retrieve and interact with Ontology data.\n</p>\n<p>\nTo let us gather feedback you can leave a comment using the form on the right.\n</p>\n<h2>Statistics on collected ontologies</h2>\n<li><strong>URL:</strong> <a target=\"_blank\" href=\"http://www.cropontology.org/ontos_stats\">http://www.cropontology.org/ontos_stats</a></li>\n<li><strong>Returns:</strong> JSON object with statistics about collected ontologies</li>\n\n<h2>API Data Types</h2>\n<p>\nData can be requested in JSON.<br> API calls follow the <a href=\"http://en.wikipedia.org/wiki/Create,_read,_update_and_delete\">CRUD</a> semantics: create, retrieve, update and delete.\n</p>\n\n<!--\n<h2>Retrieve all traits given an Ontology Name</h2>\n<ul>\n    <li>Here's a little code snippet written in <b>PHP</b> to show you how you can leverage this API to retrieve all the traits of a specific Ontology: <a href=\"https://gist.github.com/1322511\">https://gist.github.com/1322511</a></li>\n</ul>\n-->\n<h2>JSON DUMP</h2>\n<ul>\n    <li><strong>URL:</strong> <a target=\"_blank\" href=\"https://github.com/bioversity/Crop-Ontology/blob/master/public/dump.json\">https://github.com/bioversity/Crop-Ontology/blob/master/public/dump.json</a></li>\n    <li><strong>Returns:</strong> JSON array of *raw* objects inside database</li>\n</ul>\n\n<h2>Search Terms</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/search?q={query}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects matching the search query - each object being a term</li>\n    <li><strong>Example:</strong> <span class=\"example\" query=\"stem rust\"></span></li>\n</ul>\n\n<h2>Retrieve all Ontologies</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontologies</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> JSON Hierarchy of the Ontologies under each category</li>\n    <li><strong>Example:</strong> <span class=\"example\"></span></li>\n</ul>\n<h2>Retrieve a specific Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology/{ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n\t<li><strong>Returns:</strong> JSON representation of the ontology. </br><span style=\"font-style:italic;\">NB: This call does not retrieve the variables that are present in TD template v5 (and in the OBO files derived from the TDv5)</span></li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_334\"></span></li>\n</ul>\n<h2>Retrieve Ontology ID by its Name</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology-id?ontology_name={ontology_name}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> ID of the ontology, to be used with <code>/get-ontology-roots/{id}</code></li>\n    <li><strong>Example:</strong> <span class=\"example\" ontology_name=\"cassava\"></span></li>\n</ul>\n\n<h2>Retrieve Categories</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-categories</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of strings - string being the name of the category that you pass to the <code>/ontologies</code> API call</li>\n    <li><strong>Example:</strong> <span class=\"example\"></span></li>\n</ul>\n\n<h2>Retrieve Ontologies By Category</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/ontologies?category={category}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects; each one representing an ontology</li>\n    <li><strong>Example:</strong> <span class=\"example\" category=\"010-089 General Germplasm Ontology\"></span></li>\n</ul>\n\n<a name=\"rdf\"></a>\n<h2>Retrieve Terms in RDF</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/rdf/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> XML related RDF</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve Root Terms of an Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology-roots/{ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects; each one representing a term</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_020\"></span></li>\n</ul>\n\n<h2>Retrieve Child Terms of parent Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-children/{parentId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of terms</li>\n    <li><strong>Example:</strong> <span class=\"example\" parentId=\"CO_020:0000000\"></span></li>\n</ul>\n<h2>Retrieve Parents of Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-term-parents/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of the paths from the parent to child</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_020:0000000\"></span></li>\n</ul>\n\n<h2>Retrieve Properties/Attributes of a Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-attributes/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects representing the terms property</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve Comments of a Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-comments?termId={termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects representing a comment</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Login - Retrieve a user's auth token (used for adding and editing ontologies)</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/login</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {username}, {password}</li>\n    <li><strong>Returns:</strong> HTTP response with a <code>user</code> cookie in the header that contains a <code>token</code>. You'll need to pass this cookie to subsequent requests that require authentication</li>\n</ul>\n\n<h2>Retrieve Logged-in User information</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/login</code></li>\n    <li><strong>Method:</strong> <code>GET</code>. Pass <code>user</code> cookie in request</li>\n    <li><strong>Returns:</strong> Object of the currently logged in user</li>\n</ul>\n\n<h2>Create Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/add-ontology</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. Pass <code>user</code> cookie in request. {json} a JSON string representing a list of objects; each object being a term. {ontology_name}, {ontology_id}, {ontology_summary}</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n\n<!--\n<h2>Create Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/create-term</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {jsonTerm} a JSON representation of the term. You can call this method as many times as you need to build the structure of an ontology. Example: <code>{\"ontology_id: \"CO_22\", \"ontology_name\": \"Sorghum Trait\", \"parent\": \"CO_222:1122\" ...}</code>. As you can see the <strong>parent</strong> property describes the relationship between terms. If parent is <i>null</i> then the term is a ROOT term</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n-->\n\n<h2>Delete Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/delete-ontology</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {ontologyID}</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n\n<h2>Retrieve IB Fieldbook Default List</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/default-list/?ontologyId={ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> JSON of the default list of traits, methods and scales of an ontology ID</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_334\"></span></li>\n</ul>\n\n<h2>Retrieve Term Information</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-term/?id={termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Object representing a term information. Can be used to update the information of a given term when it is updated</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve all Comments from an Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-comments-onto/?ontoId={ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> a JSON object that lists the comments and the details about the comments' authors. Comments are grouped by terms</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_321\"></span></li>\n</ul>\n\n</div><!-- /api_left -->\n<div class=\"api_right\" style=\"margin-top:40px\">\n    <div id=\"disqus_thread\"></div>\n    <script type=\"text/javascript\">\n        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n        var disqus_shortname = 'cropontologycurationtool'; // required: replace example with your forum shortname\n\n        // The following are highly recommended additional parameters. Remove the slashes in front to use.\n        // var disqus_identifier = 'unique_dynamic_id_1234';\n        // var disqus_url = 'http://example.com/permalink-to-page.html';\n\n        /* * * DON'T EDIT BELOW THIS LINE * * */\n        (function() {\n            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n            dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';\n            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n        })();\n    </script>\n    <noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>\n</div><!-- //api_right -->\n";
var page_help = "\n<h2>Video Tutorials</h2>\n<style type=\"text/css\"> \n    \n \n    \n \n#ytvideo,\n#ytvideo2 {\n    float: left;\n    margin-right:10px;\n}\n \n \n.yt_holder {\n    background: #f3f3f3;\n    padding: 10px;\n    float: left;\n    border: 1px solid #e3e3e3;\n    margin-bottom:15px;\n}\n \n \nul {\n    float: left;\n    margin: 0;\n    padding: 0;\n    width: 220px;\n}\n \nul li {\n    list-style-type: none;\n    display:block;\n    background: #f1f1f1;\n    float: left;\n    width: 216px;\n    margin-bottom: 5px;\n    padding:2px;\n \n}\n \nul li img {\n    width: 120px;\n    float: left;\n    margin-right: 5px;\n    border: 1px solid #999;\n}\n \nul li a {\n    text-decoration: none;\n    display: block;\n    color: #000;\n}\n \n.currentvideo {\n    background: #e6e6e6;\n}\n    \n \n    \n</style> \n<script>\n//-------------------------------------------------\n//      youtube playlist jquery plugin\n//      Created by dan@geckonm.com\n//      www.geckonewmedia.com\n//\n//      v1.1 - updated to allow fullscreen \n//           - thanks Ashraf for the request\n//-------------------------------------------------\n\njQuery.fn.ytplaylist = function(options) {\n \n  // default settings\n  var options = jQuery.extend( {\n    holderId: 'ytvideo',\n    playerHeight: '300',\n    playerWidth: '450',\n    addThumbs: false,\n    thumbSize: 'small',\n    showInline: false,\n    autoPlay: true,\n    showRelated: true,\n    allowFullScreen: false\n  },options);\n \n  return this.each(function() {\n                            \n        var selector = $(this);\n        \n        var autoPlay = \"\", autoHide = \"\", hd = \"\", modestBranding = \"\", showInfo = \"&showinfo=0\";\n        var showRelated = \"&rel=0\";\n        var fullScreen = \"\";\n        if(options.autoPlay) autoPlay = \"&autoplay=1\"; \n        if(options.showRelated) showRelated = \"&rel=1\"; \n        if(options.allowFullScreen) fullScreen = \"&fs=1\"; \n        if(options.autoHide) autoHide = \"&autohide=1\";\n        if(options.hd) hd = \"&hd=1\";\n        if(options.modestBranding) modestBranding = \"&modestbranding=1\";\n        if(options.showInfo) showInfo = \"&showinfo=1\";\n\n        var params = autoPlay+showRelated+fullScreen+autoHide+hd+modestBranding+showInfo;\n        \n        //throw a youtube player in\n        function play(id)\n        {\n           var html  = '';\n    \n           html += '<object height=\"'+options.playerHeight+'\" width=\"'+options.playerWidth+'\">';\n           html += '<param name=\"movie\" value=\"http://www.youtube.com/v/'+id+params+'\"> </param>';\n           html += '<param name=\"wmode\" value=\"transparent\"> </param>';\n           if(options.allowFullScreen) { \n                html += '<param name=\"allowfullscreen\" value=\"true\"> </param>'; \n           }\n           html += '<embed src=\"http://www.youtube.com/v/'+id+params+'\"';\n           if(options.allowFullScreen) { \n                html += ' allowfullscreen=\"true\" '; \n            }\n           html += 'type=\"application/x-shockwave-flash\" wmode=\"transparent\"  height=\"'+options.playerHeight+'\" width=\"'+options.playerWidth+'\"></embed>';\n           html += '</object>';\n            \n           return html;\n           \n        };\n        \n        \n        //grab a youtube id from a (clean, no querystring) url (thanks to http://jquery-howto.blogspot.com/2009/05/jyoutube-jquery-youtube-thumbnail.html)\n        function youtubeid(url) {\n            var ytid = url.match(\"[\\\\?&]v=([^&#]*)\");\n            ytid = ytid[1];\n            return ytid;\n        };\n        \n        \n        //load inital video\n        var firstVid = selector.children(\"li:first-child\").addClass(\"currentvideo\").children(\"a\").attr(\"href\");\n        $(\"#\"+options.holderId+\"\").html(play(youtubeid(firstVid)));\n        \n        //load video on request\n        selector.children(\"li\").children(\"a\").click(function() {\n            \n            if(options.showInline) {\n                $(\"li.currentvideo\").removeClass(\"currentvideo\");\n                $(this).parent(\"li\").addClass(\"currentvideo\").html(play(youtubeid($(this).attr(\"href\"))));\n            }\n            else {\n                $(\"#\"+options.holderId+\"\").html(play(youtubeid($(this).attr(\"href\"))));\n                $(this).parent().parent(\"ul\").find(\"li.currentvideo\").removeClass(\"currentvideo\");\n                $(this).parent(\"li\").addClass(\"currentvideo\");\n            }\n                                                             \n            \n            \n            return false;\n        });\n        \n        //do we want thumns with that?\n        if(options.addThumbs) {\n            \n            selector.children().each(function(i){\n                                              \n                var replacedText = $(this).text();\n                \n                if(options.thumbSize == 'small') {\n                    var thumbUrl = \"http://img.youtube.com/vi/\"+youtubeid($(this).children(\"a\").attr(\"href\"))+\"/2.jpg\";\n                }\n                else {\n                    var thumbUrl = \"http://img.youtube.com/vi/\"+youtubeid($(this).children(\"a\").attr(\"href\"))+\"/0.jpg\";\n                }\n                \n                \n                $(this).children(\"a\").empty().html(\"<img src='\"+thumbUrl+\"' alt='\"+replacedText+\"' />\"+replacedText).attr(\"title\", replacedText);\n                \n            }); \n            \n        }\n            \n        \n   \n  });\n \n};\n\n</script>\n\n<script type=\"text/ecmascript\"> \n    \n        $(function() {\n            $(\"ul.demo2\").ytplaylist({\n                addThumbs:true, \n                autoPlay: false, \n                holderId: 'ytvideo2',\n                playerWidth: 660,\n                playerHeight: 500,\n                autoHide: true,\n                allowFullScreen: true,\n                hd: true,\n                modestBranding: true,\n                showRelated: false\n\n            });\n        });\n    \n</script> \n <div class=\"yt_holder\"> \n    <div id=\"ytvideo2\"></div> \n    <ul class=\"demo2\"> \n        <li><a href=\"http://www.youtube.com/watch?v=ani1SWy1N-g\">Homepage Navigation</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=GiADgYlwmGI\">Login & Registration</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=E67xYagMYe0\">Search</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=-5j7AeuFT1A\">OBO Upload</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=HMaQgKPrpwo\">Create New Ontology</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=-aLr_E-JuSM\">API & Feedback</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=TLo4GpuXHn4\">General Navigation</a></li> \n    </ul> \n</div>\n\n";
var page_login = "\n<form method=\"post\" id=\"login_form\" action=\"http://www.cropontology.org/login\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col s6 offset-s2\">\n                <div class=\"context-loader\" style=\"display: none; top:0px;\">Sending Request...</div>\n                <div class=\"error_box\" style=\"display: none;\">Incorrect login or password.</div>\n                <h1>Login</h1>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"text\" value=\"\" tabindex=\"1\" name=\"username\" id=\"log_username\" class=\"text\">\n                <label for=\"log_username\">Username</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"password\" value=\"\" tabindex=\"2\" name=\"password\" id=\"log_password\" class=\"text\">\n                <label for=\"log_password\">Password</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <a href=\"./forgot-password\">Forgot Password?</a>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"submit\" value=\"Log in\" tabindex=\"3\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_register = "\n<form id=\"register_form\" action=\"\" novalidate=\"novalidate\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"input-field col s6 required\">\n                <input type=\"text\" value=\"\" tabindex=\"1\" name=\"first_name\" id=\"first_name\" class=\"text\">\n                <label for=\"first_name\">First name</label>\n            </div>\n            <div class=\"input-field col s6 required\">\n                <input type=\"text\" value=\"\" tabindex=\"2\" name=\"sirname\" id=\"sirname\" class=\"text\">\n                <label for=\"sirname\">Last name</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s12\">\n                <input type=\"text\" value=\"\" tabindex=\"3\" name=\"institution\" id=\"institution\" class=\"text\">\n                <label for=\"institution\">Host institution</label>\n            </div>\n        </div>\n        <br />\n        <div class=\"row\">\n            <div class=\"input-field col s11 required\">\n                <input type=\"email\" value=\"\" tabindex=\"4\" name=\"email\" id=\"email\" class=\"text\">\n                <label for=\"email\">Email address</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s4 required\">\n                <input type=\"text\" value=\"\" tabindex=\"5\" name=\"username\" id=\"reg_username\" class=\"text\">\n                <label for=\"reg_username\">Username</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s4 required\">\n                <input type=\"password\" value=\"\" tabindex=\"6\" name=\"password\" id=\"password\" class=\"text\">\n                <label for=\"password\">Password</label>\n            </div>\n            <div class=\"input-field col s4 required\">\n                <input type=\"password\" value=\"\" tabindex=\"6\" name=\"confirm_password\" id=\"confirm_password\" class=\"text\">\n                <label for=\"confirm_password\">Repeat password</label>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s10\">\n                <center>\n                    <div class=\"g-recaptcha\" data-sitekey=\"6LdssoIUAAAAAIQYYHDi_jMiGHylKTm7JpPiq1GY\"></div>\n                </center>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s12\">\n                <button type=\"submit\" tabindex=\"7\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">Register</button>\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_forgot_password = "\n<form method=\"post\" id=\"login_form\" action=\"http://www.cropontology.org/forgot-password\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col s6 offset-s2\">\n                <h1>Forgot Password?</h1>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"email\" value=\"\" tabindex=\"1\" style=\"width: 21em;\" name=\"email\" id=\"email\" class=\"text\">\n                <label for=\"email\">Please enter your Email</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"submit\" value=\"Recover\" tabindex=\"3\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_feedback = "    <div id=\"disqus_thread\"></div>\n    <script type=\"text/javascript\">\n        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n        var disqus_shortname = 'cropontologycurationtool'; // required: replace example with your forum shortname\n\n        // The following are highly recommended additional parameters. Remove the slashes in front to use.\n        // var disqus_identifier = 'unique_dynamic_id_1234';\n        // var disqus_url = 'http://example.com/permalink-to-page.html';\n\n        /* * * DON'T EDIT BELOW THIS LINE * * */\n        (function() {\n            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n            dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';\n            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n        })();\n    </script>\n    <noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>\n";
var page_add_ontology = "<h1>Add Ontology</h1>\n\n<div id=\"error\"></div>\n\n<div class=\"row\">\n    <div class=\"col s12\">\n        <ul class=\"tabs add-ontology\">\n            <li class=\"tab col s4\">\n                <a class=\"active tooltipped\" href=\"#upload_excel\" data-tooltip=\"Upload an Excel Trait Template\" data-position=\"top\">\n                    <span class=\"hide-on-med-and-down\"><span class=\"fa fa-upload\"></span> Upload an Excel Trait Template</span>\n                    <span class=\"show-on-medium-and-up\"><span class=\"fa fa-upload\"></span> Excel</span>\n                </a>\n            </li>\n            <li class=\"tab col s4\">\n                <a class=\"tooltipped\" href=\"#upload_obo\" data-tooltip=\"Upload an OBO File\" data-position=\"top\">\n                    <span class=\"hide-on-med-and-down\"><span class=\"picol_rdf_document\"></span> Upload an OBO File</span>\n                    <span class=\"show-on-medium-and-up\"><span class=\"picol_rdf_document\"></span> OBO</span>\n                </a>\n            </li>\n            <li class=\"tab col s4\">\n                <a class=\"tooltipped\" href=\"#create_ontology\" data-tooltip=\"Create an Ontology\" data-position=\"top\">\n                    <span class=\"hide-on-med-and-down\"><span class=\"picol_rdf\"></span> Create an Ontology</span>\n                    <span class=\"show-on-medium-and-up\"><span class=\"picol_rdf\"></span> Ontology</span>\n                </a>\n            </li>\n        </ul>\n    </div>\n    <div id=\"add_ontology_tab_contents\">\n        <!-- Upload an Excel Trait Template content -->\n        <div id=\"upload_excel\" class=\"col s12\">\n            <div class=\"tab-content\">\n                <div id=\"upload_excel_cont\" style=\"display: block;\">\n                    <p><b>Note:</b> be sure your template is structured exactly like the latest standard Trait Template which can be found here: <a href=\"http://www.cropontology.org/TD_template_v5.xls\">Trait Dictionary template version 5</a></p>\n\n                    <div class=\"container\">\n                        <form action=\"\" method=\"post\" enctype=\"multipart/form-data\" target=\"excel_upload_iframe\">\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    Category:\n                                    <select name=\"category\">\n                                        <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                        <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                        <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                        <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                        <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                        <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option><option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option><option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                    </select>\n                                </div>\n                                <div class=\"input-field col s5\">\n                                    <input type=\"text\" name=\"ontology_id\" id=\"ontology_id\">\n                                    <label for=\"ontology_id\">Ontology ID</label>\n                                </div>\n                                <div class=\"input-field col s7\">\n                                    <input type=\"text\" name=\"ontology_name\" id=\"ontology_name\">\n                                    <label for=\"ontology_name\">Ontology Name</label>\n                                </div>\n                                <div class=\"input-field col s12 m10\">\n                                    <textarea class=\"materialize-textarea\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea>\n                                    <label for=\"ontology_summary\">Ontology Summary</label>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s8\">\n                                    <div class=\"file-field input-field\">\n                                        <div class=\"btn btn-flat highlight-btn\">\n                                            <span>Browse...</span>\n                                            <input name=\"excelfile\" type=\"file\">\n                                        </div>\n                                        <div class=\"file-path-wrapper\">\n                                            <input class=\"file-path validate\" type=\"text\">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12\">\n                                    <input class=\"btn btn-highlight waves-effect waves-light right\" type=\"submit\" value=\"Upload Excel\">\n                                </div>\n                            </div>\n                        </form>\n                        <iframe name=\"excel_upload_iframe\" style=\"display: none\"></iframe>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!-- Upload an OBO File content -->\n        <div id=\"upload_obo\" class=\"col s12\">\n            <div class=\"tab-content\">\n                <div id=\"upload_obo_cont\" style=\"display: block;\">\n                    <div class=\"container\">\n                        <form action=\"\" method=\"post\" enctype=\"multipart/form-data\" target=\"obo_upload_iframe\">\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    Category:\n                                    <select name=\"category\">\n                                        <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                        <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                        <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                        <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                        <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                        <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option>\n                                        <option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option>\n                                        <option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                    </select>\n                                </div>\n                                <div class=\"input-field col s12 m5\">\n                                    <input type=\"text\" name=\"ontology_name\" id=\"ontology_name\">\n                                    <label for=\"ontology_name\">Ontology Name</label>\n                                </div>\n                                <div class=\"input-field col s12 m10\">\n                                    <textarea class=\"materialize-textarea\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea>\n                                    <label for=\"ontology_summary\">Ontology Summary</label>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    <div class=\"file-field input-field\">\n                                        <div class=\"btn btn-flat highlight-btn\">\n                                            <span>Browse...</span>\n                                            <input name=\"obofile\" type=\"file\">\n                                        </div>\n                                        <div class=\"file-path-wrapper\">\n                                            <input class=\"file-path validate\" type=\"text\">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12\">\n                                    <input class=\"btn btn-highlight waves-effect waves-light right\" type=\"submit\" value=\"Upload OBO\">\n                                </div>\n                            </div>\n                        </form>\n                        <iframe name=\"obo_upload_iframe\" style=\"display: none\"></iframe>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!-- Create an Ontology -->\n        <div id=\"create_ontology\" class=\"col s12\">\n            <div class=\"tab-content\">\n                <div id=\"create_ontology_cont\" style=\"\">\n                    <p><b>Note:</b> this feature is not fully supported. For instance, deleting terms or term attributes is not possible.</p>\n\n                    <div class=\"container\">\n                        <form>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    Category:\n                                    <select name=\"category\">\n                                        <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                        <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                        <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                        <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                        <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                        <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option>\n                                        <option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option>\n                                        <option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                    </select>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"col s12\">\n                                    <ul class=\"treeview form\" id=\"cont\">\n                                        <li class=\"last\" id=\"ontology\">\n                                            <div class=\"item\">\n                                                <div class=\"input-field col s8 m4 l4\">\n                                                    <input type=\"text\" id=\"ontology_name\" name=\"name\" placeholder=\"Ontology Name\">\n                                \t\t\t\t\t<input id=\"ontology_version\" name=\"ontology_version\" type=\"hidden\" min=\"1\" size=\"5\" min=\"1\" value=\"\" placeholder=\"Ontology version\" />\n                                                </div>\n                                                <div class=\"input-field col s3 m3\">\n                                                    <input type=\"text\" id=\"ontology_id\" name=\"id\", placeholder=\"Ontology ID\">\n                                                </div>\n                                                <div class=\"col s11 m4\">\n                                                    <div class=\"row\">\n                                                        <div class=\"input-field col s12\">\n                                                            <input type=\"text\" id=\"ontology_summary\" name=\"ontology_summary\" placeholder=\"Ontology Summary\">\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                <div class=\"input-field col s1\">\n                                                    <a id=\"add_childs_btn\" class=\"btn btn-highlight btn-small btn-floating waves-effect waves-circle waves-light tooltipped\" data-tooltip=\"Add childs\" data-position=\"top\">\n                                                        <span class=\"fa fa-plus\"></span>\n                                                    </a>\n                                                </div>\n                                            </div>\n                                        </li>\n                                    </ul>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12\">\n                                    <a id=\"save\" class=\"btn btn-highlight waves-effect waves-light right\">Save</a>\n                                </div>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>\n";


var DATA = new _data2.default(),
    NAV = new _navigation2.default(),
    PAGINATION = new _pagination2.default(),
    TREEVIEW = new _treeview2.default(),
    FILTERS = new _filters2.default(),
    MODALS = new _modals2.default(),
    STR = new _str2.default(),
    LOADER = new _loader2.default(),
    URL = "http://www.cropontology.org",


/**
 * Static pages
 */
PAGE_ABOUT = page_about,
    PAGE_PRIVACY_POLICY = page_privacy_policy,
    PAGE_API = page_api.replace(/\{\{URL\}}/igm, window.location).replace(/((<style>)|(<style type=.+))((\s+)|(\S+)|(\r+)|(\n+))(.+)((\s+)|(\S+)|(\r+)|(\n+))(<\/style>)/g, ""),
    PAGE_HELP = page_help,
    PAGE_LOGIN = page_login,
    PAGE_REGISTER = page_register,
    PAGE_FORGOT_PASSWORD = page_forgot_password,
    PAGE_FEEDBACK = page_feedback,
    PAGE_ADD_ONTOLOGY = page_add_ontology,

/**
 * Layouts
 */
PAGE_ANNOTATION_TOOL = new _annotation_tool2.default(),
    page = NAV.get_page(),
    settings = require("../../common/settings/contents.json"),
    languages = require("../../common/settings/languages.json"),
    moment = require("moment"),
    user = {
	logged: false
};

if (settings[page] == undefined) {
	page = "404";
}

var layout = function () {
	function layout() {
		_classCallCheck(this, layout);
	}

	_createClass(layout, [{
		key: "activate",
		value: function activate() {
			/* Add rel="external" to links that are external (this.hostname !== location.hostname) BUT don't add to anchors containing images */
			$("#static_contents a, .license a").each(function (k, v) {
				// Compare the anchor tag's host name with location's host name
				if ($(v).prop("hostname") && $(v).prop("hostname") !== location.hostname && $(v).prop("hostname") !== "www.cropontology.org") {
					$(v).not("a:has(img)").attr("rel", "external");
				}
			});

			$("select").material_select();

			// Modals
			$(".modal").modal({
				dismissible: true,
				opacity: 0.8,
				ready: function ready(modal, trigger) {},
				complete: function complete() {
					// this.add_search_filters($(".modal-content").find("form").serializeObject());
					// $("#tags").tagit("createTag", "brand-new-tag");

					// 	$(".modal-content").find("form").serializeObject();//.reduce(function(obj, item) {obj[item.name] = item.value; return obj; }, {}))
					// }
				}
			});

			// Sidenav
			$(".button-collapse").sideNav({ edge: "right", closeOnClick: false });

			var search_data = {};
			$("input.autocomplete").on("keyup", function (e) {
				var start_search_after = 3,
				    reg = new RegExp("[\\w\\d\\\\\/\\-\\_\\p{L}]");

				// Intercept only word, digits and allowed special characters (see regex above)
				if ($("input.autocomplete").val().length > start_search_after && reg.test(e.key)) {
					// The search loader
					LOADER.create({
						type: "circular",
						size: "micro",
						colour: "yellow",
						target: "#search_loader"
					});
					DATA.search($("input.autocomplete").val()).then(function (data) {
						LOADER.hide("#search_loader", true);
						$.each(data, function (k, v) {
							search_data["<small><tt>" + v.id + "</tt></small> - " + v.ontology_name + " - " + STR.get_ontology_term(JSON.stringify(v.name))] = null;
						});

						$("input.autocomplete").autocomplete({
							data: search_data,
							minLength: start_search_after,
							limit: 50,
							onAutocomplete: function onAutocomplete(val) {
								location.href = "./terms/" + val.replace(/ \- (.*?) \- /g, "/");
							}
						}).blur().focus();
					});
				}
			});

			$(".collapsible").collapsible();

			$(".tooltipped").tooltip({ html: true });

			$(".materialboxed").materialbox();

			$(".parallax").parallax();

			$(".tabs:not(.add-ontology)").tabs();

			$("textarea.autoresize").trigger("autoresize");

			/**
    * Behaviours after page build
    * ---------------------------------------------------------------------
    */
			switch (page) {
				case "home":
					// Add the loader for news and info contents
					LOADER.create({ target: ".help", type: "progress" });
					break;
				case "ontology":
					// Add the loader for news and info contents
					LOADER.create({ target: "#contents", type: "progress" });
					break;
				case "register":
					$.validator.setDefaults({
						errorClass: 'invalid',
						validClass: "valid",
						errorPlacement: function errorPlacement(error, element) {
							$(element).closest("form").find("label[for='" + element.attr("id") + "']").attr('data-error', error.text());
						},
						submitHandler: function submitHandler(form) {
							if (grecaptcha.getResponse().length == 0) {
								DATA.register_user($("#register_form").serializeObject()).then(function (response) {
									if (response.message !== undefined) {
										Materialize.toast('<span class="fa fa-2x fa-check grey-text"></span> ' + response.message, 2000, "", function () {
											location.reload();
										});
									} else {
										$("#register_form :input").blur().removeClass("invalid").removeClass("valid");
										Materialize.toast('<span class="fa fa-2x fa-times grey-text"></span> ' + response.error, 4000);
									}
								});
							}
						}
					});
					$("#register_form").validate({
						rules: {
							first_name: {
								required: true
							},
							sirname: {
								required: true
							},
							email: {
								required: true,
								email: true
							},
							username: {
								required: true,
								minlength: 2
							},
							password: {
								required: true,
								minlength: 5
							},
							confirm_password: {
								required: true,
								minlength: 5,
								equalTo: "#password"
							}
						},
						messages: {
							first_name: "Please specify your name",
							sirname: "Please specify your last name",
							email: {
								required: "Please specify an e-mail address",
								email: "Your email address must be in the format of name@domain.com"
							},
							username: {
								required: "Please insert an username",
								minlength: "Your username must consist of at least 2 characters"
							},
							password: {
								required: "Please insert a password",
								minlength: "Your password must be at least 5 characters long"
							},
							confirm_password: {
								required: "Please insert a password",
								minlength: "Your password must be at least 5 characters long",
								equalTo: "Please enter the same password as before"
							}
						}
					});
					break;
				case "annotation-tool":

					var stepperInstace = new MStepper(document.querySelector(".stepper"), {
						firstActive: 0,
						linearStepsNavigation: true,
						autoFocusInput: true
					});
					$("#clipboard").focus();

					var validateStepOne = function validateStepOne() {
						return $.trim($("#clipboard").val()) !== "" ? true : false;
					};

					/**
      * Drag behaviours
      * -------------------------------------------------------------
      */


					var drag_timer, dragged_file;
					$(window).on("dragover", function (e) {
						e.stopPropagation();
						e.preventDefault();

						var dt = e.originalEvent.dataTransfer;
						e.originalEvent.dataTransfer.dropEffect = "copy";
						if (dt.types && (dt.types.indexOf ? dt.types.indexOf("Files") != -1 : dt.types.contains("Files"))) {
							$("#drop_area").fadeIn(150);
							window.clearTimeout(drag_timer);
						}
					}).on("dragleave", function (e) {
						drag_timer = window.setTimeout(function () {
							$("#drop_area").fadeOut(150);
						}, 1500);
					});
					/**
      * Drop area behaviours
      */
					$("#drop_area").on("dragover", function (e) {
						e.stopPropagation();
						e.preventDefault();

						e.originalEvent.dataTransfer.dropEffect = "copy";
					}).on("drop", function (e) {
						dragged_file = e.originalEvent.dataTransfer.files;
						e.stopPropagation();
						e.preventDefault();

						drag_timer = window.setTimeout(function () {
							PAGE_ANNOTATION_TOOL.process_file(dragged_file);
						}, 25);
						return false;
					});
					/**
      * -------------------------------------------------------------
      */

					$("#first_line_contains_titles").on("change", function () {
						// $("#clipboard").val("");
						$("#generate_btn").removeClass("disabled");
						$("#step2 .step-title, #continue_btn").addClass("disabled");
					});
					break;
			}

			// Adapt graph on fullscreen mode
			$(document).on("fscreenchange", function (e, state, elem) {
				if ($(elem).attr("id") == "graph") {
					if (state) {
						$(".fa-expand").removeClass("fa-expand").addClass("fa-compress");

						$("#graph.fullscreen").find(".btn.fullscreen").attr("data-tooltip", "Exit fullscreen").click(function (e) {
							$.fullscreen.exit();
						});
					} else {
						$(".fa-compress").removeClass("fa-compress").addClass("fa-expand");

						$("#graph.fullscreen").find(".btn.fullscreen").attr("data-tooltip", "Show fullscreen");
					}
				}
			});
		}

		/**
   * Build a menu
   * @param  string 						position							The menu position
   * @return object
   */

	}, {
		key: "build_menu",
		value: function build_menu(position) {
			var menus = require("../../common/settings/menu.json");

			$.each(menus, function (k, v) {
				$("#" + position).append($.map(v[position].items, function (item, k) {
					switch (position) {
						case "top_menu":
							var display = !item.is_sidenav_link ? k >= 6 ? " hide-on-med-and-down" : " hide-on-small-only" : "";

							if (item.label === undefined && item.separator) {
								switch ($.type(item.separator)) {
									case "boolean":
										return $('<li>', { "class": display }).append($('<span>', { "class": "separator" }));
										break;
									case "string":
										return $('<li>', { "class": "disabled black-text" + display }).append($('<span>').text(item.separator));
										break;
								}
							} else {
								if (item.display) {
									var $li = $('<li>').append($('<a>', {
										"href": item.link,
										"class": item.class + display
									}).append(function () {
										if (!item.is_sidenav_link) {
											return item.label;
										} else {
											return $('<i>', { "class": "material-icons" }).text("menu");
										}
									}));
									if (item.data !== undefined) {
										$.each(item.data, function (data_key, data_value) {
											$li.find("a").attr("data-" + data_key, data_value);
										});
									}
									if (item.is_sidenav_link) {
										$li.addClass("right show-on-medium-and-down");
									}
									return $li;
								}
							}
							break;
						case "bottom_links":
							$.each(item.items, function (ik, iv) {
								if (iv.display) {
									$("#" + position + " ." + item.position).append($('<a>', { "class": "tooltipped", "href": iv.link, "target": iv.target, "data-tooltip": iv.label }).append($('<img>', { "class": "", "src": "common/media/img/" + iv.image })));
								}
							});
							break;
						case "footer_menu":
							$("#" + item.position).prepend($('<h2>').html(item.title));
							$("#" + item.position).append($('<ul>', { "class": item.class }));
							$.each(item.items, function (ik, iv) {
								$("#" + item.position).find("ul").append(function () {
									if (iv.display) {
										return $('<li>').append($('<a>', { "href": iv.link, "target": iv.target, "data-tooltip": iv.label, "class": "tooltipped" }).append(iv.icon !== undefined ? $('<span>', { "class": iv.icon }) : iv.label));
									}
									if (iv.separator !== undefined) {
										return $('<li>', { "class": "separator" });
									}
								});
							});
							break;
						default:
							if (item.label === undefined && item.separator) {
								switch ($.type(item.separator)) {
									case "boolean":
										return $('<li>', { "class": "divider" }).append($('<span>', { "class": "separator" }));
										break;
									case "string":
										return $('<li>', { "class": "disabled black-text" }).append($('<span>').text(item.separator));
										break;
								}
							} else {
								if (item.display) {
									return $('<li>').append($('<a>', { "href": item.link, "class": item.class }).text(item.label));
								}
							}
							break;
					}
				}));
			});
		}

		/**
   * Build the page <header>
   * @return {[type]} [description]
   */

	}, {
		key: "build_header",
		value: function build_header() {
			$("body").prepend($("<header>").append($('<nav>', { "class": "transparent z-depth-0" }).append($('<div>', { "class": "nav-wrapper" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "src": "common/media/img/crop_ontology.png" }))).append(
			// Sidenav
			$('<ul>', { "id": "sidenav", "class": "side-nav" }).append($('<li>', { "class": "row-control" }).append($('<a>', { "href": "javascript:;" }).append($('<i>', { "class": "material-icons" }).text("close")).append("Close").click(function () {
				$(".button-collapse").sideNav("hide");
			}))
			// ).append(
			// $('<li>', {"class": "divider"})
			)).append(
			// Top menu container
			$('<ul>', { "id": "top_menu", "class": "right" })))));

			/**
    * Build the top menu
    * @uses build_menu()
    */
			this.build_menu("sidenav");

			/**
    * Build the top menu
    * @uses build_menu()
    */
			this.build_menu("top_menu");
		}

		/**
   * Build the carousel messages slider
   */

	}, {
		key: "build_carousel",
		value: function build_carousel() {
			var path = STR.ucfirst(NAV.get_url_path()[NAV.get_url_path().length - 1]),
			    title = "",
			    subtitle = "";

			if (settings.general.carousel.visible && settings[page].carousel.visible) {
				$("body").append($('<section>', { "id": "top_carousel", "class": "" }).append($('<div>', { "class": "carousel carousel-slider center" }).append($('<div>', { "class": "carousel-fixed-item container" }).append($('<div>', { "class": "left" }).append(function () {
					if (page == "404") {
						return $('<h1>', { "id": "page_subtitle" }).text(page);
					} else if (settings[page].subtitle !== undefined && settings[page].subtitle !== "") {
						return $('<h1>', { "id": "page_subtitle" }).text(settings[page].subtitle);
					}
				}).append($('<h1>', { "id": "page_title" }).text(settings[page].title)))).append($.map(settings[page].carousel.items, function (v) {
					return $('<div>', { "class": "carousel-item valign-wrapper", "href": "#one" }).append(function () {
						if (v.image !== "") {
							return $('<img>', { "src": "common/media/img/carousel_images/" + v.image, "class": "responsive-img" });
						}
					}).append($('<h1>').html(STR.nl2br(v.message).replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>')));
				}))));

				// Instantiate Materialize carousel
				$(".carousel").carousel({
					duration: 50,
					fullWidth: true,
					indicators: false
				}).animate({ "opacity": 1 }, 300);

				if (settings[page].carousel.items.length == 1) {
					$(".carousel").css("pointer-events", "none");
				}

				/**
    * Animate the carousel
    * @param integer						time						The delay after carousel change (default is 10'000)
    */
				if (settings.general.carousel.animate && settings[page].carousel.items.length > 1) {
					setInterval(function () {
						// $(".carousel .carousel-item").fadeOut(300, () => {
						$(".carousel").carousel("next");
						// $(".carousel .carousel-item").delay(300).fadeIn();
						// })
					}, settings.general.carousel.time);
				}
			} else {
				/**
     * Set page title & subtitle
     * @note
     */
				var _title = "",
				    _subtitle = "";
				switch (page) {
					case "ontology":
						_title = NAV.get_ontology_id();
						_subtitle = STR.camel_case_2_text(NAV.get_ontology_label());
						break;
					case "terms":
						_title = '<a href="./terms/CO_020">' + NAV.get_ontology_id() + "</a><small>:" + NAV.get_term_id() + "</small>";
						_subtitle = STR.camel_case_2_text(NAV.get_term_label());
						break;
					default:
						_title = settings[page].title;
						_subtitle = settings[page].subtitle;
						break;
				}

				$("body").append($('<div>', { "id": "ontology_card", "class": "row container" }).append($('<h1>', { "id": "page_subtitle" }).html(_title)).append($('<h2>', { "id": "page_title" }).text(_subtitle)));
			}
		}

		/**
   * Build the searchbar
   */

	}, {
		key: "build_searchbar",
		value: function build_searchbar() {
			// Build the filters modal
			// MODALS.filters_modal();

			if (settings.general.search.visible) {
				var $searchbar = $('<div>', { "class": "bar" }).append(
				// Layout for search with tags
				// $('<div>', {"id": "search_input", "class": "input-field col s8 m8 l8 xl8"}).append(
				$('<div>', { "id": "search_input", "class": "input-field", "style": "width:100%;" }).append($('<input>', {
					"type": "search",
					"id": "search",
					"autocomplete": "off",
					"class": "autocomplete",
					"placeholder": "Search...",
					"name": "q"
				}))).append($('<div>', { "id": "search_loader" })),
				    $breadcrumbs = $('<nav>', { "class": "transparent z-depth-0" }).append($('<div>', { "class": "nav-wrapper" }).append($('<div>', { "class": "col s12 truncate" }).append($('<a>', { "href": "./", "class": "breadcrumb" }).append($('<span>', { "class": "fas fa-home" }))).append(function () {
					if (NAV.get_url_path().length > 1) {
						switch (page) {
							case "ontology":
								return $('<span>', { "class": "breadcrumb" }).html($('<tt>').append(NAV.get_ontology_id())).append(" ").append($("<span>", { "class": "page_name" }).append(STR.ucfirst(STR.camel_case_2_text(NAV.get_ontology_label()))));
								break;
							case "terms":
								return $('<span>', { "class": "breadcrumb" }).html($('<tt>').append(NAV.get_ontology_id()).append($('<small>').append(":" + NAV.get_term_id()))).append(" ").append($("<span>", { "class": "page_name" }).append(STR.ucfirst(STR.camel_case_2_text(NAV.get_term_label()))));
								break;
							default:
								return $('<span>', { "class": "breadcrumb" }).html(STR.ucfirst(STR.camel_case_2_text(NAV.get_page().replace(NAV.get_ontology_url_regex(":"), "<tt>$1</tt> $2"))));
								break;
						}
					} else {
						return $('<span>', { "class": "breadcrumb" }).text(STR.ucfirst(NAV.get_page()));
					}
				})));

				if (page == "home") {
					$("body").append($('<section>', { "id": "searchbar", "class": "container" }).append($('<form>', { "method": "get", "onsubmit": "return false;" }).append($('<div>', { "class": "" }).append($('<div>', { "class": "row" }).append($searchbar).append(function () {
						if (settings.general.search.tags.visible) {
							return $('<div>', { "id": "tags_list", "class": "input-field col s4 m4 l4 xl4" }).append($('<ul>', { "class": "tags" }).append(FILTERS.draw_filter("type", "TRAIT")).append(FILTERS.draw_filter("user", "MALAPORTE")));
						}
					})).append(function () {
						if (settings.general.search.filters.visible) {
							return $('<a>', { "href": "#searchbar_filters", "class": "btn-text blue-text right modal-trigger" }).append($('<span>', { "class": "fa fa-filter" })).append(" Add a filter");
						}
					}))));
				} else {
					$("body").append($('<section>', { "id": "navbar", "class": "container" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "searchbar", "class": "col s12 m8 l6 right" }).append($searchbar)).append($('<div>', { "id": "breadcrumb", "class": "col s12 m4 l6 left" }).append($breadcrumbs))));
				}
			}
		}

		/**
   * Build the halfway menu
   */

	}, {
		key: "build_halfway_menu",
		value: function build_halfway_menu() {
			if (settings.general.halfway_menu.visible) {
				$("body").append($('<section>', { "id": "halfway", "class": "" }).append($('<ul>', { "id": "halfway_menu", "class": "center horizontal" })));

				/**
     * Build the top menu
     * @uses build_menu()
     */
				this.build_menu("halfway_menu");
			}
		}

		/**
   * Build the contents section
   * @uses build_page_contents()
   */

	}, {
		key: "build_contents_section",
		value: function build_contents_section() {
			/**
    * Content container
    */
			$("body").append($('<section>', { "id": "contents", "class": "" }).append(function () {
				switch (page) {
					/**
     * Home layout
     * -------------------------------------------------------------
     */
					case "home":
						return $('<div>', { "class": "row" }).append($('<div>', { "id": "ontologies_container", "class": "col s12 m12 l8 xl8 right" }).append($('<div>', { "class": "center-align" }).text(settings.general.loader.text))).append($('<div>', { "class": "col s12 m12 l4 xl4 left" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "info_container", "class": "col s12 m12 l12 xl12" }).append($('<div>', { "class": "card lighten-5" }).append($('<div>', { "class": "card-content" }).append($('<span>', { "class": "card-title highlight" })).append(
						// Loader
						// ---------------------------------
						$('<div>', { "class": "help" }).append()
						// $('<div>', {"class": "center-align"}).text(settings.general.loader.text)

						// ---------------------------------
						)))).append($('<div>', { "id": "feed_container", "class": "col s12 m12 l12 xl12" }))));
						break;
					case "latest":
						return $('<div>', { "class": "container" }).append($('<div>', { "id": "ontologies_container", "class": "col s12 m8 l8 xl8" }).append($('<div>', { "class": "center-align" }).text(settings.general.loader.text)));
						break;
					default:
						return $('<div>', { "id": "page_content", "class": "container" });
						break;
				}
			}));

			/**
    * Get and place contents in the page
    */
			this.build_page_contents();
		}

		/**
   * Build pages contents
   */

	}, {
		key: "build_page_contents",
		value: function build_page_contents() {
			var _$;

			DATA.get_user_logged();

			// Build the user account modal
			MODALS.user_modal("Login");

			switch (page) {
				/**
     * 							404 contents
     * -----------------------------------------------------------------
     */
				case "404":
					$("#contents .container").append($('<center>', { "class": "flow-text" }).text("The page you are looking for does not exists"));
					break;
				/**
     * 							HOME contents
     * -----------------------------------------------------------------
     */
				case "home":
					/**
      * Info
      * -------------------------------------------------------------
      */
					DATA.get_help_content().then(function (data) {
						if (settings.home.sections.help.visible) {
							// LOADER.hide("#help");
							$("#info_container .card-title").append($('<small>', { "class": "far fa-question-circle grey-text" })).append(" " + settings.home.sections.help.title);
							$("#info_container .card-content .help").html(data[0].content.replace("<ul>", '<ul class="browser-default">'));
							// return data[0].content;
						}
					});

					/**
      * Feeds
      * -------------------------------------------------------------
      */
					DATA.get_community_website_feed().then(function (data) {
						if (settings.home.sections.news.visible) {
							var $feeds = [],
							    feeds = [],
							    total_pages = Math.ceil(parseInt(data.length) / settings.home.sections.news.items_per_page),
							    visible_data = 0,
							    current_page = 0,
							    visible;

							$.each(data, function (k, v) {
								if (v.category[0].label == "announcement") {
									visible_data++;
									if (visible_data % parseInt(settings.home.sections.news.items_per_page + 1) == 0) {
										current_page++;
									}

									feeds.push({
										page: current_page,
										visible: current_page == 0 ? "visible" : "hide",
										title: v.title,
										preview: v.preview,
										author: $('<a>', { "href": "mailto:" + v.author.email }).text(v.author.name).prop("outerHTML"),
										published: moment(v.published).local().format("MMM DD, YYYY"),
										link: v.link,
										abstract: STR.extract_text(v.content) + "<br />"
									});
								}
							});
							$.each(feeds, function (k, v) {
								$feeds.push($('<div>', { "class": "feed page_" + v.page + " " + v.visible }).append($('<div>', { "class": "preview" }).append($('<a>', { "href": v.link }).append($(v.preview)))).append($('<span>', { "class": "card-title highlight" }).append($('<a>', { "href": v.link }).text(v.title))).append($('<div>', { "class": "release" }).append($('<span>', { "class": "far fa-fw fa-clock" })).append($('<span>').html(" " + v.published + " by " + v.author))
								// Uncomment below if you want the "abstract" content and the "Read more..." button on each news
								//
								// ).append(
								// 	$('<div>', {"class": "content"}).append(
								// 		v.abstract
								// 	).append(
								// 		$('<a>', {"href": v.link, "class": "readmore"}).text("Read more...")
								// 	)
								));
							});

							$("#feed_container").append($('<div>', { "class": "card z-depth-1" }).append($('<div>', { "class": "card-content" }).append($('<div>', { "class": "card-title highlight" }).append(settings.home.sections.news.title))).append($('<div>', { "class": "card-content" }).append($feeds

							// Uncomment below if you want news pagination
							//
							// PAGINATION.build_pagination({
							// 	id: "feed_pagination",
							// 	content: "#feed_container",
							// 	items: ".feed",
							// 	current_page: 1,
							// 	total_pages: Math.ceil(parseInt(data.length)/settings.home.sections.news.items_per_page),
							// })
							)).append($('<div>', { "class": "card-action right-align" }).append($('<a>', { "class": "btn btn-flat highlight-btn", "href": "https://sites.google.com/a/cgxchange.org/cropontologycommunity/" }).text("Read more...")))).slideDown(300);
						}
					}).catch(function (e) {
						// handle the error
					});

					/**
      * Ontologies
      * -------------------------------------------------------------
      */
					LOADER.create({ target: "#ontologies_container", type: "progress" });

					DATA.get_ontologies().then(function (data) {
						LOADER.hide("#ontologies_container .progress", true);

						if (settings.home.sections.ontologies.visible) {
							$("#ontologies_container").html($('<h5>').text("Ontologies")).append($('<ul>', { "class": "collapsible z-depth-0", "data-collapsible": "accordion" }));

							var current_page = 1,
							    page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
							    page_content = [];

							if (page_limit <= 0) {
								page_limit = 1;
							}

							$("#ontologies_container .collapsible").append($('<li>').append($('<div>', { "class": "collapsible-header grey-text" }).append($('<div>', { "class": "collapsible-secondary help-text" }).append($('<span>', { "class": "fa fa-chevron-right" }))).append($('<div>', { "class": "truncate" }).append($('<span>', { "class": "picol_news" })).append("See latest")).click(function () {
								window.location.href = "./latest";
							})));
							/**
        * Cycle categories (5 items)
        */
							$.each(data, function (k, categories) {
								var page = 0,
								    pages = categories.ontologies.length > page_limit ? Math.ceil(categories.ontologies.length / page_limit) : 1,
								    page_count = 0,
								    $pagination = $('<div>', { "class": "ontology_pagination pagination-content" }),
								    $ontology_page = null;

								$("#ontologies_container .collapsible").append($('<li>', {
									"class": k == 3 ? "active" : "",
									"id": categories.category.id
								}).append($('<div>', { "class": "collapsible-header " + (k == 3 ? "active" : "") }).append($('<div>', { "class": "collapsible-secondary help-text" }).append(categories.ontologies.length + " " + STR.pluralize(categories.ontologies.length, "item")).append(function () {
									if (pages > 1) {
										var $indications = $('<span>', {
											"class": "tooltipped",
											"data-tooltip": "Displaying page " + current_page + " of " + pages + " - " + page_limit + " items per page"
										}).append(" | ").append($('<span>', { "class": "far fa-file-alt" })).append($('<span>', { "id": "page_no", "class": "grey-text" }).text(current_page)).append("/" + pages).prop("outerHTML");

										setTimeout(function () {
											$("#ontologies_container .tooltipped").tooltip({ position: "left" });
										}, 1000);
										return $indications;
									}
								})).append($('<div>', { "class": "truncate" }).append($('<span>', { "class": categories.category.icon })).append($('<span>', {
									"class": "tooltipped",
									"data-tooltip": categories.category.name,
									"data-position": "top"
								}).text(categories.category.name)))).append($('<div>', { "class": "collapsible-body" + (pages > 0 ? " paginated" : "") }).append(function () {
									if (pages > 1) {
										return $pagination;
									}
								}).append($('<ul>', { "id": "ontology_container" }).append(
								/**
         * Cycle all ontologies
         */
								$.map(categories.ontologies, function (vv, kk) {
									page_count = kk + 1;

									/**
          * Subdivide ontologies in pages
          */
									if (page_count % page_limit == 1 || page_limit == 1) {
										page++;

										var display = page == 1 || pages == 1 ? "" : "hide";
										$ontology_page = $('<li>', { "class": "ontology page_" + page + " " + display }).append($('<ul>', { "class": "collection" }));
									}
									$ontology_page.find(".collection").append($('<li>', { "class": "collection-item" }).append($('<a>', {
										"href": "./ontology/" + vv.ontology_id + ":" + vv.ontology_name.replace("/", "-")
									}).append($('<h2>').append(vv.ontology_name))).append($('<div>', { "class": "secondary-content" }).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "Ontology RSS",
										"data-delay": "0",
										"target": "_blank",
										"href": "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + vv.ontology_name.replace("/", "-") + "/rss"
									}).append($('<span>', { "class": "fa fa-rss-square" }))).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "RDF N-Triples",
										"data-delay": "0",
										"target": "_blank",
										"href": "https://www.cropontology.org/ontology/" + vv.ontology_id + "/" + vv.ontology_name.replace("/", "-") + "/nt"
									}).append($('<span>', { "class": "picol_rdf_document" })))).append($('<span>', { "class": "items_count" }).text(vv.tot + " " + STR.pluralize(vv.tot, "item"))).append($('<p>').text(vv.ontology_summary)));
									return $ontology_page;
								}))).append(function () {
									if (pages > 1) {
										return $pagination.clone();
									}
								}))).collapsible();

								$("#" + categories.category.id).find(".pagination-content").append(PAGINATION.build_pagination({
									id: "ontology_pagination",
									context_class: categories.category.id,
									content: "#ontology_container",
									items: ".ontology",
									total_pages: pages
								}));
							});
						}
					}).catch(function (e) {
						// handle the error
					});
					break;
				/**
    			 * 							LATEST ONTOLOGIES AND NEWS contents
     * -----------------------------------------------------------------
    			 */
				case "latest":
					LOADER.create({ target: "#ontologies_container", type: "progress" });

					DATA.get_latest_ontologies().then(function (latest) {
						LOADER.hide("#ontologies_container .progress", true);

						if (settings.latest.visible) {
							$("#ontologies_container").html($('<ul>', { "class": "collapsible z-depth-0", "data-collapsible": "accordion" }));

							var current_page = 1,
							    page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
							    page_content = [];

							if (page_limit <= 0) {
								page_limit = 1;
							}

							/**
        * Cycle categories (5 items)
        */
							$.each(latest, function (k, categories) {
								$("#ontologies_container .collapsible").append($('<li>', {
									"class": k == "latestOntos" ? "active" : "",
									"id": k
								}).append($('<div>', { "class": "collapsible-header " + (k == "latestOntos" ? "active" : "") }).append($('<div>', { "class": "left" }).append($('<span>').text(STR.ucfirst(STR.camel_case_2_text(k.replace("Ontos", "Ontologies"))) + " (top 10)")))).append($('<div>', { "class": "collapsible-body" }).append($('<ul>', { "id": "ontology_container" }).append($.map(categories, function (vv, kk) {
									var name = "",
									    href = "",
									    rss = "",
									    nt = "",
									    summary = "",
									    author = "";

									if (k == "latestOntos") {
										name = vv.ontology_name;
										href = "./ontology/" + vv.ontology_id + ":" + name.replace("/", "-");
										rss = "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + name.replace("/", "-") + "/rss";
										nt = "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + name.replace("/", "-") + "/nt";
										summary = STR.ucfirst(vv.ontology_summary), author = vv.username;
									} else {
										name = STR.get_ontology_term(vv.name);
										href = "./terms/" + vv.id + ":" + name.replace("/", "-");
										rss = "http://www.cropontology.org/ontology/" + vv.id + "/" + name.replace("/", "-") + "/rss";
										nt = "http://www.cropontology.org/ontology/" + vv.id.split(":")[0] + "/" + (vv.ontology_name == null || vv.ontology_name == "null" ? "" : vv.ontology_name.replace("/", "-")) + "/nt";
										summary = "", author = vv.author;
									}
									return $('<ul>', { "class": "collection" }).append($('<li>', { "class": "collection-item" }).append($('<a>', {
										"href": href
									}).append($('<h2>').append(name))).append($('<div>', { "class": "secondary-content" }).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "Ontology RSS",
										"data-delay": "0",
										"target": "_blank",
										"href": rss
									}).append($('<span>', { "class": "fa fa-rss-square" })).tooltip()).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "RDF N-Triples",
										"data-delay": "0",
										"target": "_blank",
										"href": nt
									}).append($('<span>', { "class": "picol_rdf_document" })).tooltip())).append($('<a>', { "href": "javascript:;", "class": "tag green" }).text(author)).append(function () {
										if (summary.length > 0) {
											return $('<p>').html(summary);
										}
									}));
								}))))).collapsible();
							});
						}
					});
					break;
				/**
    			 * 							CONTACT US contents
     * -----------------------------------------------------------------
    			 */
				case "contact-us":
				case "contact us":
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "contact_form").append($('<form>', {
						"method": "get",
						"onsubmit": "return false;"
					}).append($('<div>', { "class": "row" }).append($('<form>', { "class": "col s12 m6 offset-m3" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s6" }).append($('<input>', { "type": "text", "id": "first_name", "class": "validate" })).append($('<label>', { "for": "first_name" }).text("First name"))).append($('<div>', { "class": "input-field col s6" }).append($('<input>', { "type": "text", "id": "last_name", "class": "validate" })).append($('<label>', { "for": "last_name" }).text("Last name"))).append($('<div>', { "class": "input-field col s12" }).append($('<input>', { "type": "email", "id": "email", "class": "validate" })).append($('<label>', { "for": "email" }).text("E-mail address")))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s10" }).append($('<input>', { "type": "text", "id": "subject", "class": "validate" })).append($('<label>', { "for": "subject" }).text("Subject"))).append($('<div>', { "class": "input-field col s12" }).append($('<textarea>', { "id": "message", "class": "materialize-textarea" })).append($('<label>', { "for": "message" }).text("Message"))).append(
					// Google reCAPTCHA
					$('<div>', { "class": "g-recaptcha right", "data-sitekey": "6LdssoIUAAAAAIQYYHDi_jMiGHylKTm7JpPiq1GY" }))).append($('<div>', { "class": "row" }).append($('<a>', { "class": "btn btn-flat right waves-effect waves-light", "href": "javascript:;" }).text("Send"))))));
					break;
				/**
     * 							ABOUT contents
    * -----------------------------------------------------------------
     */
				case "about":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_ABOUT);
					break;
				/**
     * 							PRIVACY POLICY contents
    * -----------------------------------------------------------------
     */
				case "privacy-policy":
				case "privacy policy":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_PRIVACY_POLICY);
					break;
				/**
     * 							API contents
     * -----------------------------------------------------------------
     */
				case "api":
				case "API":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_API);
					break;
				/**
     * 							HELP contents
     * -----------------------------------------------------------------
     */
				case "help":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_HELP);
					break;
				/**
     * 							LOGIN contents
     * -----------------------------------------------------------------
     */
				case "login":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_LOGIN);
					break;
				/**
     * 							REGISTER contents
     * -----------------------------------------------------------------
     */
				case "register":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_REGISTER);
					break;
				/**
     * 							FORGOT-PASSWORD contents
     * -----------------------------------------------------------------
     */
				case "forgot-password":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_FORGOT_PASSWORD);
					break;
				/**
     * 							FEEDBACK contents
     * -----------------------------------------------------------------
     */
				case "feedback":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_FEEDBACK);
					break;
				/**
     * 							ADD-ONTOLOGIES contents
     * -----------------------------------------------------------------
     */
				case "add-ontology":
					var counter = 0,
					    ontoId,
					    getPars = function getPars(o, $cont, ontoId, parent) {
						var term = {};
						if ($cont.attr("id") !== "cont") {
							// we dont want to save the root
							var _name = $cont.find("input[name=name]:first").val();
							term = {
								id: ontoId + ":" + counter++,
								name: _name,
								parent: parent
							};
							o.push(term);
						}
						// children() returns only the top most elements
						$cont.children("ul").each(function (k, v) {
							getPars(o, $(v), ontoId, term.id || null);
						});
					};

					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_ADD_ONTOLOGY);
					$(".tooltipped").tooltip();

					$("#add_childs_btn").on("click", function (e) {
						var $template = $('<ul>', { "class": "treeview form" }).append($('<li>', { "class": "term" }).append($('<div>', { "class": "item valign-wrapper" }).append($('<div>', { "class": "input-field col s5" }).append($('<input>', { "type": "text", "name": "name", "placeholder": "Term Name" }))).append($('<div>', { "class": "input-field col s5" }).append($('<input>', { "type": "text", "name": "relation_name", "placeholder": "Relation Name" }))).append($('<div>', { "class": "col s1" }).append($('<a>', { "class": "btn btn-mini add", "href": "javascript:;", "tabindex": "-1" }).append($('<span>', { "class": "fa fa-plus" }))).append($('<a>', { "class": "btn btn-mini remove", "href": "javascript:;", "tabindex": "-1" }).append($('<span>', { "class": "fa fa-minus" }))))));

						$("#cont").append($template);
						$("#cont").find("ul:last-child li:last-child input:first").focus();

						$(".btn-mini.add").unbind().on("click", function (e) {
							var $cloned_template = $template.clone(true);
							$cloned_template.find("input").val("");
							$(e.target).closest("ul").last().append($cloned_template);
							$(e.target).closest("ul").last().find("li").last().find("input:first").focus();
						});
						$(".btn-mini.remove").unbind().on("click", function (e) {
							if (!confirm("Are you sure you want to remove this term and all its children?")) return;
							$(e.target).closest("ul").last().remove();
						});

						e.preventDefault();
						e.stopPropagation();
					});
					$("#save").click(function (e) {
						var ret = [],
						    counter = 0,
						    ontoId = $.trim($("form:visible").find("#ontology_id").val());

						getPars(ret, $("#cont"), ontoId);

						// we need to obey the API which is a list of objects.
						// the tree is given by referencing each id
						// so the developer needs to give us IDs for us to know about
						// relation logic
						var pars = {
							ontology_name: $.trim($("form:visible").find("#ontology_name").val()),
							ontology_version: _data2.default.ontology_version !== undefined ? _data2.default.ontology_version + 1 : 1,
							ontology_id: $.trim($("form:visible").find("#ontology_id").val()),
							ontology_summary: $.trim($("form:visible").find("#ontology_summary").val()),
							category: $.trim($("form:visible").find("#create_ontology_cont select[name=category]").val()),
							json: JSON.stringify(ret)
						};

						if ($.trim(pars.ontology_name) == "" || pars.ontology_name == undefined || pars.ontology_id == "" || pars.ontology_id == undefined) {
							$("#error").text("Please insert the name of Ontology and its ID").fadeIn();
							return;
						}
						DATA.get_ontology(ontoId).then(function (data) {
							$("#error").fadeOut();

							DATA.add_ontology(pars).then(function (data) {
								window.location.href = "/";
							}, function (error) {
								$("#error").html($(error.responseText).text()).fadeIn();
							});

							e.preventDefault();
							e.stopPropagation();
						});
					});

					setTimeout(function () {
						DATA.get_ontology_upload_url().then(function (upload_url) {
							$("#add_ontology_tab_contents .col.active form").attr("action", upload_url);
						});
					}, 100);

					$(".tabs").tabs({
						onShow: function onShow(e) {
							DATA.get_ontology_upload_url().then(function (upload_url) {
								$("#add_ontology_tab_contents .col.active form").attr("action", upload_url);
							});
						}
					});

					break;
				/**
     * 							ONTOLOGIES contents
     * -----------------------------------------------------------------
     */
				case "ontology":
				case "terms":
					var name = "",
					    term = "",
					    language = "english";

					MODALS.download_ontology_modal();

					/**
      * Ontology card
      */
					DATA.get_ontologies_data(NAV.get_ontology_id()).then(function (ontologies_data) {
						$("#ontology_card").html($('<div>', { "class": "col s4 m3 l2" }).append($('<img>', { "class": "crop_pict responsive-img", "src": ontologies_data.ontology_picture }))).append($('<div>', { "class": "col s8 m9 l10" }).append($('<h1>', { "id": "page_subtitle" }).append(NAV.get_ontology_id()).append(NAV.get_term_id() !== undefined ? "<small>:" + NAV.get_term_id() + "</small>" : "")).append($('<h2>', { "id": "page_title" }).append(function () {
							// if(ontologies_data.ontology_title.link !== "") {
							// 	return $('<a>', {"href": ontologies_data.ontology_title.link, "target": "_blank"}).append(ontologies_data.ontology_title.title).append((NAV.get_term_id() !== undefined) ? NAV.get_term_label() : "");
							// } else {
							// 	return ontologies_data.ontology_title.title + ((page == "terms" && NAV.get_term_id() !== undefined) ? "<small>" + NAV.get_term_label() + "</small>" : "");
							// }
						})).append($('<table>', { "class": "responsive-table hide-on-small-only" }).append($('<thead>').append($('<tr>').append($('<th>').text("Ontology curators")).append($('<th>').text("Scientists")).append($('<th>', { "class": "center" }).text("Crop Lead Center")).append($('<th>', { "class": "center" }).text("Partners")).append($('<th>', { "class": "center" }).text("CGIAR research program")))).append($('<tbody>').append($('<td>').append(function () {
							if (ontologies_data.ontology_curators.length > 0 && ontologies_data.ontology_curators[0] !== "") {
								return $('<ul>', { "class": "browser-default" }).append($.map(ontologies_data.ontology_curators, function (v, k) {
									return $('<li>').append(v);
								}));
							}
						})).append($('<td>').append(function () {
							if (ontologies_data.scientists.length > 0 && ontologies_data.scientists[0] !== "") {
								return $('<ul>', { "class": "browser-default" }).append($.map(ontologies_data.scientists, function (v, k) {
									return $('<li>').append(v);
								}));
							}
						})).append($('<td>', { "class": "center" }).append(function () {
							if (ontologies_data.lead_centers.length > 0) {
								// 	console.info(v.image);
								return $('<div>').append($.map(ontologies_data.lead_centers, function (v, k) {
									if (v.image) {
										var image = !STR.is_url(v.image) ? "common/media/img/" + v.image : v.image;
										return $('<a>', { "href": v.link, "target": "_blank" }).append($('<img>', { "src": image }));
									}
								})).html();
							}
						})).append($('<td>', { "class": "center" }).append(function () {
							if (ontologies_data.partners.length > 0) {
								// 	console.info(v.image);
								return $('<div>').append($.map(ontologies_data.partners, function (v, k) {
									if (v.image) {
										var image = !STR.is_url(v.image) ? "common/media/img/" + v.image : v.image;
										return $('<a>', { "href": v.link, "target": "_blank" }).append($('<img>', { "src": "common/media/img/" + image }));
									}
								})).html();
							}
						})).append($('<td>', { "class": "center" }).append(function () {
							if (ontologies_data.cgiar_research_program.length > 0) {
								// 	console.info(v.image);
								return $('<div>').append($.map(ontologies_data.cgiar_research_program, function (v, k) {
									return $('<a>', { "href": v.link, "target": "_blank" }).append($('<img>', { "src": "common/media/img/" + v.image }));
								})).html();
							}
						})))));
					});

					DATA.get_ontology(NAV.get_ontology_id()).then(function (data) {
						LOADER.hide("#contents .progress");

						// Set Ontology languages
						var langs = STR.get_ontologies_languages(data.name);
						// Set the page name
						var page_name = STR.get_ontology_term(data.name);
						$(".page_name").text(page_name);
						// Reset the page title
						$("#page_title").html(page_name);

						$("#ontology_tree .languages_refresh select").append($.map(langs, function (lang) {
							return $('<option>', {
								"value": lang.toLowerCase(),
								"selected": lang.toLowerCase() == settings.general.language ? true : false
							}).text(lang);
						}))
						//.attr("disabled", (langs.length == 1))
						.material_select();

						TREEVIEW.add_items({
							item: "#treeview",
							source: data,
							term: '<tt>' + NAV.get_ontology_id() + "</tt> - " + STR.get_ontology_term(data.name),
							is_root: true,
							langs: langs
						});

						var permalink = "./ontology/" + NAV.get_ontology_id() + ":" + NAV.get_ontology_label(),
						    ext_permalink = "https://www.cropontology.org/terms/" + data.id + "/" + STR.get_ontology_term(data.name) + "/static-html?language=" + STR.get_ontology_term_language(data.name);

						// $("#term_permalink").attr("href", ext_permalink);
						$("#term_info_name").attr("href", permalink);
						$("#ontology_tree, #ontology_info").removeClass("disabled");
					});

					$("#contents").addClass("coloured grey lighten-5").find(".container").append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m6 l5" }).append($('<h6>').text("Traits, methods and scales")).append($('<div>', { "id": "ontology_tree", "class": "card z-depth-0 disabled" }).append($('<nav>').append($('<div>', { "class": "languages_refresh left" }).append($('<select>', { "name": "language" }))).append($('<ul>', { "class": "right" }).append($('<li>').append($('<a>', { "href": "#download_ontology_modal", "class": "modal-trigger" }).append($('<span>', { "class": "picol_arrow_full_down" })).append(" Download"))))).append($('<div>', { "id": "treeview_container", "class": "card-content" }).append($('<ul>', { "id": "treeview", "class": "treeview" }))))).append($('<div>', { "class": "col s12 m6 l7" }).append($('<h6>').text("Term information")).append($('<div>', { "id": "ontology_info", "class": "disabled" }).append($('<div>', { "class": "card z-depth-1 browser-content browser" }).append($('<nav>', { "class": "nav-extended" }).append($('<div>', { "class": "nav-content" }).append($('<ul>', { "class": "tabs" }).append(
					// Info tab
					$('<li>', { "id": "general", "class": "tab" }).append($('<a>', (_$ = { "href": "#page_info", "class": "active" }, _defineProperty(_$, "class", "tooltipped"), _defineProperty(_$, "data-tooltip", "General"), _defineProperty(_$, "data-position", "top"), _$)).append($('<span>', { "class": "hide-on-large-only fa fa-info-circle" })).append($('<span>', { "class": "hide-on-med-and-down text" }).text("General")))).append(
					// Variables tab
					$('<li>', { "id": "variables", "class": "tab disabled" }).append($('<a>', { "href": "#item_variables", "class": "tooltipped", "data-tooltip": "Variables", "data-position": "top" }).append($('<span>', { "class": "hide-on-large-only fa fa-code-branch" })).append($('<span>', { "class": "hide-on-med-and-down text" }).text("Variables")))).append(
					// Comments tab
					$('<li>', { "id": "new-comments", "class": "tab" }).append($('<a>', { "href": "#page_comments", "class": "tooltipped", "data-tooltip": "Comments", "data-position": "top" }).append($('<span>', { "class": "hide-on-large-only fa fa-comments" })).append($('<span>', { "class": "hide-on-med-and-down text" }).text("Comments")))))).append($('<div>', { "class": "filterbar nav-wrapper" }).append($('<ul>', { "class": "filters left" }).append($('<span>', { "class": "fa fa-link grey-text" })).append($('<li>', { "data-filter": "read" }).append($('<a>', {
						"href": "javascript:;",
						"id": "term_info_name",
						"class": "tooltipped",
						"data-tooltip": '<center>Permalink<br /><small>Click to refresh this page</small></center>'
					}).html($('<span>', { "class": "getting_data" }).text("Getting data...")))
					// ).append(
					// 	$('<li>', {"data-filter": "read"}).append(
					// 		$('<a>', {
					// 			"href": "javascript:;",
					// 			"target": "_blank",
					// 			"id": "term_permalink",
					// 			"class": "right tooltipped",
					// 			"data-tooltip": "Permalink"
					// 		}).append(
					// 			$('<span>', {"class": "fa fa-link"})
					// 		)
					// 	)
					)))).append($('<div>', { "id": "pages" }).append(
					// Info container
					$('<div>', { "id": "page_info", "class": "card-content" })).append(
					// Variables container
					$('<div>', { "id": "item_variables", "class": "card-content" })).append(
					// Comments container
					$('<div>', { "id": "page_comments", "class": "card-content" }).append($('<ul>', { "id": "comments", "class": "collection" }).hide()).append($('<div>', { "id": "comment_form" }).append(function () {
						if (DATA.get_user_logged()) {
							return $('<form>', { "method": "post", "action": "http://www.cropontology.org/add-comment" }).append($('<div>', { "class": "row" }).append($('<input>', { "type": "hidden", "name": "termId" }).val(page == "terms" ? NAV.get_term_id() : "")).append($('<input>', { "type": "hidden", "name": "ontologyId" }).val(NAV.get_ontology_id())).append($('<div>', { "class": "input-field col s12" }).append($("<textarea>", {
								"name": "comment",
								"class": "materialize-textarea",
								"id": "comment_input"
							})).append($('<label>', { "for": "comment_input" }).text("Add a comment"))).append($('<input>', { "type": "submit", "class": "btn btn-flat btn-highlight waves-effect waves-light right" }).val("Comment")));
						} else {
							return $('<center>').append($('<i>').append("Please ").append($('<a>', { "href": "#user_modal", "class": "modal-trigger" }).text("login")).append(" to comment"));
						}
					}))))).append($('<div>', { "id": "graph", "class": "card disabled" }).append($('<div>', { "id": "graph_content", "class": "valign-wrapper" }).append(
					// $('<h1>').html('<svg aria-hidden="true" data-prefix="fal" data-icon="chart-network" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-chart-network fa-w-20 fa-3x"><path fill="currentColor" d="M513.6 202.8l-19.2-25.6-48 36 19.2 25.6 48-36zM576 192c13.3 0 25.6-4 35.8-10.9 6.8-4.6 12.7-10.5 17.3-17.3C636 153.6 640 141.3 640 128c0-13.3-4-25.6-10.9-35.8-2.3-3.4-4.9-6.6-7.8-9.5-2.9-2.9-6.1-5.5-9.5-7.8C601.6 68 589.3 64 576 64s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C516 102.4 512 114.7 512 128c0 35.3 28.7 64 64 64zm0-96c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zM99.8 250.9C89.6 244 77.3 240 64 240s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C4 278.4 0 290.7 0 304c0 35.3 28.7 64 64 64s64-28.7 64-64c0-13.3-4-25.6-10.9-35.8-4.6-6.8-10.5-12.7-17.3-17.3zM64 336c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm88-16h48v-32h-48v32zm469.3 82.7c-2.9-2.9-6.1-5.5-9.5-7.8C601.6 388 589.3 384 576 384s-25.6 4-35.8 10.9c-3.3 2.2-6.3 4.7-9.1 7.5l-91.8-55.1c5.6-13.3 8.7-28 8.7-43.3 0-61.9-50.1-112-112-112-11.3 0-21.9 2.2-32.2 5.2l-39.3-84.1C278.8 101.4 288 83.9 288 64c0-13.3-4-25.6-10.9-35.8-4.6-6.8-10.5-12.7-17.3-17.3C249.6 4 237.3 0 224 0s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C164 38.4 160 50.7 160 64c0 35.3 28.7 64 64 64 4 0 7.9-.5 11.7-1.2l39 83.6c-30.5 20-50.7 54.4-50.7 93.6 0 61.9 50.1 112 112 112 35 0 65.8-16.4 86.4-41.5l92.4 55.4c-1.7 5.8-2.7 11.8-2.7 18.1 0 35.3 28.7 64 64 64 13.3 0 25.6-4 35.8-10.9 6.8-4.6 12.7-10.5 17.3-17.3C636 473.6 640 461.3 640 448c0-13.3-4-25.6-10.9-35.8-2.3-3.4-5-6.6-7.8-9.5zM224 96c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm112 288c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm240 96c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32z" class=""></path></svg>')
					$('<h1>').append($('<span>', { "class": "fab fa-hubspot fa-3x" }))))))));

					$("#contents").prepend(LOADER.create({ type: "progress" }));
					break;
				/**
     * 							Annotation Tool contents
     * -----------------------------------------------------------------
     */
				case "annotation-tool":
					// ANNOTATION_TOOL.layoout();
					require("./content_layouts/annotation_tool.es6");

					break;
			}
		}

		/**
   * Build the footer section
   */

	}, {
		key: "build_footer",
		value: function build_footer() {
			if (settings.general.footer.visible) {
				$("body").append($("<footer>", { "class": "parallax-container" }).append($("<div>", { "class": "parallax" }).append($("<img>", { "src": "common/media/img/" + settings.general.footer.background }))).append($("<div>", { "class": "row" }).append($("<div>", { "class": "col s12 m12 l3 xl2" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "class": "responsive-img", "src": "common/media/img/" + settings.general.footer.logo }))).append($('<p>', { "class": "description" }).html(settings.general.footer.description))).append($("<div>", { "id": "left_menu", "class": "col s12 m4 l2 offset-l1 offset-xl1" })).append($("<div>", { "id": "center_menu", "class": "col s12 m4 l3" })).append($("<div>", { "id": "right_menu", "class": "col s12 m4 l3 offset-xl1" })))).append($('<section>', { "id": "bottom_links" }).append($('<div>', { "class": "row container" }).append($('<div>', { "id": "", "class": "col s12 m12 l8 xl8 left" })).append($('<div>', { "id": "owner", "class": "col s12 m12 l4 xl4 right right-align" })))).append($('<center>', { "class": "license" }).append($('<p>').html(settings.general.license.text)));
			}

			/**
    * Build the footer menu
    * @uses build_menu()
    */
			this.build_menu("footer_menu");

			/**
   * Build the bottom links menu
   * @uses build_menu()
   */
			this.build_menu("bottom_links");
			// this.build_menu("owner");
		}
	}, {
		key: "load_scripts",
		value: function load_scripts() {
			switch (page) {
				case "add-ontology":
					$("head").append("<!-- Main style -->").append($('<link>', { "rel": "stylesheet", "href": "dist/css/jquery.treeview.css", "type": "text/css", "media": "screen" }));
					break;
				case "ontology":
				case "terms":
					$("head").append("<!-- Main style -->").append($('<link>', { "rel": "stylesheet", "href": "dist/css/jquery.treeview.css", "type": "text/css", "media": "screen" }));

					$("#scripts").append("<!-- Fullscreen feature -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/jq-fullscreen/release/jquery.fullscreen.min.js" })).append("<!--  The Raphael JavaScript library for vector graphics display  -->").append($('<script>', { "type": "text/javascript", "src": "dist/js/raphael-min.js" })).append("<!--  Dracula  -->").append("<!--  An extension of Raphael for connecting shapes -->").append($('<script>', { "type": "text/javascript", "src": "dist/js/dracula_graffle.js" })).append("<!--  Graphs  -->").append($('<script>', { "type": "text/javascript", "src": "dist/js/dracula_graph.js" })).append($('<script>', { "type": "text/javascript", "src": "dist/js/dracula_algorithms.js" }));
					break;
				case "annotation-tool":
					$("head").append("<!-- Materialize Stepper -->").append($('<link>', { "rel": "stylesheet", "href": "dist/css/mstepper.css", "type": "text/css", "media": "screen" }));

					$("#scripts").append(
					// 	"<!-- Poshy Tip -->"
					// ).append(
					// 	$('<script>', {"type": "text/javascript", "src": "dist/js/jquery.poshytip.js"})
					// ).append(
					"<!-- Materialize Stepper -->").append($('<script>', { "type": "text/javascript", "src": "dist/js/mstepper.min.js" })).append("<!-- SheetJS/js-xlsx -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/js-xlsx/dist/xlsx.core.min.js" })).append($('<script>', { "type": "text/javascript", "src": "bower_components/js-xlsx/dist/cpexcel.js" })).append($('<script>', { "type": "text/javascript", "src": "bower_components/js-xlsx/dist/ods.js" })).append("<!-- nodeca/mimoza -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/mimoza/dist/mimoza.min.js" })).append("<!-- mholt/PapaParse -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/papaparse/papaparse.min.js" })).append("<!-- Fullscreen feature -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/jq-fullscreen/release/jquery.fullscreen.min.js" }));
					break;
				case "register":
					$("#scripts").append("<!-- jquery-validation -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/jquery-validation/dist/jquery.validate.min.js" })).append("<!-- Google reCAPTCHA -->").append($('<script>', { "type": "text/javascript", "src": "https://www.google.com/recaptcha/api.js" }));
					break;
			}
		}
	}]);

	return layout;
}();

exports.default = layout;
