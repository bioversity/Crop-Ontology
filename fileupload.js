importPackage(org.apache.commons.fileupload);
importPackage(org.apache.commons.fileupload.servlet);
importPackage(org.apache.commons.fileupload.disk);
importPackage(org.apache.commons.io);
importPackage(java.lang);

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
    }
};
exports = fileupload;
