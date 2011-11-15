/**
 * Made by Luca Matteis - @lmatteis
 */
;(function ( $, window, document, undefined ) {
  var pluginName = 'report',
      defaults = {};

  function Plugin( element, options ) {
    this.element = element;
    this.$elm = $(element);
    this.options = options;

    this._defaults = defaults;
    this._name = pluginName;

    this.columns = {};
    this.columnsIdx = 0;
    
    this.init();
  }

  Plugin.prototype.init = function () {
    this.$elm.html("<thead><tr></tr></thead><tbody></tbody>");
    for(var i=0, len=this.options.length; i<len; i++) {
      this.addRow(this.options[i]);
    }
    this.fill();
  };

  Plugin.prototype.addRow = function (obj) {
    var $tr = $("<tr></tr>"),
        self = this;
    $.each(obj, function(key, val) {
      if(typeof self.columns[key] === "undefined") {
        self.$elm.find("thead tr").append("<th>"+key+"</th>");
        self.columns[key] = self.columnsIdx++;
      }
      self.createTd($tr, key, val);
    });
    this.$elm.find("tbody").append($tr);
  };

  Plugin.prototype.createTd = function($tr, key, val) {
    var children = $tr.children().length,
        idx = this.columns[key];

    if(idx > children) { // means we need to add extra empty <td>
      var diff = idx - children;
      for(var i=0; i<diff; i++) {
        $tr.append("<td></td>");
      }
    }
    
    if (idx < children) { // let's not append, select the TD
      $tr.children().eq(idx).text(val);
    } else { // append
      $tr.append("<td>"+val+"</td>");
    }
  };

  Plugin.prototype.fill = function() {
    var numcols = this.columnsIdx;

    this.$elm.find("tbody tr").each(function() {
      var $this = $(this),
          children = $this.children();

      if(children.length < numcols) { // fill it out with empty tds
        var diff = numcols - children.length;
        for(var i=0; i<diff; i++) {
          $this.append("<td></td>");
        }
      }
    });
  };

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      new Plugin( this, options );
      /*
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
      */
    });
  }
})(jQuery, window, document);
