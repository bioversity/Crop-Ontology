function markdown(str) {
    function replaceURLWithHTMLLinks(text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp,"<a href='$1'>$1</a>"); 
    }
    function oboid(str, prefix, cb) {
      // fucking double quotes need more slashes
      var regex = new RegExp("("+ prefix + ")\\\\?:(\\d+)", "g");
      return str.replace(regex, function(){
        var prefix = arguments[1];
        var id = arguments[2];
        return cb(prefix, prefix + ":" + id);
      });
    }
    var str = ""+str;
    str = str.replace(new RegExp("(\n)\\1+","g"), "<br /><br />").replace(new RegExp("\n", "g"),"<br />");
    str = str.replace(/\\n/g, "<br />");
    str = str.replace("Gramene ", "");
    str = replaceURLWithHTMLLinks(str);

    // do obo links
    str = oboid(str, "PATO|TO|PO", function(prefix, id){
      if(prefix === "PO") {
        return "<a target='_blank' href='http://browser.planteome.org/amigo/term/"+id+"'>" + id + "</a>"
      } else if(prefix === "TO") {
        // old site : return "<a target='_blank' href='http://www.gramene.org/db/ontology/search?id="+id+"'>" + id + "</a>"
        return "<a target='_blank' href='http://browser.planteome.org/amigo/term/"+id+"'>" + id + "</a>"
      } else {
        return id;
      }
    });
    /*
    str = str.replace(/\bTO\\?:(\d+)/g, function() {
        var id = "TO:" + arguments[1];
        return "<a target='_blank' href='http://www.gramene.org/db/ontology/search?id="+id+"'>" + id + "</a>"
    }); // replace TO:\ with TO:
    */
    return str;
}
