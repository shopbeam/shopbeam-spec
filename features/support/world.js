var url = require('url');
var extend = require('extend');
var path = require('path');
var fs = require('fs');
var template = require('template');
var yaml = require('js-yaml');
var PageManager = require('../../util/page-manager');

function loadConfig(){
  var configNames = 'base,' + process.env.CONFIG;
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
    this.pageManager = new PageManager(this);

    this.visit = function(targetUrl, callback){
      return this.pageManager.visit(targetUrl, callback);
    };

    if (this.config.spawnSelenium) {
      require('../../util/standalone-selenium').ready(callback);
    } else {
      callback();
    }
  };
};
