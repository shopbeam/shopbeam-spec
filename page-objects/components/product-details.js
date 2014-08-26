var util = require('util');
var Component = require('../../util/component');

function ProductDetails(){
  Component.call(this);
}

util.inherits(ProductDetails, Component);

ProductDetails.prototype.addToBag = function(callback) {
  this.browser
  .timeoutsAsyncScript(5000)
  .executeAsync(function(done){

    function findButton(){
      var lightboxIFrame = document.querySelector('#shopbeam-lightbox iframe');
      if (!lightboxIFrame) {
        return;
      }
      var _window = lightboxIFrame.contentWindow;
      if (!_window.jQuery) {
        return;
      }
      var welcomeToShopbeam = _window.jQuery('button:contains(Continue):last');
      if (welcomeToShopbeam.length) {
        welcomeToShopbeam.click();
      }
      var addToBag = _window.jQuery('button:contains("Add To Bag"):last');
      if (!addToBag.length) {
        return;
      }
      return addToBag;
    }

    var interval = setInterval(function(){
      var addToBag = findButton();
      if (addToBag) {
        clearInterval(interval);
        addToBag.click();
        done();
      }
    }, 100);
  }, function(err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
};

module.exports = ProductDetails;
