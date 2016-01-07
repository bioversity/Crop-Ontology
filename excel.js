importPackage(org.apache.poi.ss.usermodel);
importPackage(org.apache.poi.hssf.usermodel);

importPackage(com.google.appengine.api.blobstore);
importPackage(com.google.appengine.api.files);

var excel = {

    read: function(firstRow, blobKey, callback) {
        // Create a workbook using the File System
        var myWorkBook = new WorkbookFactory.create(new BlobstoreInputStream(blobKey));
        // Get the first sheet from workbook
        var mySheet = myWorkBook.getSheetAt(1);

        // We now need something to iterate through the cells.
        var rowIter = mySheet.rowIterator(); 

        var idx = 0,
            rows = 0,
            cellContent,
            cols = 0;
        while(rowIter.hasNext()){ // for each row
            var myRow = rowIter.next();

            // skip until we reach firstRow (it's not an index)
            rows++;
            if(rows < firstRow) continue;

            if(idx == 0) // first row must tell us how many cols we have
                cols = myRow.getPhysicalNumberOfCells();

            var arr = [],
                empty = true;
            for (var i = 0; i < (cols+1); i++) { // for each cell
                var cell = myRow.getCell(i);
                if(cell) {
                    cellContent = ""+cell.toString().trim();
                    if(cellContent)
                        empty = false;
                } else {
                    cellContent = "";
                }
                arr.push(cellContent);
            }
            if(!empty)
                callback(arr, idx++);
        }
    },
    // firstRow is the number where the first row is...
    // remember that all blank rows are skipped
    parseTemplate: function(firstRow, blobKey, callback) {
        var idValMap = {};
        excel.read(firstRow, blobKey, function(row, idx) {
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
    },
    createXls: function(data){

        var url = new java.net.URL("http://www.cropontology.org/TD_template_v5.xls");
        var uc = url.openConnection();
       
        // Create a workbook using the File System
        var myWorkBook = new HSSFWorkbook(uc.getInputStream());

        //var myWorkBook = WorkbookFactory.create(uc.getInputStream());
        // Get the first sheet from workbook
        //var mySheet = myWorkBook.createSheet("CO");
         var mySheet = myWorkBook.getSheetAt(1);

         function getval(val){
            var value = val;
            if(typeof value === 'object'){
                for( var obj in val){
                        value = val[obj];
               }    
            }

            if(value+'' == 'undefined'){
                value='';
            }

            return value;
            }


        ///what file is it?
        var obo = false;
         if(data[0]['obo_blob_key']){
                obo=true;
         }
         var tdv5=false;

        //count the number of line in the file
        var cpt = 1;
        //term info by id
        var obj = [];
        ///categorocal scale when obo 
        var scale = [];
        
        for (var j = 0; j < data.length; j++) {
            if(data[j]["Variable name"] || (data[j]["relationship"] && data[j]["relationship"].indexOf("variable_of") != -1)){
                tdv5=true;
            }
            obj[data[j]['id']] = data[j];

            if(data[j]["namespace"] && getval(data[j]["namespace"]).indexOf("Scale")>0 && data[j]["is_a"]){ ///this is a category
               if(scale[data[j]["parent"]]){
                    scale[data[j]["parent"]].push(data[j]);
                    
               }else{
                    scale[data[j]["parent"]]=[];
                    scale[data[j]["parent"]].push(data[j]);
               }
            }   
            
        }

        if(tdv5 || (tdv5 && obo)){
            for (var i = 0; i < data.length; i++) {
              //  for (var cellnum in data[i]) {
                    if(data[i]["Variable name"] || data[i]["namespace"] && getval(data[i]["namespace"]).indexOf("Variable")>0){
                        // THIS IS A VARIABLE
                        //create new row
                        var row = mySheet.createRow(cpt);

                        if(data[i]["Variable name"]){//td
                            //NOW ADD THE VARIABLE INFO
                            //var id
                            //create cell
                            var cell = row.createCell(new java.lang.Integer(1));
                            //set cell value
                            cell.setCellValue(getval(data[i]["id"])+"");
                            //name
                            var cell = row.createCell(new java.lang.Integer(2));
                            cell.setCellValue(getval(data[i]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(3));
                            cell.setCellValue(getval(data[i]["Variable synonyms"])+"");
                            var cell = row.createCell(new java.lang.Integer(4));
                            cell.setCellValue(getval(data[i]["Context of use"])+"");
                            var cell = row.createCell(new java.lang.Integer(5));
                            cell.setCellValue(getval(data[i]["Growth stage"])+"");
                            var cell = row.createCell(new java.lang.Integer(6));
                            cell.setCellValue(getval(data[i]["Variable status"])+"");
                            var cell = row.createCell(new java.lang.Integer(7));
                            cell.setCellValue(getval(data[i]["Variable Xref"])+"");
                            var cell = row.createCell(new java.lang.Integer(8));
                            cell.setCellValue(getval(data[i]["Institution"])+"");
                            var cell = row.createCell(new java.lang.Integer(9));
                            cell.setCellValue(getval(data[i]["Scientist"])+"");
                            var cell = row.createCell(new java.lang.Integer(10));
                            cell.setCellValue(getval(data[i]["Date"])+"");
                            var cell = row.createCell(new java.lang.Integer(11));
                            cell.setCellValue(getval(data[i]["language"])+"");
                            var cell = row.createCell(new java.lang.Integer(12));
                            cell.setCellValue(getval(data[i]["Crop"])+"");


                            //look for trait info now
                            var traitID = data[i]["parent"].split(',')[0].replace('[', '');
                            var cell = row.createCell(new java.lang.Integer(13));
                            cell.setCellValue(getval(obj[traitID]["id"])+"");
                            var cell = row.createCell(new java.lang.Integer(14));
                            cell.setCellValue(getval(obj[traitID]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(15));
                            cell.setCellValue(getval(obj[traitID]["Trait class"])+"");
                            var cell = row.createCell(new java.lang.Integer(16));
                            cell.setCellValue(getval(obj[traitID]["Trait description"])+"");
                            var cell = row.createCell(new java.lang.Integer(17));
                            cell.setCellValue(getval(obj[traitID]["Trait synonyms"])+"");
                            var cell = row.createCell(new java.lang.Integer(18));
                            cell.setCellValue(getval(obj[traitID]["Main trait abbreviation"])+"");
                            var cell = row.createCell(new java.lang.Integer(19));
                            cell.setCellValue(getval(obj[traitID]["Alternative trait abbreviations"])+"");
                            var cell = row.createCell(new java.lang.Integer(20));
                            cell.setCellValue(getval(obj[traitID]["Entity"])+"");
                            var cell = row.createCell(new java.lang.Integer(21));
                            cell.setCellValue(getval(obj[traitID]["Attribute"])+"");
                            var cell = row.createCell(new java.lang.Integer(22));
                            cell.setCellValue(getval(obj[traitID]["Trait status"])+"");
                            var cell = row.createCell(new java.lang.Integer(23));
                            cell.setCellValue(getval(obj[traitID]["Trait Xref"])+"");

                            //look for method info now
                            var methodID = data[i]["parent"].split(',')[1].replace(" ", "");
                            
                            var cell = row.createCell(new java.lang.Integer(24));
                            cell.setCellValue(getval(obj[methodID]["id"])+"");
                            var cell = row.createCell(new java.lang.Integer(25));
                            cell.setCellValue(getval(obj[methodID]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(26));
                            cell.setCellValue(getval(obj[methodID]["Method class"])+"");
                            var cell = row.createCell(new java.lang.Integer(27));
                            cell.setCellValue(getval(obj[methodID]["Method description"])+"");
                            var cell = row.createCell(new java.lang.Integer(28));
                            cell.setCellValue(getval(obj[methodID]["Formula"])+"");
                            var cell = row.createCell(new java.lang.Integer(29));
                            cell.setCellValue(getval(obj[methodID]["Method reference"])+"");

                            //look for scale info now
                            var scaleID = data[i]["parent"].split(',')[2].replace(" ", "").replace("]", "");
                            
                            var cell = row.createCell(new java.lang.Integer(30));
                            cell.setCellValue(getval(obj[scaleID]["id"])+"");
                            var cell = row.createCell(new java.lang.Integer(31));
                            cell.setCellValue(getval(obj[scaleID]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(32));
                            cell.setCellValue(getval(obj[scaleID]["Scale class"])+"");
                            var cell = row.createCell(new java.lang.Integer(33));
                            cell.setCellValue(getval(obj[scaleID]["Decimal places"])+"");
                            var cell = row.createCell(new java.lang.Integer(34));
                            cell.setCellValue(getval(obj[scaleID]["Lower limit"])+"");
                            var cell = row.createCell(new java.lang.Integer(35));
                            cell.setCellValue(getval(obj[scaleID]["Upper limit"])+"");
                            var cell = row.createCell(new java.lang.Integer(36));
                            cell.setCellValue(getval(obj[scaleID]["Scale Xref"])+"");
                            if(getval(obj[scaleID]["Scale class"]) == 'Nominal' 
                                || getval(obj[scaleID]["Scale class"]) == 'Ordinal' ){
                                var catnum = 37;
                                for(var cat in obj[scaleID]){
                                    if(cat.indexOf("Category")!=-1){
                                        var cell = row.createCell(new java.lang.Integer(catnum));
                                        cell.setCellValue(getval(obj[scaleID][cat])+"");
                                        catnum++;
                                    }
                                }
                            }
                        }else{//obo with var
                            var cell = row.createCell(new java.lang.Integer(1));
                            cell.setCellValue(getval(data[i]["id"])+"");
                            var cell = row.createCell(new java.lang.Integer(2));
                            cell.setCellValue(getval(data[i]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(3));
                            cell.setCellValue(""+getval(data[i]["synonym"]).substring(1,getval(data[i]["synonym"]).lastIndexOf("\"")));
                            var cell = row.createCell(new java.lang.Integer(9));
                            cell.setCellValue(getval(data[i]["created_by"])+"");
                            var cell = row.createCell(new java.lang.Integer(7));
                            cell.setCellValue(getval(data[i]["xref"])+"");
                            var cell = row.createCell(new java.lang.Integer(12));
                            cell.setCellValue(getval(data[i]["ontology_name"])+"");

                            var traitID = data[i]["parent"].split(',')[0].replace('[', '');
                            var cell = row.createCell(new java.lang.Integer(13));
                            cell.setCellValue(getval(obj[traitID]["id"])+"");
                            var cell = row.createCell(new java.lang.Integer(14));
                            cell.setCellValue(getval(obj[traitID]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(15));
                            cell.setCellValue(""+getval(obj[traitID]["is_a"]).substring(1,getval(obj[traitID]["is_a"]).lastIndexOf("!")));
                            var cell = row.createCell(new java.lang.Integer(16));
                            cell.setCellValue(""+getval(obj[traitID]["def"]).substring(1,getval(obj[traitID]["def"]).lastIndexOf("\"")));
                            var cell = row.createCell(new java.lang.Integer(17));
                            cell.setCellValue(getval(obj[traitID]["synonym"])+"");
                            var cell = row.createCell(new java.lang.Integer(23));
                            cell.setCellValue(getval(obj[traitID]["xref"])+"");

                            //look for method info now
                            var methodID = data[i]["parent"].split(',')[1].replace(" ", "");
                            
                            var cell = row.createCell(new java.lang.Integer(24));
                            cell.setCellValue(getval(obj[methodID]["id"])+"");
                            var cell = row.createCell(new java.lang.Integer(25));
                            cell.setCellValue(getval(obj[methodID]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(27));
                            cell.setCellValue(getval(obj[methodID]["def"]).substring(1,getval(obj[methodID]["def"]).lastIndexOf("\"")));
                            var cell = row.createCell(new java.lang.Integer(29));
                            cell.setCellValue(getval(obj[methodID]["xref"])+"");

                            var scaleID = data[i]["parent"].split(',')[2].replace(" ", "").replace("]", "");
                            
                            var cell = row.createCell(new java.lang.Integer(30));
                            cell.setCellValue(getval(obj[scaleID]["id"])+"");
                            var cell = row.createCell(new java.lang.Integer(31));
                            cell.setCellValue(getval(obj[scaleID]["name"])+"");
                            var cell = row.createCell(new java.lang.Integer(36));
                            cell.setCellValue(getval(obj[scaleID]["xref"])+"");

                            if(scale["["+scaleID+"]"]){// categorical scale
                                var catnum = 37;
                                //throw scale["["+scaleID+"]"];
                                //for(var cat in scale["["+scaleID+"]"]){
                                    scale["["+scaleID+"]"].forEach( function(catarray){
                                        if(getval(catarray["name"])){
                                            //throw getval(cat["name"]);
                                            var cell = row.createCell(new java.lang.Integer(catnum));
                                            var catname = getval(catarray["id"]).substring(getval(catarray["id"]).lastIndexOf(":")+1, getval(catarray["id"]).length)+ " = "+getval(catarray["name"])
                                            cell.setCellValue(catname);
                                            catnum++;
                                       }
                                    });   
                                //}
                                
                            }
                            ///HOW TO GET THE CATEGORIES???
                           

                        }
                        

                        
                       
                        cpt++;
                    }
                }
            }

            //this is a TD v4
            else if(!tdv5 && !obo){
                for (var i = 0; i < data.length; i++) {
                    // Let's assume there is only a method for a given scale
                    if(data[i]["Type of Measure (Continuous, Discrete or Categorical)"]){
                        // THIS IS A scale
                        //create new row
                        var row = mySheet.createRow(cpt);

                        var scaleID = data[i]["id"];
                        var cell = row.createCell(new java.lang.Integer(30));
                        cell.setCellValue(getval(obj[scaleID]["id"])+"");
                        var cell = row.createCell(new java.lang.Integer(31));
                        cell.setCellValue(getval(obj[scaleID]["name"])+"");
                        var cell = row.createCell(new java.lang.Integer(32));
                        cell.setCellValue(getval(obj[scaleID]["Type of Measure (Continuous, Discrete or Categorical)"])+"");
                        var cell = row.createCell(new java.lang.Integer(33));
                        cell.setCellValue(getval(obj[scaleID]["Decimal places"])+"");
                        var cell = row.createCell(new java.lang.Integer(34));
                        cell.setCellValue(getval(obj[scaleID]["For Continuous: minimum"])+"");
                        var cell = row.createCell(new java.lang.Integer(35));
                        cell.setCellValue(getval(obj[scaleID]["For Continuous: maximum"])+"");
                        var cell = row.createCell(new java.lang.Integer(36));
                        cell.setCellValue("");
                        if(obj[scaleID]["For Categorical: Name of rating scale"]){
                            var catnum = 37;
                            for(var cat in obj[scaleID]){
                                if(cat.indexOf("meaning")!=-1){
                                    var cell = row.createCell(new java.lang.Integer(catnum));
                                    cell.setCellValue(getval(obj[scaleID][cat])+"");
                                    catnum++;
                                }
                            }
                        }


                        //METHOD
                        //look for method info now
                        var methodID = data[i]["parent"];
                        
                        var cell = row.createCell(new java.lang.Integer(24));
                        cell.setCellValue(getval(obj[methodID]["id"])+"");
                        var cell = row.createCell(new java.lang.Integer(25));
                        cell.setCellValue(getval(obj[methodID]["name"])+"");
                        var cell = row.createCell(new java.lang.Integer(26));
                        cell.setCellValue(getval(obj[methodID]["Method class"])+"");
                        var cell = row.createCell(new java.lang.Integer(27));
                        cell.setCellValue(getval(obj[methodID]["Describe how measured (method)"])+"");
                        var cell = row.createCell(new java.lang.Integer(28));
                        cell.setCellValue(getval(obj[methodID]["Formula"])+"");
                        var cell = row.createCell(new java.lang.Integer(29));
                        cell.setCellValue(getval(obj[methodID]["Bibliographic Reference"])+"");
                        var cell = row.createCell(new java.lang.Integer(5));
                        cell.setCellValue(getval(obj[methodID]["Growth stages"])+"");
                        var cell = row.createCell(new java.lang.Integer(0));
                        cell.setCellValue(getval(obj[methodID]["Comments"])+"");

                        //look for trait info now
                        var traitID = obj[methodID]["parent"];
                        var cell = row.createCell(new java.lang.Integer(13));
                        cell.setCellValue(getval(obj[traitID]["id"])+"");
                        var cell = row.createCell(new java.lang.Integer(14));
                        cell.setCellValue(getval(obj[traitID]["name"])+"");
                        var cell = row.createCell(new java.lang.Integer(15));
                        cell.setCellValue(getval(obj[traitID]["Trait Class"])+"");
                        var cell = row.createCell(new java.lang.Integer(16));
                        cell.setCellValue(getval(obj[traitID]["Description of Trait"])+"");
                        var cell = row.createCell(new java.lang.Integer(17));
                        cell.setCellValue(getval(obj[traitID]["Synonyms (separate by commas)"])+"");
                        var cell = row.createCell(new java.lang.Integer(18));
                        cell.setCellValue(getval(obj[traitID]["Abbreviated name"])+"");
                        var cell = row.createCell(new java.lang.Integer(19));
                        cell.setCellValue(getval(obj[traitID]["Alternative trait abbreviations"])+"");
                        var cell = row.createCell(new java.lang.Integer(20));
                        cell.setCellValue(getval(obj[traitID]["Entity"])+"");
                        var cell = row.createCell(new java.lang.Integer(21));
                        cell.setCellValue(getval(obj[traitID]["Attribute"])+"");
                        var cell = row.createCell(new java.lang.Integer(22));
                        cell.setCellValue(getval(obj[traitID]["Trait status"])+"");
                        var cell = row.createCell(new java.lang.Integer(23));
                        cell.setCellValue(getval(obj[traitID]["Trait Xref"])+"");
                        var cell = row.createCell(new java.lang.Integer(12));
                        cell.setCellValue(getval(obj[traitID]["Crop"])+"");
                        var cell = row.createCell(new java.lang.Integer(4));
                        cell.setCellValue(getval(obj[traitID]["How is this trait routinely used?"])+"");
                       

                         var cell = row.createCell(new java.lang.Integer(8));
                        cell.setCellValue(getval(obj[traitID]["Institution"])+"");
                        var cell = row.createCell(new java.lang.Integer(9));
                        cell.setCellValue(getval(obj[traitID]["Name of submitting scientist"])+"");
                        var cell = row.createCell(new java.lang.Integer(10));
                        cell.setCellValue(getval(obj[traitID]["Date of submission"])+"");
                        var cell = row.createCell(new java.lang.Integer(11));
                        cell.setCellValue(getval(obj[traitID]["language"])+"");

                        cpt++;

                        
                    }
                }
            } else{//obo
                //SILL NEED TO ADD WHEN A TRAIT DOES NOT HAVE A METHOD OR SCALE
            }
        
        
        //ByteArrayOutputStream
        var bos = new ByteArrayOutputStream();
        myWorkBook.write(bos);
        
        //byte[]
        var bytes = bos.toByteArray();
        bos.close();
        ///////////////
        //blob
        // Get a file service
        var fileService = FileServiceFactory.getFileService();

        // Create a new Blob file with mime-type "text/plain"
        var file = fileService.createNewBlobFile("application/vnd.ms-excel", "temp.xls");

        // Open a channel to write to it
        var lock = true;
        var writeChannel = fileService.openWriteChannel(file, lock);

        var bb = java.nio.ByteBuffer.wrap(bytes);
        writeChannel.write(bb);
        
        // Now finalize
        writeChannel.closeFinally();

        var blobKey = fileService.getBlobKey(file);
        return blobKey;
        //return blobstore.createFile(bytes);
    }

};
exports = excel;
