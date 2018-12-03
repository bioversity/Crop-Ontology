/* jshint esversion: 6 */
"strict mode";


$.fn.serializeObject = function() {
   let o = {},
   	   a = this.serializeArray();

   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

$.fn.hasAttr = function(name) {
	return this.attr(name) !== undefined;
};
