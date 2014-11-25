var url = require('url');
var extend = require('extend');
var path = require('path');
var fs = require('fs');
var template = require('template');
var yaml = require('js-yaml');
var PageManager = require('page-object-pattern').PageManager;
var requireDir = require('require-dir');

function loadConfig(){
  var configNames = 'base,users,' + process.env.CONFIG;
  var configOptions = {};
  configNames.split(/[ \,\+]+/g).forEach(function(name) {
    var filename = path.join(__dirname, '../../config/', name.trim() + '.yml');
    if (!fs.existsSync(filename)) {
      return;
    }
    console.log('  loading config:', name);
    var contents = fs.readFileSync(filename).toString();
    contents = template(contents, {
      env: process.env
    });
    var configValues = yaml.safeLoad(contents);
    extend(true, configOptions, configValues);
  });
  return configOptions;
}

var config = loadConfig();

module.exports = function() {
  this.World = function World(callback) {
    this.config = extend(true, {}, config);
    this.user = extend({}, this.config.users.default);

    var pageManager = new PageManager(this);
    var dir = path.join(__dirname, '../../page-objects');
    var pages = requireDir(path.join(dir, 'pages'));
    var elements = requireDir(path.join(dir, 'elements'));
    pageManager.define(pages);
    pageManager.define(elements);

    if (this.config.spawnSelenium) {
      require('../../util/standalone-selenium').ready(callback);
    } else {
      callback();
    }
  };
};
