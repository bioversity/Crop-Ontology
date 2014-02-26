importPackage(org.apache.commons.fileupload);
importPackage(org.apache.commons.fileupload.servlet);
importPackage(org.apache.commons.fileupload.disk);
importPackage(org.apache.commons.io);
importPackage(java.lang);

var rdfPath = getServletConfig().getServletContext().getInitParameter('rdf-path');
var fileupload = {
    getData: function(request) {
        var data = [];
        try {
            var items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
            for(var i=0; i<items.size(); i++) {
                var item = items.get(i);

                if(item.isFormField()) {
                    data.push({
                        file: false,
                        fieldName: item.getFieldName(),
                        // added the "" at the end to convert it to JS string
                        fieldValue: item.getString()
                    });
                } else {
                    data.push({
                        file: true,
                        fieldName: item.getName(),
                        fieldValue: item.getInputStream()
                    });
                }

            }
        } catch (e){
            throw new Exception(e);
        }

        return data;
    },
    upload: function(filePath, inputStream) {
        var filePath = rdfPath + filePath;
        var file = new File(filePath);
        if(!file.exists()) {
            // create intermediate paths
            file.getParentFile().mkdirs();
        }
        var fileOut = new FileOutputStream(file);
        IOUtils.copy(inputStream, fileOut);
    },
    getFiles: function(folderName) {
        var file = new File(rdfPath + folderName);
        var files = file.listFiles();
        var ret = [];
        for(var i=0; i<files.length; i++) {
            var f = files[i];
            ret.push(''+f.getName());
        }
        return ret;
    }
};
exports = fileupload;
