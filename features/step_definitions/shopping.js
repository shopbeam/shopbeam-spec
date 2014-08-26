var expect = require('expect.js');
module.exports = function() {

  this.When(/^I add (.*) to my bag$/, function (product, callback) {

    var page = this.pageManager.page('shoppable');
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

    var page = this.pageManager.page('shoppable');
    page.cart.show(function(err) {
      if (err) {
        return callback.fail(err);
      }
      page.cart.items(function(err, items){
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

};
