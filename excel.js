importPackage(org.apache.poi.ss.usermodel);

var excel = {
    excelMapping: {
        'Name of submitting scientist': 'foaf:name'
    },

    read: function(inputStream, callback) {
        // Create a workbook using the File System
        var myWorkBook = new WorkbookFactory.create(inputStream);
        // Get the first sheet from workbook
        var sheetIdx = 1;
        try {
            var mySheet = myWorkBook.getSheetAt(sheetIdx);
        } catch(e) { // try sheet 0
            sheetIdx = sheetIdx - 1;
            var mySheet = myWorkBook.getSheetAt(sheetIdx);
        }

        // We now need something to iterate through the cells.
        var rowIter = mySheet.rowIterator(); 
        if(!rowIter.hasNext()) { // sheet is empty!
            if(sheetIdx == 1) { // try sheet 0, otherwise exit
                mySheet = myWorkBook.getSheetAt(0);
                rowIter = mySheet.rowIterator(); 
            }

        }

        var idx = 0,
            rows = 0,
            cellContent,
            cells = 0,
            cols = false;
        while(rowIter.hasNext()){ // for each row
            var myRow = rowIter.next();

            if(cols) {
                cells = cols;
            } else {
                cells = myRow.getPhysicalNumberOfCells();
            }

            var arr = [],
                empty = true;
            for (var i = 0; i < (cells+1); i++) { // for each cell
                var cell = myRow.getCell(i);
                if(cell) {
                    cellContent = ""+cell.toString().trim();
                    if(cellContent)
                        empty = false;
                } else {
                    cellContent = "";
                }
                if(cellContent.toLowerCase() == 'name of trait' || cellContent.toLowerCase() == 'name of submitting scientist') {
                    // it's header
                    cols = cells;
                }
                arr.push(cellContent);
            }
            if(!empty && cols)
                callback(arr, idx++);
        }
    },
    // firstRow is the number where the first row is...
    // remember that all blank rows are skipped
    parseTemplate: function(inputStream, callback) {
        var idValMap = {};
        excel.read(inputStream, function(row, idx) {
            var term = {};
            var rdf = '';
            if(idx == 0) { // first row, build map
                row.forEach(function(item, i) {
                    idValMap[i] = item.toLowerCase();
                });
                return;
            } else {
                row.forEach(function(item, i) {
                    term[idValMap[i]] = item;

                    /*
                    var uri = excel.rdfMapping[idValMap[i]];
                    if(uri) {
                        rdf += '<#i> <'+uri+'> '+JSON.stringify(item)+'@en\n';
                    }
                    */

                });
            }
            callback(term);
        });
    },
    getPerson: function(row) {
        var obj = {};
        obj['@id'] = rdf.baseUri + rdf.convertToSlug(row['Name of submitting scientist'.toLowerCase()]),
        obj['@type'] = 'foaf:Person';

        obj['foaf:name'] = row['Name of submitting scientist'.toLowerCase()];

        return obj;
    },
    getInstitution: function(row, person) {
        var obj = {};
        obj['@id'] = rdf.baseUri + rdf.convertToSlug(row['Institution'.toLowerCase()]),
        obj['@type'] = 'foaf:Organisation';

        obj['foaf:name'] = row['Institution'.toLowerCase()];
        obj['foaf:member'] = { '@id' : person['@id'] };

        return obj;
    },
    getTraitClass: function(row) {
        var obj = {};
        obj['@id'] = rdf.baseUri + rdf.convertToSlug(row['Trait Class'.toLowerCase()]);
        obj['@type'] = [ 'skos:Concept', 'owl:Class' ];

        obj['rdfs:label'] = row['Trait Class'.toLowerCase()];
        /*
        obj['skosxl:prefLabel'] = {
            '@type': 'skosxl:Label',
            'skosxl:literalForm': row['Trait Class'.toLowerCase()]
        }
        */
        return obj;
        
    },
    getTrait: function(row, person, traitClass) {
        var obj = {};
        obj['@id'] = rdf.baseUri + row['trait id for modification, blank for new'];
        obj['@type'] = [ 'skos:Concept', 'owl:Class', 'cov:Trait' ];

        obj['rdfs:label'] = row['Name of Trait'.toLowerCase()];

        obj['skos:definition'] = row['Description of Trait'.toLowerCase()];
        obj['rdfs:comment'] = row['description of trait'.toLowerCase()];

        obj['dc:date'] = row['Date of submission'.toLowerCase()];

        obj['cov:ibfieldbook'] = row['ibfieldbook'.toLowerCase()];

        obj['dc:creator'] = { '@id': person['@id'] };

        obj['dwc:vernacularName'] = row['crop'];

        obj['skosxl:prefLabel'] = {
            '@type': 'skosxl:Label',
            'skosxl:literalForm': row['Name of Trait'.toLowerCase()],
            'cov:acronym': {
                '@type': 'skosxl:Label',
                'skosxl:literalForm': row['Abbreviated name'.toLowerCase()]
            }

        };

        var synonyms = row['Synonyms (separate by commas)'.toLowerCase()].split(',');
        synonyms = synonyms.map(function(el) {
            return el.trim();
        });
        if(synonyms.length && synonyms[0] != '') {
            obj['skosxl:altLabel'] = []
            for(var i=0; i<synonyms.length; i++) {
                obj['skosxl:altLabel'].push({
                    '@type': 'skosxl:Label',
                    'skosxl:literalForm': synonyms[i],
                });
            }
        }


        obj['cov:usedFor'] = row['How is this trait routinely used?'.toLowerCase()];

        obj['rdfs:subClassOf'] = { '@id': traitClass['@id'] };
        obj['skos:broaderTransitive'] = { '@id': traitClass['@id'] };


        return obj;
    },
    getMethod: function(row, trait) {
        var obj = {};
        obj['@id'] = rdf.baseUri + row['Method ID for modification, blank for new'.toLowerCase()];
        obj['@type'] = [ 'skos:Concept', 'owl:Class' ];
        obj['cov:methodOf'] = { '@id' : trait['@id'] };

        var methodName = row['Name of method'.toLowerCase()];
        // XXX add skosxl:prefLabel
        if(methodName) {
            obj['rdfs:label'] = methodName;
        } else {
            obj['rdfs:label'] = 'Method of ' + trait['rdfs:label'];
        }

        obj['skos:definition'] = row['Describe how measured (method)'.toLowerCase()];
        obj['rdfs:comment'] = row['Describe how measured (method)'.toLowerCase()];

        obj['dct:source'] = row['Bibliographic Reference'.toLowerCase()];
            
        return obj;
    },
    getScale: function(row, method) {
        var obj = {};
        obj['@id'] = rdf.baseUri + row['Scale ID for modification, Blank for New'.toLowerCase()];
        obj['@type'] = [ 'skos:Concept', 'owl:Class' ];
        obj['cov:scaleOf'] = { '@id' : method['@id'] };
        
        var type = row['Type of Measure (Continuous, Discrete or Categorical)'.toLowerCase()].toLowerCase();
        var scaleName = '';

        if(type == 'continuous') {
            obj['@type'].push('cov:Continuous');

            scaleName = row['For Continuous: units of measurement'.toLowerCase()];
            var maxValue = row['For Continuous: maximum'.toLowerCase()];
            if(maxValue) {
                obj['cov:maxValue'] = parseInt(maxValue, 10);
            }
            var minValue = row['For Continuous: minimum'.toLowerCase()];
            if(minValue) {
                obj['cov:minValue'] = parseInt(minValue, 10);
            }
        } else if(type == 'discrete') {
            obj['@type'].push('cov:Discrete');
            scaleName = row['For Discrete: Name of scale or units of measurement'.toLowerCase()];
        } else if(type == 'categorical') {
            obj['@type'].push('cov:Categorical');
            scaleName = row['For Categorical: Name of rating scale'.toLowerCase()];
        }
        if(!scaleName) return obj;

        obj['rdfs:label'] = scaleName;
        obj['skosxl:prefLabel'] = {
            '@type': 'skosxl:Label',
            'skosxl:literalForm': scaleName
        };


        return obj;
    },
    getCategories: function(row, scale) {
        var arr = [];

        var startRecording = false;
        for(var i in row) {
            if(i == 'For Categorical: Class 1 - value = meaning'.toLowerCase()) {
                startRecording = true;
            }
            if(!startRecording) continue;
            
            // start recording categories
            var obj = {};
            var split = row[i].split('=');
            split = split.map(function(el) {
                return el.trim();
            });
            if(split.length < 2) continue;

            obj['@id'] = scale['@id'] + '/' + split[0];
            obj['@type'] = [ 'skos:Concept', 'owl:Class' ];

            obj['rdfs:subClassOf'] = { '@id': scale['@id'] };
            obj['skos:broaderTransitive'] = { '@id': scale['@id'] };

            obj['rdfs:label'] = split[1];
            obj['skosxl:prefLabel'] = {
                '@type': 'skosxl:Label',
                'skosxl:literalForm': split[1]
            }

            obj['skosxl:altLabel'] = {
                '@type': 'skosxl:Label',
                'skosxl:literalForm': split[0]
            }

            arr.push(obj);

        }
        
        return arr;
    }

};
exports = excel;
