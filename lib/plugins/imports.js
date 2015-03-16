var loaderUtils = require('loader-utils');
var addImport = require('./../add-import');
var stripQuotes = require('./../strip-quotes');
var patterns = require('./../patterns');

module.exports = function(ast, reworkInstance) {
  var keepRules = [];

  ast.rules.forEach(function(rule) {
    if (rule.type === 'import') {
      // accept both url('someUrl') and 'someUrl'
      var matches = patterns.url.exec(rule.import);
      var url = stripQuotes(matches && matches[1] || rule.import);
      // make sure it's not external url, etc.
      // this behaviour matches the webpack's own css-loader behaviour
      if (loaderUtils.isUrlRequest(url)) {
        return addImport(reworkInstance, loaderUtils.urlToRequest('~' + url));
      }
    }
    keepRules.push(rule);
  });

  ast.rules = keepRules;
};
