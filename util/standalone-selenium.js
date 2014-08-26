var util = require('util');
var EventEmitter = require("events").EventEmitter;
var selenium = require('selenium-standalone');

function StandaloneSelenium() {
  EventEmitter.call(this);
  this.isReady = false;
  this.isStarting = false;
}

util.inherits(StandaloneSelenium, EventEmitter);

StandaloneSelenium.prototype.start = function() {
  if (this.isReady || this.isStarting) {
    return;
  }
  this.isStarting = true;
  var self = this;
  var spawnOptions = { stdio: 'pipe' };

  // options to pass to `java -jar selenium-server-standalone-X.XX.X.jar`
  var seleniumArgs = [
    '-browserSideLog',
    '-debug'
    //'-debug'
  ];

  var server = this.server = selenium(spawnOptions, seleniumArgs);
  // or, var server = selenium();
  // returns ChildProcess instance
  // http://nodejs.org/api/child_process.html#child_process_class_childprocess

  // spawnOptions defaults to `{ stdio: 'inherit' }`
  // seleniumArgs defaults to `[]`
  var ready = false;
  var output = '';
  var onReady = function(){
    self.isReady = true;
    self.isStarting = false;
    self.emit('ready');
  }.bind(this);

  server.stdout.on('data', function(data) {
    //console.log(data.toString());
    if (!ready) {
      output += data.toString();
      if (output.lastIndexOf('Started SocketListener') >= 0) {
        ready = true;
        console.log('selenium server ready');
        onReady();
      }
    }
  });
};

StandaloneSelenium.prototype.ready = function(callback) {
  if (this.isReady) {
    setTimeout(callback);
  } else {
    this.on('ready', callback);
    this.start();
  }
};

StandaloneSelenium.prototype.kill = function() {
  if (!this.server) {
    return;
  }
  this.server.kill();
  console.log('selenium server killed');
  this.server = null;
};

module.exports = new StandaloneSelenium();
