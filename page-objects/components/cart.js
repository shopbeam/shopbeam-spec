var util = require('util');
var Component = require('../../util/component');

function Cart(){
  Component.call(this);
}

util.inherits(Cart, Component);

Cart.prototype.show = function(callback) {
  this.browser
  .timeoutsAsyncScript(5000)
  .executeAsync(function(done){

    function findButton(){
      var cartIFrame = document.querySelector('#shopbeam-cart');
      if (!cartIFrame) {
        return;
      }
      var doc = cartIFrame.contentWindow.document;
      return doc.querySelector('button.view-bag');
    }

    var interval = setInterval(function(){
      var showCart = findButton();
      if (showCart) {
        clearInterval(interval);
        showCart.click();
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

Cart.prototype.items = function(callback) {
  this.browser
  .timeoutsAsyncScript(5000)
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
      var checkoutIFrame = document.querySelector('#shopbeam-checkout');
      if (!checkoutIFrame) {
        return;
      }
      var _window = checkoutIFrame.contentWindow;
      return _window.jQuery('[cart-items]:first');
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
};

module.exports = Cart;
