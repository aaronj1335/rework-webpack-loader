var urlParse = require('url').parse;
var loaderUtils = require('loader-utils');

var addImport = require('./../add-import');
var stripQuotes = require('./../strip-quotes');
var mark = require('./../mark');

function transform(ast, reworkInstance) {
  ast.rules.forEach(function(rule) {
    if (!rule.declarations) {
      if (rule.type === 'media') {
        transform(rule, reworkInstance);
      }
      return;
    }

    rule.declarations.forEach(function(declaration) {
      var urlRe = /url\(([^)]+)\)/g;

      if (!declaration.value)
        return;

      declaration.value = declaration.value
        .replace(urlRe, function(declarationValue, url) {
          url = stripQuotes(url);
          // make sure it's not external url, etc. before rewriting it
          // this behaviour matches the webpack's own css-loader behaviour
          if (loaderUtils.isUrlRequest(url)) {
            url = loaderUtils.urlToRequest(url);
            addImport(reworkInstance, urlParse(url).pathname);
            return 'url("' + mark(url) + '")';
          } else {
            return declarationValue;
          }
        });
    });
  });
}

module.exports = transform;

module.exports.processJs = function(js) {
  return js.replace(mark.re, function(_, url) {
    var parsed = urlParse(url);
    var rest = (parsed.query || '') + (parsed.hash || '');

    return '/" + require(' + JSON.stringify(parsed.pathname) + ') + "' + rest;
  });
};
