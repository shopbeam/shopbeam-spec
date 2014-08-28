var util = require('util');
var Component = require('../../util/component');

function Checkout(world){
  Component.call(this, world);
  this.at('#shopbeam-checkout');
}

util.inherits(Checkout, Component);

Checkout.prototype.open = function(callback) {
  var self = this;
  this.browser
    .isVisible(this.s, function(err, isVisible) {
      if (isVisible) {
        callback();
        return;
      }
      self.browser.switchToFrame('#shopbeam-cart')
        .click('button.view-bag > h3')
        .switchToDefault()
        .call(callback);
    });
};

Checkout.prototype.next = function(callback) {
  var self = this;
  // ensure the cart is open
  this.open(function(err){
    if (err) {
      return callback(err);
    }
    self.browser.switchToFrame(self.s)
      .waitForVisible('.desktop-footer button.checkout, .desktop-footer button.next')
      .click('.desktop-footer button.checkout, .desktop-footer button.next')
      .switchToDefault()
      .call(callback);
  });
};

Checkout.prototype.fillForm = function(callback) {
  var self = this;
  this.browser.switchToFrame(this.s)
    .fillFields(this.world.user)
    .switchToDefault()
    .call(callback);
};

Checkout.prototype.getConfirmationText = function(callback) {
  this.browser.switchToFrame(this.s)
    .waitForVisible('.thanks', 20000)
    .getText('.thanks', callback)
    .switchToDefault();
};

Checkout.prototype.items = function(callback) {

  var self = this;
  // ensure the cart is open
  this.open(function(err){
    if (err) {
      return callback(err);
    }

    self.browser
      .switchToFrame(self.s)
      .waitForVisible('[cart-items]')
      .timeoutsAsyncScript(3000)
      .executeAsync(function(done){

        function serialize(items) {
          return items.map(function(){
            var item = $(this);
            return {
              quantity: item.find('.quantity').val(),
              description: item.find('.title-row .span6').text()
            };
          }).get();
        }

        function findItems(){
          return $('[cart-items]:first');
        }

        var interval = setInterval(function(){
          var items = findItems();
          if (items && items.length) {
            clearInterval(interval);
            done(serialize(items.find('.item')));
          }
        }, 100);
      }, function(err, result){
        if (err) {
          return callback(err);
        }
        callback(null, result.value);
      });

    });
};

module.exports = Checkout;
