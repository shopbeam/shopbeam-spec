var util = require('util');
var Page = require('../../util/page');

function Shoppable(world){
  Page.call(this, world);
  this.products = this.component('products');
  this.productDetails = this.component('product-details');
  this.checkout = this.component('checkout');
}

util.inherits(Shoppable, Page);

module.exports = Shoppable;
