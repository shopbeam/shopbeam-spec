var util = require('util');
var Component = require('../../util/component');

function ProductDetails(world){
  Component.call(this, world);
  this.at('#shopbeam-lightbox > iframe');
}

util.inherits(ProductDetails, Component);

ProductDetails.prototype.addToBag = function(callback) {
  // TODO: replace this nasty ng-click selectors (eg. both should be [type=submit])
  var self = this;
  this.browser.switchToFrame(this.s)
    .getCssProperty('.new-experience-dialog', 'display', function(err, display) {
      if (err) {
        callback(err);
        return;
      }
      var browser = self.browser;
      if (display.value !== 'none') {
        browser = browser
          .waitForVisible('button[ng-click="closeNewExperienceDialog()"]')
          .clickHarder('button[ng-click="closeNewExperienceDialog()"]');
      }
      browser
        .clickHarder('[ng-click="addToCartHandler()"]')
        .switchToDefault().call(callback);
    });
};

module.exports = ProductDetails;
