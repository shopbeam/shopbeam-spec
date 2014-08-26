var S = require('string');
var fs = require('fs');
var path = require('path');
var webdriverio = require('webdriverio');
var shell = require('shelljs');

module.exports = function hooks() {

  var browser;

  this.Before(function(callback) {
    // Just like inside step definitions, "this" is set to a World instance.
    // It's actually the same instance the current scenario step definitions
    // will receive.

    // Let's say we have a bunch of "maintenance" methods available on our World
    // instance, we can fire some to prepare the application for the next
    // scenario

    if (!this.browser) {
      if (!browser) {
        var webDriverOptions = this.config.driver;
        browser = webdriverio.remote(webDriverOptions).init();
      }
      this.browser = browser;
    }

    callback();
  });

  this.After(function(scenario, callback) {
    // Again, "this" is set to the World instance the scenario just finished
    // playing with.
    var world = this;

    function releaseBrowser() {
      if (world.browser) {
        if (browser === world.browser) {
          browser = null;
        }
        world.browser.end();
        world.browser = null;
      }
    }

    if (scenario.isFailed()) {
      var filename = path.join(this.config.driver.screenshots,
        path.relative(path.resolve(__dirname, '../..'), scenario.getUri())
          .replace(/\.feature$/, '/' +
           S(scenario.getName()).slugify() +
           '.failure.png')
        );
      var screenshotDir = path.dirname(filename);
      if (!fs.existsSync(screenshotDir)) {
        shell.mkdir('-p', screenshotDir);
      }
      this.browser.saveScreenshot(filename, function(err) {
        if (err) {
          callback(err);
          return;
        }
        var stream = fs.readFileSync(filename);
        scenario.attach(stream, 'image/png', function(err) {
          callback(err);
        });
      }, function(err) {
        releaseBrowser();
        callback(err);
      });
    }
    else {
      releaseBrowser();
      callback();
    }
  });

  this.registerHandler('AfterFeatures', function (event, callback) {
    if (browser) {
      browser.end();
      browser = null;
    }
    require('../../util/standalone-selenium').kill();
    callback();
  });
};
