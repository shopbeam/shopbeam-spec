var url = require('url');
var util = require('util');
var Component = require('./component');

function Page(world){
  Component.call(this, world);
}

util.inherits(Page, Component);

Page.prototype.visit = function(params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  // compose a target url
  var targetUrl = this.route;
  if (targetUrl.substr(0, 1) === '/') {
    targetUrl = url.resolve(this.config.baseUrl, targetUrl);
  }
  var usedParams = {};
  targetUrl = targetUrl
    .replace(/\*.*$/, "")
    .replace(/\:[a-z0-9]+[\?]?/g, function(match){
      var name = match.substr(1, match.length - 2 -
        (match.substr(match.length - 1) === '?') ? 1 : 0);
      if (params && params[name]) {
        usedParams[name] = true;
        return params[name];
      }
      return '';
    })
    .replace(/\/[\/]+/g, '/');

  // additional query params
  Object.keys(params).forEach(function(name) {
    if (name === '_hash' || usedParams[name]) {
      return;
    }
    targetUrl += (targetUrl.indexOf('?') < 0) ? '?' : '&';
    targetUrl += name + '=' + encodeURIComponent(value);
  });

  if (params._hash) {
    targetUrl += '#' + params._hash;
  }

  this.browser.url(targetUrl).call(callback);
};

module.exports = Page;
