
var webdriverio = require('webdriverio');

module.exports = function hooks() {

  var browser;

  this.Before(function(callback) {
    // Just like inside step definitions, "this" is set to a World instance.
    // It's actually the same instance the current scenario step definitions
    // will receive.

    // Let's say we have a bunch of "maintenance" methods available on our World
    // instance, we can fire some to prepare the application for the next
    // scenario:

    //this.createSomeUsers();
    if (!this.browser) {
      if (!browser) {
        var webDriverOptions = this.config.driver;
        browser = webdriverio.remote(webDriverOptions).init();
      }
      this.browser = browser;
    }

    callback();
  });

  this.After(function(callback) {
    // Again, "this" is set to the World instance the scenario just finished
    // playing with.

    // We can then do some cleansing:

    // this.emptyDatabase();
    if (this.browser) {
      if (browser === this.browser) {
        browser = null;
      }
      this.browser.end();
      this.browser = null;
    }

    // Release control:
    callback();
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
