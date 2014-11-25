var util = require('util');
var Page = require('page-object-pattern').Page;

function Shoppable(world){
  Page.call(this, world);
  this.products = this.element('products');
  this.productDetails = this.element('product-details');
  this.checkout = this.element('checkout');
}

util.inherits(Shoppable, Page);

module.exports = Shoppable;
