importPackage(org.apache.poi.ss.usermodel);

var excel = {

    read: function(blobKey, callback) {
        // Create a workbook using the File System
        var myWorkBook = new WorkbookFactory.create(new BlobstoreInputStream(blobKey));
        /// Get the first sheet from workbook
        var mySheet = myWorkBook.getSheetAt(1);

        // We now need something to iterate through the cells.**/
        var rowIter = mySheet.rowIterator(); 

        var idx = 0;
        while(rowIter.hasNext()){ // for each row
            var myRow = rowIter.next();
            var cellIter = myRow.cellIterator();
            var arr = [];
            while(cellIter.hasNext()){ // for each cell
                var myCell = cellIter.next();
                var cellContent = ""+myCell.toString().trim();
                if(cellContent)
                    arr.push(cellContent);
            }
            if(arr.length)
                callback(arr, idx++);
        }
    },
    parseTemplate: function(blobKey, callback) {
        var idValMap = {};
        excel.read(blobKey, function(row, idx) {
            var term = {};
            if(idx == 0) { // first row, build map
                row.forEach(function(item, i) {
                    idValMap[i] = item;
                });
                return;
            } else {
                row.forEach(function(item, i) {
                    term[idValMap[i]] = item;
                });
            }
            callback(term);
        });

    }
};
