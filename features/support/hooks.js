var S = require('string');
var fs = require('fs');
var path = require('path');
var webdriverio = require('webdriverio');
var shell = require('shelljs');
var setupWebdriverCommands = require('../../webdriver-commands/setup');
var interactive = require('../../util/interactive');

module.exports = function hooks() {

  var browser;

  this.Before(function(callback) {
    if (!this.browser) {
      if (!browser) {
        var webDriverOptions = this.config.driver;
        browser = webdriverio.remote(webDriverOptions)
          .init()
          .timeoutsImplicitWait(this.config.implicitWait || 5000);
        setupWebdriverCommands(browser);
      }
      this.browser = browser;
    }
    callback();
  });

  this.After(function(scenario, callback) {
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
        if (!world.config.debug.replOnFail) {
          releaseBrowser();
          callback(err);
          return;
        }
        interactive(world, function(){
          releaseBrowser();
          callback(err);
        });
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
