var url = require('url');
var path = require('path');
var Page = require('./page');
var requireDir = require('require-dir');

function PageManager(world, dir) {
  this.world = world;
  world.pageManager = this;
  this.pages = requireDir(path.join(dir, 'pages'));
  this.components = requireDir(path.join(dir, 'components'));

  world.visit = function(targetUrl, callback){
    return this.pageManager.visit(targetUrl, callback);
  };
  world.page = function(name){
    return this.pageManager.page(name);
  };
}

PageManager.prototype.page = function(name) {
  var page = new (this.pages[name])(this.world);
  return page;
};

PageManager.prototype.component = function(name) {
  var component = new (this.components[name])(this.world);
  return component;
};

PageManager.prototype.visit = function(targetUrl, callback){
  if (!/^https?\:\/\//i.test(targetUrl)) {
    targetUrl = url.resolve(this.world.config.baseUrl, targetUrl);
  }
  this.world.browser.url(targetUrl).call(function(err){
    if (err) {
      callback(err);
      return;
    }
    callback();
  }.bind(this));
};

module.exports = PageManager;
