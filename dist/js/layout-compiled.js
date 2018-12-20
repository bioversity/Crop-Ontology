"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/js/data.es6");

var _data2 = _interopRequireDefault(_data);

var _navigation = require("../../src/js/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

var _pagination = require("../../src/js/pagination.es6");

var _pagination2 = _interopRequireDefault(_pagination);

var _filters = require("../../src/js/filters.es6");

var _filters2 = _interopRequireDefault(_filters);

var _modals = require("../../src/js/modals.es6");

var _modals2 = _interopRequireDefault(_modals);

var _str = require("../../src/js/_str.es6");

var _str2 = _interopRequireDefault(_str);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Static pages
*/
var page_about = "<p>The Crop Ontology project is the creation of the Generation Challenge Programme (GCP, <a href=\"http://www.generationcp.org/\">http://www.generationcp.org/</a> ), which understood from its inception the importance of controlled vocabularies and ontologies for the digital annotation of data.  In ontologies, terms bear a particular, logically defined relationship to each other, allowing computational reasoning on data annotated with a structured vocabulary. The volume of agriculture-related information and terminology related to phenotype, breeding, germplasm, pedigree, traits, among others, is increasing exponentially. In order to facilitate access to the data held within and/or across the databases, GCP initiated the development of Trait Dictionaries for breeders' fieldbooks and a Crop Ontology (CO) to facilitate the harmonization of the data capture and powerful manipulations of the data through ontology-driven queries. This is a development that raised interest in CGIAR Centres and other communities, like the Gramene team developing the Plant Trait Ontology, ecologists and semantic web developers holding vast quantities of agriculture-related data. The project will continue the incremental validation and refinement of the Crop Ontology, which involves adding methods of trait measurement and experiments to enable the mapping of ontology terms onto measured, stored or published variables.The Crop Ontology is a key element of the Integrated Breeding Platform <a href=\"https://www.integratedbreeding.net/\">https://www.integratedbreeding.net/</a></p>\n<a href=\"http://www.generationcp.org/\" ><img src=\"common/img/gcp-logo.png?{{>VERSION}}\" /></a>\n\n<h2>About the Crop Ontology</h2>\n\n<p>The Crop Ontology (CO) current objective is to compile validated concepts along with their inter-relationships on anatomy, structure and phenotype of Crops, on trait measurement and methods as well as on Germplasm with the multi-crop passport terms. The concepts of the CO are being used to curate agronomic databases and describe the data. The use of ontology terms to describe agronomic phenotypes and the accurate mapping of these descriptions into databases is important in comparative phenotypic and genotypic studies across species and gene-discovery experiments as it provides harmonized description of the data and therefore facilitates the retrieval of information.  Development of crop-specific trait ontologies and the germplasm ontologies began in 2008 for chickpea, maize, <em>Musa</em>, potato, rice and wheat, and in 2010 for cassava. The GCP Crop Ontology is a global public good, available to be used freely by all. </p>\n\n<h2>About the tool</h2>\n\n<p>This curation and annotation web site is a participatory tool that enables you to browse the Crop Ontology, search for specific terms and access the definition, as well as additional information. It is possible to post a suggestion at the level of a term and provide feedback on your experience using the site. Please, consult the video tutorials to get a visual explanation of the web site use.</p>\n\n<p>The Ontology curators are able to upload a full ontology in OBO format, create it online, add attribute information, and submit or delete terms from the Crop Ontology. Researchers can also submit/deposit trait names using the curation/annotation tool &lsquo;add an ontology&rsquo; to increment the tool&rsquo;s capacity. </p>\n\n<p>All lists can be downloaded and a web service API is available. The site is hosted on <a href=\"http://code.google.com/appengine\">Google App Engine</a> and the versioned code is hosted on <a href=\"https://github.com/bioversity/Crop-Ontology\">GitHub</a>.</p>\n\n<p>The tool is still under development, so your feedback will help to improve it. Please provide any comments or suggestions using the &lsquo;Feedback&rsquo; button.</p>\n\n<p>This work was greatly inspired by the Crop Ontology Look-up service developed by Martin Senger, consultant in Bioinformatics, and by Terminizer, online annotation tool developed by David Hancock, from the University of Manchester. </p>\n\n<p>Citation:\n&ldquo;Crop Ontology curation and annotation tool &ndash; 2011 Generation Challenge Programme, Bioversity International as project implementing agency.&rdquo;</p>\n<!--\n<h2>Project partners in 2012</h2>\n\n<p>This work is primarily coordinated and undertaken by the lead institution, Bioversity International (hereafter referred to as Bioversity), and coordinated by Elizabeth Arnaud. Rosemary Shrestha (CIMMYT, Mexico) coordinates the CO community and its implementation in crop-specific databases.</p>\n\n<p>\nPrincipal Investigator &ndash; Elizabeth Arnaud (Bioversity International)\n</p>\n\n<p>\nCurators of the Crop-specific Ontology in 2012\n</p>\n\n<ul>\n<li>Barley - Flavio Capettini (ICARDA)</li>\n<li>Cassava - Bakare Moshood Agba  (IITA) </li>\n<li>Common Beans - Fabio Alberto Gerrera (CIAT)</li>\n<li>Chikpea and Groundnut, Sorghum and pigeon pea - Prasad Peteti, Praveen Reddy, Suyash Pati (ICRISAT)</li>\n<li>Cowpea - Sam Ofodile , Ousmane Boukare (IITA)</li>\n<li>Rice - Nikki Frances Borja (IRRI)</li>\n<li>Potato - Reinhard Simon (CIP)</li>\n<li>Maize and Wheat - Rosemary Shrestha (CIMMYT) - Global Ontology Coordinator until 2011/li>\n</ul>\n\n<p>\nScientists coordinating or actively contributing to the development of crop specific Trait Dictionaries and ontologies:\n</p>\n<ul>\n<li>Bioversity - Inge van den Bergh</li>\n<li>CIRAD - Jean FRancois Rami</li>\n<li>ICARDA - Sanjaya Gyawali,</li> Adnan al-Yassin, Mohamad Maatougui, S. Rajaram., Ahmed Amri, Fawzy Nawar</li>\n<li>ICRISAT - Trushar Shah, Eva Wietzel, Tom Hash</li>\n<li>IITA - Ousmane Boukare, Peter Kulakow, Antonio Lopes Montez </li>\n<li>CIAT - Steve Beebe, Rowland Chirwa</li>\n<li>IRRI- Mauleon Ramil, Ruaraidh Sackville Hamilton</li>\n\n<li>and the Crop Communities of Practice </li>\n</ul>\n\n<p><strong>Acknowledgements to</strong>: Adriana Alercia, (Bioversity International, Crop descriptors specialist), Richard Bruskiewich (GCP Bioinformatics, former project Principle Investigator, IRRI), Guy Davenport (GCP bioinformatics, CIMMYT), Graham McLaren (GCP sub-programme on Crop information system, Leader), Martin SENGER (GCP Bioinformatics, formerly IRRI)</p>\n-->\n<h3>Articles</h3>\n<p>2012 - Shrestha Rosemary, Matteis Luca, Skofic Milko, Portugal Arlett, McLaren Graham, Hyman Glenn, Arnaud Elizabeth    - Bridging the phenotypic and genetic data useful for integrated breeding through a data annotation using the Crop Ontology developed by the crop communities of practice , in Frontiers in Physiology , vol.3, no.0326 <a href=\"http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326\"> URL=http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326</a></p>\n<p>2012 - Elizabeth Arnaud, Laurel Cooper, Rosemary Shrestha, Naama Menda, Rex T. Nelson, Luca Matteis, Milko Skofic, Ruth Bastow, Pankaj Jaiswal, Lukas Mueller, Graham McLaren:  Towards a Reference Plant Trait Ontology For Modeling Knowledge of Plant Traits and Phenotypes in: proceedings of the 4th Conference on Knowledge Engineering and Ontology Development, 4-7 October 2012 , Spain.</p>\n<p>2010 - Rosemary Shrestha, Elizabeth Arnaud, Ramil Mauleon, Martin Senger, Guy F. Davenport, David Hancock, Norman Morrison, Richard Bruskiewich, and Graham McLaren - <strong>Multifunctional crop trait ontology for breeders' data: field book, annotation, data discovery and semantic enrichment of the literature</strong>, AoB PLANTS (2010) Vol. 2010 first published online May 27, 2010 doi:10.1093/aobpla/plq008  - <a href=\"http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008\">http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008</a></p>\n\n<h3>Book chapter</h3>\n<p>2011 - Shrestha Rosemary, Guy F Davenport, Richard Bruskiewich and Elizabeth Arnaud in : Monneveux Philippe and Ribaut Jean-Marcel, eds (2011). Drought phenotyping in crops: from theory to practice CGIAR Generation Challenge Programme, Texcoco, Mexico. ISBN: 978-970-648-178-8. 475pp. Chapter is: Development of crop ontology for sharing crop phenotypic information .</p>\n\n<h2>Posters</h2>\n\n<style>\n.posters a img {\n  border: 1px solid #ddd;\n  vertical-align: top;\n  margin-right: 20px;\n}\n</style>\n\n<p class=\"posters\">\n  <a href=\"common/media/pdf/GRM_poster_Curation_annotation_tools.pdf\"><img src=\"common/img/posters/GRM_poster_Curation_annotation_tools.png\" /></a>\n  <a href=\"common/media/pdf/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.pdf\"><img src=\"common/img/posters/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.png\" /></a>\n  <a href=\"common/media/pdf/Poster_GCP_GRM_Musa.pdf\"><img src=\"common/img/posters/Poster_GCP_GRM_Musa.png\" /></a>\n  <a href=\"common/media/pdf/biocuration2012-poster.pdf\"><img src=\"common/img/posters/biocuration_thumb.png\" /></a>\n</p>\n";
var page_api = "<style>\nli {\n    margin-left: 15px;\n    list-style: none;\n}\n.api_left h2 {\n    margin-top: 30px !important;\n    padding-top: 30px !important;\n    color: #f28021 !important;\n}\n</style>\n<script>\n\n$(function(){\n\n    // replaces API urls for examples\n    $(\".example\").each(function() {\n        var $this = $(this);\n\n        var url = $this.parent().siblings().first().find(\"code\").text();\n\n        var parameters = url.match(/{(.*?)}/g);\n\n        if(parameters) {\n            for(var i=0; i<parameters.length; i++) {\n                var par = parameters[i];\n                var clean = par.substring(1, par.length-1);\n                url = url.replace(par, $this.attr(clean));\n            }\n        }\n\n        $this.html(\"<a href='\"+url+\"' target='_blank'>\"+url+\"</a>\");\n\n    });\n\n});\n\n</script>\n\n<div class=\"api_left\">\n\n<p>\nThis is the official API for the Ontology Curation Tool. It allows you to programmatically retrieve and interact with Ontology data.\n</p>\n<p>\nTo let us gather feedback you can leave a comment using the form on the right.\n</p>\n<h2>Statistics on collected ontologies</h2>\n<li><strong>URL:</strong> <a target=\"_blank\" href=\"http://www.cropontology.org/ontos_stats\">http://www.cropontology.org/ontos_stats</a></li>\n<li><strong>Returns:</strong> JSON object with statistics about collected ontologies</li>\n\n<h2>API Data Types</h2>\n<p>\nData can be requested in JSON.<br> API calls follow the <a href=\"http://en.wikipedia.org/wiki/Create,_read,_update_and_delete\">CRUD</a> semantics: create, retrieve, update and delete.\n</p>\n\n<!--\n<h2>Retrieve all traits given an Ontology Name</h2>\n<ul>\n    <li>Here's a little code snippet written in <b>PHP</b> to show you how you can leverage this API to retrieve all the traits of a specific Ontology: <a href=\"https://gist.github.com/1322511\">https://gist.github.com/1322511</a></li>\n</ul>\n-->\n<h2>JSON DUMP</h2>\n<ul>\n    <li><strong>URL:</strong> <a target=\"_blank\" href=\"https://github.com/bioversity/Crop-Ontology/blob/master/public/dump.json\">https://github.com/bioversity/Crop-Ontology/blob/master/public/dump.json</a></li>\n    <li><strong>Returns:</strong> JSON array of *raw* objects inside database</li>\n</ul>\n\n<h2>Search Terms</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/search?q={query}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects matching the search query - each object being a term</li>\n    <li><strong>Example:</strong> <span class=\"example\" query=\"stem rust\"></span></li>\n</ul>\n\n<h2>Retrieve all Ontologies</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontologies</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> JSON Hierarchy of the Ontologies under each category</li>\n    <li><strong>Example:</strong> <span class=\"example\"></span></li>\n</ul>\n<h2>Retrieve a specific Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology/{ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n\t<li><strong>Returns:</strong> JSON representation of the ontology. </br><span style=\"font-style:italic;\">NB: This call does not retrieve the variables that are present in TD template v5 (and in the OBO files derived from the TDv5)</span></li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_334\"></span></li>\n</ul>\n<h2>Retrieve Ontology ID by its Name</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology-id?ontology_name={ontology_name}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> ID of the ontology, to be used with <code>/get-ontology-roots/{id}</code></li>\n    <li><strong>Example:</strong> <span class=\"example\" ontology_name=\"cassava\"></span></li>\n</ul>\n\n<h2>Retrieve Categories</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-categories</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of strings - string being the name of the category that you pass to the <code>/ontologies</code> API call</li>\n    <li><strong>Example:</strong> <span class=\"example\"></span></li>\n</ul>\n\n<h2>Retrieve Ontologies By Category</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/ontologies?category={category}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects; each one representing an ontology</li>\n    <li><strong>Example:</strong> <span class=\"example\" category=\"010-089 General Germplasm Ontology\"></span></li>\n</ul>\n\n<a name=\"rdf\"></a>\n<h2>Retrieve Terms in RDF</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/rdf/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> XML related RDF</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve Root Terms of an Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology-roots/{ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects; each one representing a term</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_020\"></span></li>\n</ul>\n\n<h2>Retrieve Child Terms of parent Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-children/{parentId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of terms</li>\n    <li><strong>Example:</strong> <span class=\"example\" parentId=\"CO_020:0000000\"></span></li>\n</ul>\n<h2>Retrieve Parents of Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-term-parents/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of the paths from the parent to child</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_020:0000000\"></span></li>\n</ul>\n\n<h2>Retrieve Properties/Attributes of a Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-attributes/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects representing the terms property</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve Comments of a Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-comments?termId={termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects representing a comment</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Login - Retrieve a user's auth token (used for adding and editing ontologies)</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/login</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {username}, {password}</li>\n    <li><strong>Returns:</strong> HTTP response with a <code>user</code> cookie in the header that contains a <code>token</code>. You'll need to pass this cookie to subsequent requests that require authentication</li>\n</ul>\n\n<h2>Retrieve Logged-in User information</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/login</code></li>\n    <li><strong>Method:</strong> <code>GET</code>. Pass <code>user</code> cookie in request</li>\n    <li><strong>Returns:</strong> Object of the currently logged in user</li>\n</ul>\n\n<h2>Create Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/add-ontology</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. Pass <code>user</code> cookie in request. {json} a JSON string representing a list of objects; each object being a term. {ontology_name}, {ontology_id}, {ontology_summary}</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n\n<!--\n<h2>Create Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/create-term</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {jsonTerm} a JSON representation of the term. You can call this method as many times as you need to build the structure of an ontology. Example: <code>{\"ontology_id: \"CO_22\", \"ontology_name\": \"Sorghum Trait\", \"parent\": \"CO_222:1122\" ...}</code>. As you can see the <strong>parent</strong> property describes the relationship between terms. If parent is <i>null</i> then the term is a ROOT term</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n-->\n\n<h2>Delete Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/delete-ontology</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {ontologyID}</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n\n<h2>Retrieve IB Fieldbook Default List</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/default-list/?ontologyId={ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> JSON of the default list of traits, methods and scales of an ontology ID</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_334\"></span></li>\n</ul>\n\n<h2>Retrieve Term Information</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-term/?id={termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Object representing a term information. Can be used to update the information of a given term when it is updated</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve all Comments from an Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-comments-onto/?ontoId={ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> a JSON object that lists the comments and the details about the comments' authors. Comments are grouped by terms</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_321\"></span></li>\n</ul>\n\n</div><!-- /api_left -->\n<div class=\"api_right\" style=\"margin-top:40px\">\n    <div id=\"disqus_thread\"></div>\n    <script type=\"text/javascript\">\n        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n        var disqus_shortname = 'cropontologycurationtool'; // required: replace example with your forum shortname\n\n        // The following are highly recommended additional parameters. Remove the slashes in front to use.\n        // var disqus_identifier = 'unique_dynamic_id_1234';\n        // var disqus_url = 'http://example.com/permalink-to-page.html';\n\n        /* * * DON'T EDIT BELOW THIS LINE * * */\n        (function() {\n            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n            dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';\n            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n        })();\n    </script>\n    <noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>\n</div><!-- //api_right -->\n";
var page_help = "\n<h2>Video Tutorials</h2>\n<style type=\"text/css\"> \n    \n \n    \n \n#ytvideo,\n#ytvideo2 {\n    float: left;\n    margin-right:10px;\n}\n \n \n.yt_holder {\n    background: #f3f3f3;\n    padding: 10px;\n    float: left;\n    border: 1px solid #e3e3e3;\n    margin-bottom:15px;\n}\n \n \nul {\n    float: left;\n    margin: 0;\n    padding: 0;\n    width: 220px;\n}\n \nul li {\n    list-style-type: none;\n    display:block;\n    background: #f1f1f1;\n    float: left;\n    width: 216px;\n    margin-bottom: 5px;\n    padding:2px;\n \n}\n \nul li img {\n    width: 120px;\n    float: left;\n    margin-right: 5px;\n    border: 1px solid #999;\n}\n \nul li a {\n    text-decoration: none;\n    display: block;\n    color: #000;\n}\n \n.currentvideo {\n    background: #e6e6e6;\n}\n    \n \n    \n</style> \n<script>\n//-------------------------------------------------\n//      youtube playlist jquery plugin\n//      Created by dan@geckonm.com\n//      www.geckonewmedia.com\n//\n//      v1.1 - updated to allow fullscreen \n//           - thanks Ashraf for the request\n//-------------------------------------------------\n\njQuery.fn.ytplaylist = function(options) {\n \n  // default settings\n  var options = jQuery.extend( {\n    holderId: 'ytvideo',\n    playerHeight: '300',\n    playerWidth: '450',\n    addThumbs: false,\n    thumbSize: 'small',\n    showInline: false,\n    autoPlay: true,\n    showRelated: true,\n    allowFullScreen: false\n  },options);\n \n  return this.each(function() {\n                            \n        var selector = $(this);\n        \n        var autoPlay = \"\", autoHide = \"\", hd = \"\", modestBranding = \"\", showInfo = \"&showinfo=0\";\n        var showRelated = \"&rel=0\";\n        var fullScreen = \"\";\n        if(options.autoPlay) autoPlay = \"&autoplay=1\"; \n        if(options.showRelated) showRelated = \"&rel=1\"; \n        if(options.allowFullScreen) fullScreen = \"&fs=1\"; \n        if(options.autoHide) autoHide = \"&autohide=1\";\n        if(options.hd) hd = \"&hd=1\";\n        if(options.modestBranding) modestBranding = \"&modestbranding=1\";\n        if(options.showInfo) showInfo = \"&showinfo=1\";\n\n        var params = autoPlay+showRelated+fullScreen+autoHide+hd+modestBranding+showInfo;\n        \n        //throw a youtube player in\n        function play(id)\n        {\n           var html  = '';\n    \n           html += '<object height=\"'+options.playerHeight+'\" width=\"'+options.playerWidth+'\">';\n           html += '<param name=\"movie\" value=\"http://www.youtube.com/v/'+id+params+'\"> </param>';\n           html += '<param name=\"wmode\" value=\"transparent\"> </param>';\n           if(options.allowFullScreen) { \n                html += '<param name=\"allowfullscreen\" value=\"true\"> </param>'; \n           }\n           html += '<embed src=\"http://www.youtube.com/v/'+id+params+'\"';\n           if(options.allowFullScreen) { \n                html += ' allowfullscreen=\"true\" '; \n            }\n           html += 'type=\"application/x-shockwave-flash\" wmode=\"transparent\"  height=\"'+options.playerHeight+'\" width=\"'+options.playerWidth+'\"></embed>';\n           html += '</object>';\n            \n           return html;\n           \n        };\n        \n        \n        //grab a youtube id from a (clean, no querystring) url (thanks to http://jquery-howto.blogspot.com/2009/05/jyoutube-jquery-youtube-thumbnail.html)\n        function youtubeid(url) {\n            var ytid = url.match(\"[\\\\?&]v=([^&#]*)\");\n            ytid = ytid[1];\n            return ytid;\n        };\n        \n        \n        //load inital video\n        var firstVid = selector.children(\"li:first-child\").addClass(\"currentvideo\").children(\"a\").attr(\"href\");\n        $(\"#\"+options.holderId+\"\").html(play(youtubeid(firstVid)));\n        \n        //load video on request\n        selector.children(\"li\").children(\"a\").click(function() {\n            \n            if(options.showInline) {\n                $(\"li.currentvideo\").removeClass(\"currentvideo\");\n                $(this).parent(\"li\").addClass(\"currentvideo\").html(play(youtubeid($(this).attr(\"href\"))));\n            }\n            else {\n                $(\"#\"+options.holderId+\"\").html(play(youtubeid($(this).attr(\"href\"))));\n                $(this).parent().parent(\"ul\").find(\"li.currentvideo\").removeClass(\"currentvideo\");\n                $(this).parent(\"li\").addClass(\"currentvideo\");\n            }\n                                                             \n            \n            \n            return false;\n        });\n        \n        //do we want thumns with that?\n        if(options.addThumbs) {\n            \n            selector.children().each(function(i){\n                                              \n                var replacedText = $(this).text();\n                \n                if(options.thumbSize == 'small') {\n                    var thumbUrl = \"http://img.youtube.com/vi/\"+youtubeid($(this).children(\"a\").attr(\"href\"))+\"/2.jpg\";\n                }\n                else {\n                    var thumbUrl = \"http://img.youtube.com/vi/\"+youtubeid($(this).children(\"a\").attr(\"href\"))+\"/0.jpg\";\n                }\n                \n                \n                $(this).children(\"a\").empty().html(\"<img src='\"+thumbUrl+\"' alt='\"+replacedText+\"' />\"+replacedText).attr(\"title\", replacedText);\n                \n            }); \n            \n        }\n            \n        \n   \n  });\n \n};\n\n</script>\n\n<script type=\"text/ecmascript\"> \n    \n        $(function() {\n            $(\"ul.demo2\").ytplaylist({\n                addThumbs:true, \n                autoPlay: false, \n                holderId: 'ytvideo2',\n                playerWidth: 660,\n                playerHeight: 500,\n                autoHide: true,\n                allowFullScreen: true,\n                hd: true,\n                modestBranding: true,\n                showRelated: false\n\n            });\n        });\n    \n</script> \n <div class=\"yt_holder\"> \n    <div id=\"ytvideo2\"></div> \n    <ul class=\"demo2\"> \n        <li><a href=\"http://www.youtube.com/watch?v=ani1SWy1N-g\">Homepage Navigation</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=GiADgYlwmGI\">Login & Registration</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=E67xYagMYe0\">Search</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=-5j7AeuFT1A\">OBO Upload</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=HMaQgKPrpwo\">Create New Ontology</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=-aLr_E-JuSM\">API & Feedback</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=TLo4GpuXHn4\">General Navigation</a></li> \n    </ul> \n</div>\n\n";
var page_login = "\n<form method=\"post\" id=\"login_form\" action=\"http://www.cropontology.org/login\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col s6 offset-s2\">\n                <div class=\"context-loader\" style=\"display: none; top:0px;\">Sending Request...</div>\n                <div class=\"error_box\" style=\"display: none;\">Incorrect login or password.</div>\n                <h1>Login</h1>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"text\" value=\"\" tabindex=\"1\" name=\"username\" id=\"log_username\" class=\"text\">\n                <label for=\"log_username\">Username</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"password\" value=\"\" tabindex=\"2\" name=\"password\" id=\"log_password\" class=\"text\">\n                <label for=\"log_password\">Password</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <a href=\"./forgot-password\">Forgot Password?</a>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"submit\" value=\"Log in\" tabindex=\"3\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_register = "\n<form method=\"post\" id=\"register_form\" action=\"http://www.cropontology.org/\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col s6 offset-s2\">\n                <div class=\"context-loader\" style=\"display: none; top:0px;\">Sending Request...</div>\n                <div class=\"error_box\" style=\"display: none;\">Incorrect login or password.</div>\n                <h1>Register</h1>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s4 offset-s2\">\n                <input type=\"text\" value=\"\" tabindex=\"1\" name=\"username\" id=\"reg_username\" class=\"text\">\n                <label for=\"reg_username\">Username</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"email\" value=\"\" tabindex=\"2\" style=\"width: 21em;\" name=\"email\" id=\"reg_email\" class=\"text\">\n                <label for=\"reg_email\">Please enter your Email</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s4 offset-s2\">\n                <input type=\"password\" value=\"\" tabindex=\"3\" name=\"password\" id=\"reg_password\" class=\"text\">\n                <label for=\"reg_password\">Password</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s3 offset-s2\">\n                <input type=\"text\" value=\"\" tabindex=\"4\" name=\"first_name\" id=\"reg_name\" class=\"text\">\n                <label for=\"reg_name\">First name</label>\n            </div>\n            <div class=\"input-field col s3\">\n                <input type=\"text\" value=\"\" tabindex=\"5\" name=\"sirname\" id=\"reg_lastname\" class=\"text\">\n                <label for=\"reg_lastname\">Last name</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"text\" value=\"\" tabindex=\"6\" name=\"institution\" id=\"reg_institution\" class=\"text\">\n                <label for=\"reg_institution\">Host institution</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"submit\" value=\"Register\" tabindex=\"7\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_forgot_password = "\n<form method=\"post\" id=\"login_form\" action=\"http://www.cropontology.org/forgot-password\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col s6 offset-s2\">\n                <h1>Forgot Password?</h1>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"email\" value=\"\" tabindex=\"1\" style=\"width: 21em;\" name=\"email\" id=\"email\" class=\"text\">\n                <label for=\"email\">Please enter your Email</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"submit\" value=\"Recover\" tabindex=\"3\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_feedback = "    <div id=\"disqus_thread\"></div>\n    <script type=\"text/javascript\">\n        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n        var disqus_shortname = 'cropontologycurationtool'; // required: replace example with your forum shortname\n\n        // The following are highly recommended additional parameters. Remove the slashes in front to use.\n        // var disqus_identifier = 'unique_dynamic_id_1234';\n        // var disqus_url = 'http://example.com/permalink-to-page.html';\n\n        /* * * DON'T EDIT BELOW THIS LINE * * */\n        (function() {\n            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n            dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';\n            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n        })();\n    </script>\n    <noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>\n";
var page_add_ontology = "<!-- <script type=\"text/javascript\" src=\"http://www.cropontology.org/js/add.js\"></script> -->\n\n<h1>Add Ontology</h1>\n<div class=\"row\">\n    <div class=\"col s12\">\n        <ul class=\"tabs\">\n            <li class=\"tab col s4\"><a class=\"active\" href=\"#upload_excel\">Upload Excel Trait Template</a></li>\n            <li class=\"tab col s4\"><a href=\"#upload_obo\">Upload an OBO File</a></li>\n            <li class=\"tab col s4\"><a href=\"#create_ontology\">Create an Ontology</a></li>\n        </ul>\n    </div>\n\n    <div id=\"upload_excel\" class=\"col s12\">\n        <div class=\"tab-content\">\n            <div id=\"upload_excel_cont\" style=\"display: block;\">\n                <p><b>Note:</b> be sure your template is structured exactly like the latest standard Trait Template which can be found here: <a href=\"/TD_template_v5.xls\">Trait Dictionary template version 5</a></p>\n\n                <div class=\"container\">\n                    <form action=\"http://www.cropontology.org/_ah/upload/AMmfu6a1eYV4CYvzrvEcawtsLnaD6RsCSPKXE3XH0KApNyrrVgiZDpwsHr29BvURxfLyWenQKKv4lvoCPw8ZMWhKRF2JJxGHh7bG7B7hQZdJNxu21m0HG4l7OCQmR3nEnfuZDWImA1rmAeOIOBLYQNNLTmw_4NNfl5fYGZQ2hV814SRsR20Dhfy9_gC5fAy-szjFSjVwOkWClmyyJNyPzfyLo34juhn_bEeZAF2mdHe6KAKPdqtDRNGLkDomtIG2yPKOQtHTITtbtmzFJtMAvIQbsFJX1O-l3w/ALBNUaYAAAAAXBjRYyQntu0Z_pC_qhEG5S6ssJ-jJtoU/\" method=\"post\" enctype=\"multipart/form-data\" target=\"excel_upload_iframe\">\n                        <div class=\"row\">\n                            <div class=\"input-field col s8\">\n                                Category:\n                                <select name=\"category\">\n                                    <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                    <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                    <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                    <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                    <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                    <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option><option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option><option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                </select>\n                            </div>\n                            <div class=\"input-field col s5\">\n                                <input type=\"text\" name=\"ontology_id\" id=\"ontology_id\">\n                                <label for=\"ontology_id\">Ontology ID</label>\n                            </div>\n                            <div class=\"input-field col s7\">\n                                <input type=\"text\" name=\"ontology_name\" id=\"ontology_name\">\n                                <label for=\"ontology_name\">Ontology Name</label>\n                            </div>\n                            <div class=\"input-field col s10\">\n                                <textarea class=\"materialize-textarea\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea>\n                                <label for=\"ontology_summary\">Ontology Summary</label>\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"input-field col s8\">\n                                <div class=\"file-field input-field\">\n                                    <div class=\"btn btn-flat highlight-btn\">\n                                        <span>Browse...</span>\n                                        <input name=\"excelfile\" type=\"file\">\n                                    </div>\n                                    <div class=\"file-path-wrapper\">\n                                        <input class=\"file-path validate\" type=\"text\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"input-field col s12\">\n                                <input class=\"btn btn-flat right\" type=\"submit\" value=\"Upload Excel\">\n                            </div>\n                        </div>\n                    </form>\n                    <iframe name=\"excel_upload_iframe\" style=\"display: none\"></iframe>\n                </div>\n            </div>\n        </div>\n    </div>\n\n\n    <div id=\"upload_obo\" class=\"col s12\">\n        <div class=\"tab-content\">\n            <div id=\"upload_obo_cont\" style=\"display: block;\">\n                <div class=\"container\">\n                    <form action=\"http://www.cropontology.org/_ah/upload/AMmfu6bl0ADuyfF6yRKROyXN3tj11FUWSGHPqetqOwIM9kF0sEvq0lnGaxAAN0XkaaOoqAzHPr3EHziY6i3aLLT2NAXLMQA0iUsq_kXMYdTLnF6lWVHyJfpIM1ZDu8K7tquXmOEYAHFw15zrTV5uh_Z3PUi5Jt_KioKcoUudS4ZpwGCTbBPJLfSxBcny_pA_H4fBrw0zUTrN9xlcx416PNFq72K4opFo5VY1GwtvzqzkUG-pIXjtSyoPIuSLqd_UQnHFpKCP71VV/ALBNUaYAAAAAXBjRY5Re_rSvfiDUUBOgLbdYphczz4nQ/\" method=\"post\" enctype=\"multipart/form-data\" target=\"obo_upload_iframe\">\n                        <div class=\"row\">\n                            <div class=\"input-field col s8\">\n                                Category:\n                                <select name=\"category\">\n                                    <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                    <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                    <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                    <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                    <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                    <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option>\n                                    <option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option>\n                                    <option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                </select>\n                            </div>\n                            <div class=\"input-field col s5\">\n                                <input type=\"text\" name=\"ontology_name\" id=\"ontology_name\">\n                                <label for=\"ontology_name\">Ontology Name</label>\n                            </div>\n                            <div class=\"input-field col s10\">\n                                <textarea class=\"materialize-textarea\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea>\n                                <label for=\"ontology_summary\">Ontology Summary</label>\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"input-field col s8\">\n                                <div class=\"file-field input-field\">\n                                    <div class=\"btn btn-flat highlight-btn\">\n                                        <span>Browse...</span>\n                                        <input name=\"obofile\" type=\"file\">\n                                    </div>\n                                    <div class=\"file-path-wrapper\">\n                                        <input class=\"file-path validate\" type=\"text\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"input-field col s12\">\n                                <input class=\"btn btn-flat right\" type=\"submit\" value=\"Upload OBO\">\n                            </div>\n                        </div>\n                    </form>\n                    <iframe name=\"obo_upload_iframe\" style=\"display: none\"></iframe>\n                </div>\n            </div>\n        </div>\n    </div>\n\n\n    <div id=\"create_ontology\" class=\"col s12\">\n        <div class=\"tab-content\">\n            <div id=\"create_ontology_cont\" style=\"\">\n                <p><b>Note:</b> this feature is not fully supported. For instance, deleting terms or term attributes is not possible.</p>\n\n                <div class=\"container\">\n                    <form>\n                        <div class=\"row\">\n                            <div class=\"input-field col s8\">\n                                Category:\n                                <select name=\"category\">\n                                    <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                    <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                    <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                    <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                    <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                    <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option>\n                                    <option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option>\n                                    <option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                </select>\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"col s12\">\n                                <ul class=\"treeview\" id=\"cont\">\n                                    <li class=\"last\" id=\"ontology\">\n                                        <div class=\"row valign-wrapper\">\n                                            <div class=\"input-field col s4\">\n                                                <input type=\"text\" id=\"ontology_name\" name=\"name\">\n                                                <label for=\"ontology_name\">Ontology Name</label>\n                                            </div>\n                                            <div class=\"input-field col s4\">\n                                                <input type=\"text\" id=\"ontology_id\" name=\"id\">\n                                                <label for=\"ontology_id\">Ontology ID</label>\n                                            </div>\n                                            <div class=\"col s3\">\n                                                <div class=\"row\">\n                                                    <div class=\"input-field col s12\">\n                                                        <textarea class=\"materialize-textarea autoresize\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea>\n                                                        <label for=\"ontology_summary\">Ontology Summary</label>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class=\"input-field col s1\">\n                                                <a title=\"Add\" class=\"btn btn-flat btn-small btn-floating waves-effect waves-light highlight-btn\"><span class=\"fa fa-plus\"></span></a>\n                                            </div>\n                                        </div>\n                                    </li>\n                                </ul>\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"input-field col s12\">\n                                <a id=\"save\" class=\"btn btn-flat right\">Save</a>\n                            </div>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n";


var DATA = new _data2.default(),
    NAV = new _navigation2.default(),
    PAGINATION = new _pagination2.default(),
    FILTERS = new _filters2.default(),
    MODALS = new _modals2.default(),
    STR = new _str2.default(),
    URL = "http://www.cropontology.org",
    PAGE_ABOUT = page_about,
    PAGE_API = page_api.replace(/\{\{URL\}}/igm, window.location).replace(/((<style>)|(<style type=.+))((\s+)|(\S+)|(\r+)|(\n+))(.+)((\s+)|(\S+)|(\r+)|(\n+))(<\/style>)/g, ""),
    PAGE_HELP = page_help,
    PAGE_LOGIN = page_login,
    PAGE_REGISTER = page_register,
    PAGE_FORGOT_PASSWORD = page_forgot_password,
    PAGE_FEEDBACK = page_feedback,
    PAGE_ADD_ONTOLOGY = page_add_ontology,
    page = NAV.get_page(),
    settings = require("../../common/settings/contents.json"),
    top_carousel = require("../../common/settings/top_carousel.json"),
    moment = require("moment");

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
				if ($(v).prop("hostname") && $(v).prop("hostname") !== location.hostname) {
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

			$(".collapsible").collapsible();

			$(".tooltipped").tooltip({ html: true });

			$(".parallax").parallax();

			$(".tabs").tabs();

			$("textarea.autoresize").trigger("autoresize");
		}

		/**
   * Build a circular or a progress loader
   * @see https://materializecss.com/preloader.html
   *
   * @param  object 						options								The loader display options
   */

	}, {
		key: "loader",
		value: function loader(options) {
			var defaults = {
				/**
     * The loader type.
     * Options: "progress" or "circular"
     * @type {String}
     */
				type: "progress",
				/**
     * The progress type.
     * Options: `true` stay for determinate progress (need `size` option)
     * NOTE: This option is available only for progress loaders
     * @type {Boolean}
     */
				determinate: false,
				/**
     * The loader size.
     * Options:
     * 	- Circular loader: @type {String} 	"" or "small" or "big"
     * 	- Progress loader: @type {Integer}	The percentage of progress
     */
				size: "",
				/**
     * The loader colour
     * NOTE: This option is available only for circular loaders
     * @type {String}
     */
				colour: "grey"
			},
			    data = $.extend({}, defaults, options);

			switch (data.type) {
				case "progress":
					return $('<div>', { "class": "progress" }).append($('<div>', {
						"class": data.determinate ? "determinate" : "indeterminate",
						"style": data.size !== "" ? "width: " + data.size + "%" : ""
					}));
					break;
				case "circular":
					return $('<div>', { "class": "preloader-wrapper " + data.size + " active" }).append($('<div>', { "class": "spinner-layer spinner-" + data.colour + "-only" }).append($('<div>', { "class": "circle-clipper left" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "gap-patch" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "circle-clipper right" }).append($('<div>', { "class": "circle" }))));
					break;
			}
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
				$("#" + position).append($.map(v[position].items, function (item) {
					switch (position) {
						case "bottom_links":
							$.each(item.items, function (ik, iv) {
								if (iv.display) {
									$("#" + position + " ." + item.position).append($('<a>', { "class": "tooltipped", "href": iv.link, "target": iv.target, "data-tooltip": iv.label }).append($('<img>', { "src": "common/img/" + iv.image })));
								}
							});
							break;
						case "footer_menu":
							$("#" + item.position).prepend($('<h2>').html(item.title));
							$("#" + item.position).append($('<ul>'));
							$.each(item.items, function (ik, iv) {
								$("#" + item.position).find("ul").append(function () {
									if (iv.display) {
										return $('<li>').append($('<a>', { "href": iv.link, "target": iv.target }).text(iv.label));
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
										return $('<li>').append($('<span>', { "class": "separator" }));
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
			$("body").prepend($("<header>").append($('<nav>', { "class": "transparent z-depth-0" }).append($('<div>', { "class": "nav-wrapper" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "src": "common/img/crop_ontology.png" }))).append(
			// Top menu container
			$('<ul>', { "id": "top_menu", "class": "right hide-on-med-and-down" })))));

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
			var path = STR.ucfirst(NAV.get_url_path()[NAV.get_url_path().length - 1]);

			$("body").append($('<section>', { "id": "top_carousel", "class": "" }).append($('<div>', { "class": "carousel carousel-slider center" }).append($('<div>', { "class": "carousel-fixed-item container" }).append(function () {
				if (page == "ontology") {
					return $('<div>', { "class": "left" }).append($('<h1>', { "id": "page_subtitle" }).text(NAV.get_ontology_id())).append($('<h2>', { "id": "page_title" }).text(NAV.get_ontology_label()));
				} else {
					return $('<div>', { "class": "left" }).append($('<h1>', { "id": "page_title" }).text(settings[page].title));
				}
			})).append($.map(top_carousel.messages, function (v) {
				v.message = v.message.replace(/\n/gm, "<br />");
				v.message = v.message.replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>');
				return $('<div>', { "class": "carousel-item valign-wrapper", "href": "#one" }).append(function () {
					if (v.image !== "") {
						return $('<img>', { "src": v.image, "class": "responsive-img" });
					}
				}).append($('<h1>').html(v.message));
			}))));

			// Instantiate Materialize carousel
			$(".carousel").carousel({
				duration: 50,
				// dist: 0,
				// noWrap: true,
				fullWidth: true,
				indicators: false
			}).animate({ "opacity": 1 }, 300).css("pointer-events", "none");

			/**
   * Animate the carousel
   * @param integer						time							The delay after carousel change (default is 10'000)
   */
			// setInterval(() => {
			// 	// $(".carousel .carousel-item").fadeOut(300, () => {
			// 		$(".carousel").carousel("next");
			// 		// $(".carousel .carousel-item").delay(300).fadeIn();
			// 	// })
			// }, 10000);
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
				var $searchbar = $('<div>', { "class": "bar" }).append($('<div>', { "id": "search_input", "class": "input-field col s8 m8 l8 xl8" }).append($('<input>', {
					"type": "search",
					"id": "search",
					"placeholder": "Search...",
					"name": "q"
				}))),
				    $breadcrumbs = $('<nav>', { "class": "transparent z-depth-0" }).append($('<div>', { "class": "nav-wrapper" }).append($('<div>', { "class": "col s12" }).append($('<a>', { "href": "./", "class": "breadcrumb" }).append($('<span>', { "class": "fas fa-home grey-text" }))).append(function () {
					if (NAV.get_url_path().length > 1) {
						var path = [];
						return $.map(NAV.get_url_path(), function (v, k) {
							path.push(v);
							if (k < NAV.get_url_path().length - 1) {
								return $('<a>', { "href": "./" + path.join("/"), "class": "breadcrumb" }).text(STR.ucfirst(v));
							} else {
								return $('<span>', { "class": "breadcrumb" }).html(STR.ucfirst(v).replace(NAV.get_ontology_url_regex(":"), "<tt>$1</tt> $2"));
							}
						});
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
					$("body").append($('<section>', { "id": "navbar", "class": "container" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "breadcrumb", "class": "col s12 m6 l6" }).append($breadcrumbs)).append($('<div>', { "id": "searchbar", "class": "col s12 m6 l6" }).append($searchbar))));
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
			var _this = this;

			/**
    * Content container
    */
			$("body").append($('<section>', { "id": "contents", "class": "" }).append(function () {
				/**
     * Home layout
     * -------------------------------------------------------------
     */
				if (page == "home") {
					return $('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 m4 l4 xl4" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "info_container", "class": "col s12 m12 l12 xl12" }).append($('<div>', { "class": "card lighten-5" }).append($('<div>', { "class": "card-content" }).append($('<span>', { "class": "card-title highlight" })).append(
					// Loader
					// ---------------------------------
					$('<div>', { "class": "help" }).append($('<div>', { "class": "center-align" }).text(settings.general.loader.text)).append(_this.loader({ type: "progress" }))
					// ---------------------------------
					)))).append($('<div>', { "id": "feed_container", "class": "col s12 m12 l12 xl12" })))).append($('<div>', { "id": "ontologies_container", "class": "col s12 m8 l8 xl8" }));
					/**
      * ---------------------------------------------------------
      */
				} else {
					return $('<div>', { "class": "container" });
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
					DATA.get_ontologies().then(function (data) {
						if (settings.home.sections.ontologies.visible) {
							$("#ontologies_container").append($('<h5>').text("Ontologies")).append($('<ul>', { "class": "collapsible z-depth-0", "data-collapsible": "accordion" })).append($('<h5>', { "class": "all-ontologies" }).append($('<a>', { "href": "" }).text("All ontologies ›")));

							var current_page = 1,
							    page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
							    page_content = [];

							if (page_limit <= 0) {
								page_limit = 1;
							}

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
								})).append($('<div>', { "class": "left" }).append($('<span>', { "class": categories.category.icon })).append($('<span>').text(categories.category.name)))).append($('<div>', { "class": "collapsible-body" + (pages > 0 ? " paginated" : "") }).append(function () {
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
										"href": "./ontology/" + vv.ontology_id + "/" + vv.ontology_name.replace("/", "-")
									}).append($('<h2>').append(vv.ontology_name))).append($('<a>', { "href": "javascript:;", "class": "secondary-content download" }).append("Download").append($('<span>', { "class": "picol_arrow_full_down" }))).append($('<span>', { "class": "items_count" }).text(vv.tot + " " + STR.pluralize(vv.tot, "item"))).append($('<p>').text(vv.ontology_summary)));
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
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_ADD_ONTOLOGY);
					break;
				/**
     * 							ONTOLOGIES contents
     * -----------------------------------------------------------------
     */
				case "ontology":
					console.info(NAV.get_ontology_label());
					$.ajax({
						url: "http://www.cropontology.org/get-ontology-roots/" + NAV.get_ontology_id(),
						success: function success(data) {
							console.log(data);
						}
					});

					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s5" }).append($('<h6>').text("Traits, methods and scales")).append($('<div>', { "id": "ontology_tree", "class": "card z-depth-0" }).append($('<nav>').append($('<div>', { "class": "languages_refresh left" }).append($('<select>', { "name": "language" }).append($('<option>', { "value": "english" }).text("English")))).append($('<ul>', { "class": "right" }).append($('<li>').append($('<a>', { "href": "javascript:;", "class": "" }).text("Download"))))))).append($('<div>', { "class": "col s7" }).append($('<h6>').text("Term information")).append($('<div>', { "id": "ontology_info" }).append($('<div>', { "class": "card z-depth-1 browser-content browser" }).append($('<nav>').append($('<div>', { "class": "filterbar nav-wrapper" }).append($('<ul>', { "class": "filters left" }).append($('<li>', { "data-filter": "read" }).append($('<span>', { "class": "term_id" }).text("Term name")).append($('<a>', { "href": "javascript:;", "class": "right tooltipped", "data-tooltip": "Permalink" }).append($('<span>', { "class": "fa fa-link" }))))).append($('<ul>', { "class": "sorts right" }).append($('<li>', { "id": "general" }).append($('<span>').text("General"))).append($('<li>', { "id": "new-comments" }).append($('<span>').text("Comments")))))).append($('<div>', { "id": "pages", "class": "card-content" }).append())).append($('<div>', { "id": "graph", "class": "card" }).append()))));
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
				$("body").append($("<footer>", { "class": "parallax-container" }).append($("<div>", { "class": "parallax" }).append($("<img>", { "src": "common/img/" + settings.general.footer.background }))).append($("<div>", { "class": "row" }).append($("<div>", { "class": "col s12 m3 l3 xl3" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "class": "responsive-img", "src": "common/img/" + settings.general.footer.logo }))).append($('<p>', { "class": "description" }).html(settings.general.footer.description))).append($("<div>", { "id": "left_menu", "class": "col s12 m2 l2 xl2" })).append($("<div>", { "id": "center_menu", "class": "col s12 m2 l2 xl2" })).append($("<div>", { "id": "right_menu", "class": "col s12 m2 l2 xl2" })))).append($('<section>', { "id": "bottom_links" }).append($('<div>', { "class": "row container" }).append($('<div>', { "id": "", "class": "col s12 m6 l6 xl6 left" })).append($('<div>', { "id": "owner", "class": "col s12 m6 l6 xl6 right right-align" })))).append($('<center>', { "class": "license" }).append($('<p>').html(settings.general.license.text)));
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
	}]);

	return layout;
}();

exports.default = layout;
