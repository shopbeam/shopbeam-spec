var url = require('url');
var Page = require('./page');
var requireDir = require('require-dir');

function PageManager(world) {
  this.world = world;
  if (world) {
    this.config = world.config;
  }
  this.pages = requireDir('../page-objects/pages');
  this.unknown = Page.unknown;
}

PageManager.prototype.page = function(name) {
  var page = new (this.pages[name])();
  page.setBrowser(this.world.browser);
  return page;
};

PageManager.prototype.visit = function(targetUrl, callback){
  if (!/^https?\:\/\//i.test(targetUrl)) {
    targetUrl = url.resolve(this.config.baseUrl, targetUrl);
  }
  this.world.browser.url(targetUrl).call(function(err){
    if (err) {
      this.world.page = this.unknown;
      callback(err);
      return;
    }
    callback();
  }.bind(this));
};

module.exports = PageManager;
