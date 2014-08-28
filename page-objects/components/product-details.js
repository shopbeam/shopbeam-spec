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
    .isVisible('.new-experience-dialog', function(err, isVisible) {
      var browser = self.browser;
      if (isVisible) {
        browser = browser
          .waitForVisible('button[ng-click="closeNewExperienceDialog()"]')
          .click('button[ng-click="closeNewExperienceDialog()"]');
      }
      browser
        .click('[ng-click="addToCartHandler()"]')
        .switchToDefault().call(callback);
    });
};

module.exports = ProductDetails;
