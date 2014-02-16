importPackage(org.apache.poi.ss.usermodel);

var excel = {
    rdfMapping: {
        'Name of submitting scientist': 'http://xmlns.com/foaf/0.1/name'
    },

    read: function(inputStream, callback) {
        // Create a workbook using the File System
        var myWorkBook = new WorkbookFactory.create(inputStream);
        // Get the first sheet from workbook
        try {
            var mySheet = myWorkBook.getSheetAt(1);
        } catch(e) { // try sheet 0
            var mySheet = myWorkBook.getSheetAt(0);
        }

        // We now need something to iterate through the cells.
        var rowIter = mySheet.rowIterator(); 

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
                if(cellContent == 'Name of Trait' || cellContent == 'Name of submitting scientist') {
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
                    idValMap[i] = item;
                });
                return;
            } else {
                row.forEach(function(item, i) {
                    term[idValMap[i]] = item;

                    var uri = excel.rdfMapping[idValMap[i]];
                    if(uri) {
                        rdf += '<#i> <'+uri+'> '+JSON.stringify(item)+'@en\n';
                    }

                });
            }
            callback(rdf);
        });
    }
};
exports = excel;
