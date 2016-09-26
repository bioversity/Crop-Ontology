// Functions that create different parts of Json output
function getVariableDetails(variable, varTrait, varMethod, varScale) {
	var contextOfUse = [];
	var variableDetails = {
		"observationVariableDbId" : "" + variable.getProperty("id"),
		"name": translate(variable.getProperty("name")),
		"ontologyDbId": "" + variable.getProperty("ontology_id"),
		"ontologyName": "" + variable.getProperty("ontology_name"),
		"synonyms": translate(variable.getProperty("Variable synonyms")),
		"contextOfUse": contextOfUse,
		"growthStage": null,
		"status": null,
		"xref": null,
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
	var traitSynonyms = [];
	var traitDetails = {
		"traitDbId" : "" + trait.getProperty("id"),
		"name": translate(trait.getProperty("name")),
		"class": translate(trait.getProperty("Trait class")),
		"description": translate(trait.getProperty("Trait description")),
		"synonyms": traitSynonyms,
		"mainAbbreviation": null,
		"alternativeAbbreviations": null,
		"entity": translate(trait.getProperty("Entity")),
		"attribute": translate(trait.getProperty("Attribute")),
		"status": null,
		"xref": null,
	};
	return traitDetails;
}

function getMethodDetails(method) {
	var methodDetails = {
		"methodId" : "" + method.getProperty("id"),
		"name": "" + translate(method.getProperty("name")),
		"class": null,
		"description": "" + translate(method.getProperty("Method description")),
		"formula": null,
		"reference": null,
	};
	return methodDetails;
}

function getScaleDetails(scale) {
	var scaleDetails = {
		"scaleId" : "" + scale.getProperty("id"),
		"name": "" + translate(scale.getProperty("name")),
		"dataType": "" + translate(scale.getProperty("Scale class")),
		"decimalPlaces": null,
		"xref": null,
		"validValues": {
			"min": "" + translate(scale.getProperty("Lower limit")),
			"max":  "" + translate(scale.getProperty("Upper limit")),
			"categories": [],
		}
	}
	if (translate(scale.getProperty("Scale class"))=="Nominal" || translate(scale.getProperty("Scale class"))=="Ordinal" ){
		var i = 1;
		while (scale.getProperty("Category " + i)){
			scaleDetails["validValues"]["categories"].push(translate(scale.getProperty("Category " + i)));
			i = i + 1;
		}
	} else {
		scaleDetails["validValues"]["categories"]= null;
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
