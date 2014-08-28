var expect = require('expect.js');
module.exports = function() {

  this.When(/^I add (.*) to my bag$/, function (product, callback) {

    var page = this.page('shoppable');
    page.products.showDetailsByDescription(product, function(err) {
      if (err) {
        return callback.fail(err);
      }
      page.productDetails.addToBag(function(err){
        if (err) {
          return callback.fail(err);
        }
        callback();
      });
    }.bind(this));
  });

  this.Then(/^my shopping bag has:$/, function (table, callback) {

    var page = this.page('shoppable');
    page.checkout.open(function(err) {
      if (err) {
        return callback.fail(err);
      }
      page.checkout.items(function(err, items){
        if (err) {
          return callback.fail(err);
        }
        var expected = table.rows();
        if (expected.length !== items.length) {
          expect(items.length).to.be(expected.length);
        }
        var productField = 0;
        var quantityField = 1;
        for (var i = 0; i < expected.length; i++) {
          var expectedItem = expected[i];
          var item = items[i];
          expect(item.description).to.contain(expectedItem[productField]);
          expect(item.quantity).to.eql(expectedItem[quantityField]);
        }
        callback();
      });
    }.bind(this));
  });

  this.When(/^I complete checkout$/, function (callback) {
    var page = this.page('shoppable');
    var browser = this.browser;
    page.checkout.next(function(err){
      if (err) {
        return callback.fail(err);
      }
      // fill payment and shipping with default data
      page.checkout.fillForm(function(err){
        if (err) {
          return callback.fail(err);
        }
        page.checkout.next(function(err){
          if (err) {
            return callback.fail(err);
          }
          // order summary
          page.checkout.next(callback);
        });
      });
    });
  });

  this.Then(/^I see purchase confirmation$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    var expectedText = "Your order is being processed";
    var page = this.page('shoppable');
    page.checkout.getConfirmationText(function(err, text){
      if (err) {
        return callback.fail(err);
      }
      expect(text).to.contain(expectedText);
      callback();
    });
  });

};
