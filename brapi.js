// Functions that create different parts of Json output
function getVariableDetails(variable, varTrait, varMethod, varScale) {
	var VariableSynonyms = String(translate(variable.getProperty("Variable synonyms"))).split(",");
	var variableDetails = {
		"observationVariableDbId" : "" + variable.getProperty("id"),
		"name": translate(variable.getProperty("name")),
		"ontologyDbId": "" + variable.getProperty("ontology_id"),
		"ontologyName": "" + variable.getProperty("ontology_name"),
		"synonyms": VariableSynonyms,
		"contextOfUse": [translate(variable.getProperty("Context of use"))],
		"growthStage": translate(variable.getProperty("Growth stage")),
		"status": translate(variable.getProperty("Variable status")),
		"xref": translate(variable.getProperty("Variable Xref")),
		"institution": translate(variable.getProperty("Institution")),
		"scientist": translate(variable.getProperty("Scientist")),
		"date": translate(variable.getProperty("Date")),
		"language": translate(variable.getProperty("Language")),
		"crop": translate(variable.getProperty("Crop")),
		trait: varTrait,
		method: varMethod,
		scale: varScale,
	};
	return variableDetails;
}

function getTraitDetails(trait) {
	var traitSynonyms = String(translate(trait.getProperty("Trait synonyms"))).split(",");
	var traitDetails = {
		"traitDbId" : "" + trait.getProperty("id"),
		"name": translate(trait.getProperty("name")),
		"class": translate(trait.getProperty("Trait class")),
		"description": translate(trait.getProperty("Trait description")),
		"synonyms": traitSynonyms,
		"mainAbbreviation": translate(trait.getProperty("Main trait abbreviation")),
		"alternativeAbbreviations": translate(trait.getProperty("Alternative trait abbreviations")),
		"entity": translate(trait.getProperty("Entity")),
		"attribute": translate(trait.getProperty("Attribute")),
		"status": translate(trait.getProperty("Trait status")),
		"xref": translate(trait.getProperty("Trait Xref")),
	};
	return traitDetails;
}

function getMethodDetails(method) {
	var methodDetails = {
		"methodId" : "" + method.getProperty("id"),
		"name": translate(method.getProperty("name")),
		"class": translate(method.getProperty("Method class")),
		"description": translate(method.getProperty("Method description")),
		"formula": translate(method.getProperty("Formula")),
		"reference": translate(method.getProperty("Method reference")),
	};
	return methodDetails;
}

function getScaleDetails(scale) {
	var i = 1;
	var categories = [];
	while (scale.getProperty("Category " + i)){
		categories.push(translate(scale.getProperty("Category " + i)));
		i = i + 1;
	}

	var scaleDetails = {
		"scaleId" : "" + scale.getProperty("id"),
		"name": translate(scale.getProperty("name")),
		"dataType": translate(scale.getProperty("Scale class")),
		"decimalPlaces": translate(scale.getProperty("Decimal places")),
		"xref": translate(scale.getProperty("Scale Xref")),
		"validValues": {
			"min": "" + translate(scale.getProperty("Lower limit")),
			"max":  "" + translate(scale.getProperty("Upper limit")),
			"categories": categories,
		}
	}
	return scaleDetails;
}

var brapi = {
	getMetadata: function() {
		var metadata = {
			"metadata" : {
				"pagination":{
					"pageSize": null,
					"currentPage": null,
					"totalCount": null,
					"totalPages": null 
				}, 
				"status": []
			},
			"result": {
				"data": [],
			}
		}
		return metadata;
	},

	// Functions used in the main file that create the entire Json for one variable id
	getVariableJson: function (var_id, result) {
		var variables = googlestore.query("term")
			.filter("id", "=", var_id)
			.fetch();

		var variable_of;
		variables.forEach(function(variable){
			result["result"] = getVariableDetails(variable, {}, {}, {});
			variable_of = variable.getProperty("parent");
		});
				
		var traits = googlestore.query("term")
			.filter("id", "=", variable_of.get(0))
			.filter("id", "=", variable_of.get(0))
			.fetch();
		traits.forEach(function(trait){
			result["result"]["trait"] = getTraitDetails(trait);
		});
		
		var methods = googlestore.query("term")
			.filter("id", "=", variable_of.get(1))
			.fetch();
		methods.forEach(function(method){
			result["result"]["method"] = getMethodDetails(method);
		});
				
		var scales = googlestore.query("term")
			.filter("id", "=", variable_of.get(2))
			.fetch();
		scales.forEach(function(scale){
			result["result"]["scale"] = getScaleDetails(scale);	
		});
	},

	// Functions used in the main file that create the entire Json for all the variables existing in the crop
	getVariableListJson: function (filterCropID, result) {
		var traitsQuery = 'googlestore.query("term")' + filterCropID + '.filter("Trait ID", "!=", null).fetch();';
		var traits = eval(traitsQuery);
		var traits_object = {};
		traits.forEach(function(trait){
			traits_object["" + trait.getProperty("id")] = getTraitDetails(trait);
		});

		var methodsQuery = 'googlestore.query("term")' + filterCropID + '.filter("Method ID", "!=", null).fetch();';
		var methods = eval(methodsQuery);
		var methods_object = {};
		methods.forEach(function(method){
			methods_object[ "" + method.getProperty("id")] = getMethodDetails(method);
		});

		var scalesQuery = 'googlestore.query("term")' + filterCropID + '.filter("Scale ID", "!=", null).fetch();';
		var scales = eval(scalesQuery);
		var scales_object = {};
		scales.forEach(function(scale){
			scales_object["" + scale.getProperty("id")] = getScaleDetails(scale);
		});

		var variablesQuery = 'googlestore.query("term")' + filterCropID + '.filter("Variable ID", "!=", null).fetch();';
		var variables = eval(variablesQuery);
		variables.forEach(function(variable){
			result["result"]["data"].push(getVariableDetails(variable, traits_object["" + variable.getProperty("parent").get(0)], methods_object["" + variable.getProperty("parent").get(1)], scales_object["" + variable.getProperty("parent").get(2)]));
		});
	}
}
exports = brapi;
