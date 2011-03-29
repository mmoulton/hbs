var hbs = {};
var handlebars = null;
var handlebarsPath = null;

Object.defineProperty(hbs, "handlebars", {
  enumerable: true,
  get: function() {
    if(handlebars == null) {
      if(handlebarsPath == null) {
        handlebars = require('handlebars');
      } else {
        handlebars = require(hbs.handlebarsPath);
      }
    }
    return handlebars;
  },
  set: function(value) {
    handlebars = value;
  }
});

Object.defineProperty(hbs, "handlebarsPath", {
  enumerable: true,
  get: function() {
    return handlebarsPath;
  },
  set: function(value) {
    handlebarsPath = value;
    handlebars = null;
  }
})

var compile = hbs.compile = function (source, options) {
  if (typeof source == 'string') {
    var template = hbs.handlebars.compile(source);
    return function (options) {
      // This should not be required, but currently Handlebars does not merge custom helpers with
      // the defaults when you use 'template(data, helpers)'
      // This has been reported as: https://github.com/wycats/handlebars.js/issues/#issue/57
      //      return template(options, options.blockHelpers);
      var blockHelpers = options.blockHelpers;
      for (var helper in blockHelpers) {
        if (blockHelpers.hasOwnProperty(helper) &&
            Object.prototype.toString.call(blockHelpers[helper]) === "[object Function]") {
          hbs.handlebars.registerHelper(helper, blockHelpers[helper]);
        }
      }
      return template(options);
    };
  } else {
    return source;
  }
};

var render = hbs.render = function(template, options) {
  var compiledTemplate = compile(template, options);
  return compiledTemplate(options);
};

module.exports = hbs;
