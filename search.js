exports = s = function() {
    this.index = com.google.appengine.api.search.SearchServiceFactory.getSearchService()
                        .getIndex(com.google.appengine.api.search.IndexSpec.newBuilder().setName("shared_index"));

};
s.prototype.add = function(doc) {
    delete doc['normalized'];
    delete doc['Trait Class'];
    delete doc['parent'];
    delete doc['obo_blob_key'];
    delete doc['ontology_id'];
    delete doc['ontology_summary'];
    delete doc['created_at'];
    delete doc['namespace'];
    delete doc['namespace'];
    delete doc['Name of Trait'];
    delete doc['Crop'];
    delete doc['excel_blob_key'];
    delete doc['relationship'];
    delete doc['creation_date'];

    var docBuilder = com.google.appengine.api.search.Document.newBuilder();

    // set id so we can overwrite it
    var id = doc.id.replace(/[ \(\),\?\-\=]/g,'');
    docBuilder.setId(id);

    for(var i in doc) {
        var name = i.replace(/[ \(\),\?\:\-\=]/g,'');
        var text = doc[i];
        if(text instanceof Text) {
            text = text.getValue();
        }
        /*
        if(name == 'id') {
            text = JSON.stringify(text);
        }
        */
        if(text) {
            docBuilder.addField(com.google.appengine.api.search.Field.newBuilder().setName(name).setText(text));
        }
    }

    var indexDoc = docBuilder.build();

    // add to index! WOO
    var arr = new java.util.ArrayList();
    arr.add(indexDoc);

    this.index.put(arr);
    log('Document added');
}
s.prototype.search = function(queryStr) {
    var results = this.index.search(queryStr);
    return results;
};
