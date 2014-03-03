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
    getTrait: function(row) {
        var obj = {};
        obj['@type'] = 'skos:Concept';

        for(var i in row) {
            if(i == 'Method ID for modification, Blank for New'.toLowerCase()) {
                break; // stop recording trait info
            }
            if(i == 'trait id for modification, blank for new') {
                obj['@id'] = rdf.baseUri + row['trait id for modification, blank for new'];
            }

            if(row[i])
                obj[i] = row[i];
        }

        return obj;
    },
    getMethod: function(row, broader) {
        var obj = {};
        obj['@type'] = 'skos:Concept';
        obj['skos:broader'] = { '@id' : broader['@id'] };

        var startRecording = false;

        for(var i in row) {
            if(i == 'Method ID for modification, Blank for New'.toLowerCase()) {
                // start recording
                startRecording = true;
            }
            if(i == 'Scale ID for modification, Blank for New'.toLowerCase()) {
                startRecording = false;
            }
            if(!startRecording) continue;

            if(i == 'Method ID for modification, Blank for New'.toLowerCase()) {
                obj['@id'] = rdf.baseUri + row['Method ID for modification, blank for new'.toLowerCase()];
            }
            if(row[i])
                obj[i] = row[i];
        }

        return obj;
    },
    getScale: function(row, broader) {
        var obj = {};
        obj['@type'] = 'skos:Concept';
        obj['skos:broader'] = { '@id' : broader['@id'] };

        var startRecording = false;

        for(var i in row) {
            if(i == 'Scale ID for modification, Blank for New'.toLowerCase()) {
                // start recording
                startRecording = true;
            }
            if(!startRecording) continue;

            if(i == 'Scale ID for modification, Blank for New'.toLowerCase()) {
                obj['@id'] = rdf.baseUri + row['Scale ID for modification, Blank for New'.toLowerCase()];
            }
            if(row[i])
                obj[i] = row[i];
        }

        return obj;
    }

};
exports = excel;
