var languages = {
  default: "english",
  all: [
    "english",
    "french",
    "spanish"
  ],
  capitaliseFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  html: function(){
    var html = "<select>";
    for(var i=0; i<this.all.length; i++) {
      html += "<option>" + this.capitaliseFirstLetter(this.all[i]) + "</option>"; 
    }
    html += "</select>";
  }
};

exports = languages;
