(function(Window, Document, factory) {

    'use strict';

    var theModule = factory(Document);

    if (typeof define === 'function' && define.amd) {
      define(theModule);
    } else if ('undefined' !== typeof module && module.exports) {
      module.exports = theModule;
    } else {
      Window.qbGl = theModule;
    }

  }(window, document, function(document) { /* jshint ignore:line */
      'use strict';
