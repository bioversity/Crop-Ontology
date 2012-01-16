var languages = {
  default: "english",
  all: [
    "english",
    "french",
    "spanish"
  ],
  translate: function(currUser, value) {
    if(!(value instanceof Object)) {
      // value is a string with no translations.
      // default to what it is
      return value;
    }
    function findTranslation(lang, obj) {
      var translation = "";
      translation = obj[lang];  
      if(!obj[lang]) { 
        // this object doesn't contain the language.
        // show the first key
        for(var i in obj) {
          translation = obj[i];
          break;
        }
      }
      return translation;
    }
    var translation = "";
    var lang = auth.getLanguage(currUser);
    if(!lang) { // show default language
      translation = findTranslation(this.default, value);
    } else {
      // show the language that the user set
      translation = findTranslation(lang, value);
    }
    return translation;
  }
};

exports = languages;
